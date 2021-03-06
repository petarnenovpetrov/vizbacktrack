import Vertex from "./Vertex";
import Edge from "./Edge";
import Result from "./Result";
import Bot from "./Bot";

export const vertexes: Vertex[] = [];
export const edges: Edge[] = [];
export let combinations = 0;

const canvas = document.getElementById("drop") as HTMLCanvasElement;
const vertex = document.getElementById("vertex");
const edge = document.getElementById("edge");
const minV = document.getElementById("minV") as HTMLInputElement;
const maxV = document.getElementById("maxV") as HTMLInputElement;
const startV = document.getElementById("startv") as HTMLInputElement;
const endV = document.getElementById("endv") as HTMLInputElement;
const delayMS = document.getElementById("delay") as HTMLInputElement;
const resultElement = document.getElementById("results") as HTMLSpanElement;
const bounceSound = document.getElementById("sound") as HTMLAudioElement;
const vertexesNumber = document.getElementById(
  "vertexesNumber"
) as HTMLSpanElement;
const edgesNumber = document.getElementById("edgesNumber") as HTMLSpanElement;

let isCalcRunning = false;

const updateInfo = () => setInterval(fillInfo, 1000);
let updatedInfoPointer = updateInfo();

function fillInfo() {
  while (vertex?.firstChild) {
    vertex.removeChild(vertex.firstChild);
  }
  vertexesNumber.innerText = vertexes.length.toString();
  vertexes.forEach((currentV) => {
    const li = document.createElement("li");
    li.innerText = currentV.getLabel();
    vertex?.appendChild(li);
  });

  while (edge?.firstChild) {
    edge.removeChild(edge.firstChild);
  }
  edgesNumber.innerText = edges.length.toString();
  edges.forEach((currentV) => {
    const li = document.createElement("li");
    li.innerText =
      currentV.startV.getLabel() +
      "->" +
      currentV.endV.getLabel() +
      ":" +
      currentV.getLength();
    edge?.appendChild(li);
  });
}

export function dragVertex(e: DragEvent) {
  e.dataTransfer!.setData("vertex", JSON.stringify({ vertex: 1 }));
}

export function dropHandler(e: DragEvent) {
  e.preventDefault();
  const currentX = e.clientX - canvas.offsetLeft;
  const currentY = e.clientY - canvas.offsetTop;
  const vertex = new Vertex(currentX, currentY);

  vertexes.push(vertex);
  render(canvas);
}

export function allowDrop(e: DragEvent) {
  e.preventDefault();
}

interface Line {
  startV: Vertex;
  endV: Vertex;
}

let line = {} as Line;

let followsMousePointer = true;

export function clickHandler(e: MouseEvent) {
  e.preventDefault();
  const clickX = e.offsetX;
  const clickY = e.offsetY;

  vertexes.forEach((v) => {
    const delta = Math.sqrt(
      (clickX - v.center.x) ** 2 + (clickY - v.center.y) ** 2
    );
    if (e.type === "mousedown") {
      followsMousePointer = false;
    }
    if (delta <= v.getRadius()) {
      if (e.type === "mousedown") {
        line.startV = v;
      }
      if (e.type === "mouseup") {
        line.endV = v;
      }
      if (followsMousePointer) {
        v.emit("follow", { x: clickX, y: clickY }, canvas, render);
      }
    }
  });
  if (e.type === "mouseup") {
    followsMousePointer = true;
    if (
      line.startV &&
      line.endV &&
      line.startV.getLabel() !== line.endV.getLabel()
    ) {
      const e = new Edge(line.startV, line.endV);
      edges.push(e);
      render(canvas);
    }
    line = {} as Line;
  }
}

function render(c: HTMLCanvasElement) {
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, c.width, c.height);
  edges.forEach((e) => {
    e.calcLength();
    ctx.beginPath();
    ctx.lineWidth = e.getLineWidth();
    ctx.strokeStyle = e.getColor();
    ctx.moveTo(e.startV.center.x, e.startV.center.y);
    ctx.lineTo(e.endV.center.x, e.endV.center.y);
    ctx.stroke();
  });
  vertexes.forEach((v) => {
    ctx.beginPath();
    ctx.fillStyle = v.getColor();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.arc(v.center.x, v.center.y, v.getRadius(), 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.font = "20px";
    ctx.fillStyle = "black";
    ctx.fillText(
      v.getLabel(),
      v.center.x - v.getRadius() / 2,
      v.center.y + v.getRadius() / 2
    );
  });
}

export async function calcHandler() {
  if (isCalcRunning) return;
  isCalcRunning = true;
  clearInterval(updatedInfoPointer);
  edges.forEach(buildLinks);
  const v1 = vertexes[Number(startV.value) - 1];
  const v2 = vertexes[Number(endV.value) - 1];
  const delayInMS = Number(delayMS.value) || 0;
  clearResultsField();
  try {
    const results = v1 && v2 && (await backtrack(v1, v2, delayInMS));
    resultElement.innerText = `Shortest path: ${JSON.stringify(
      results.sort(comparerPath)[0]
    )}
  Shortest salesman: ${JSON.stringify(
    results
      .sort(comparerPath)
      .filter((r) => r.path.length === vertexes.length)[0]
  )}
  All possible paths: ${results.length}
  All combinations: ${combinations}`;
  } catch (err) {
    console.error(err.message || JSON.stringify(err));
  } finally {
    isCalcRunning = false;
    updatedInfoPointer = updateInfo();
  }
}

function buildLinks(e: Edge) {
  if (!e.startV.links.filter((l) => l.vertex === e.endV).length) {
    e.startV.links.push({
      vertex: e.endV,
      cost: e.getLength(),
    });
  } else {
    e.startV.links.forEach((l) => {
      if (l.vertex === e.endV) l.cost = e.getLength();
    });
  }
  if (!e.endV.links.filter((l) => l.vertex === e.startV).length) {
    e.endV.links.push({
      vertex: e.startV,
      cost: e.getLength(),
    });
  } else {
    e.startV.links.forEach((l) => {
      if (l.vertex === e.startV) l.cost = e.getLength();
    });
  }
}

async function backtrack(
  currentStartV: Vertex,
  currentStartEnd: Vertex,
  delayInMS: number
) {
  const q = [] as number[];
  const results = [] as Result[];
  let cost = 0;
  combinations = 0;
  await traverse(currentStartV, currentStartEnd);
  async function traverse(startV: Vertex, endV: Vertex) {
    q.push(+startV.getLabel());
    startV.used = true;
    startV.setColor("dodgerblue");
    resetEdges();
    colorEdge(q);
    render(canvas);
    //bounceSound.play();
    await delay(delayInMS);

    if (startV.getLabel() === endV.getLabel()) {
      combinations++;
      startV.used = false;
      return true;
    }
    if (startV.links.every((v) => v.vertex.used)) {
      combinations++;
      startV.used = false;
      return false;
    }
    for (const nextV of startV.links) {
      if (!nextV.vertex.used) {
        cost += nextV.cost;
        const res = await traverse(nextV.vertex, endV);
        if (res) {
          const result = {
            path: new Array(...q),
            cost,
          };
          results.push(result);
        }
        q.pop();
        nextV.vertex.setColor("lightblue");
        cost -= nextV.cost;
        resetEdges();
        colorEdge(q);
        render(canvas);
        //bounceSound.play();
        await delay(delayInMS);
      }
    }

    startV.used = false;
    return false;
  }
  currentStartV.setColor("lightblue");
  resetEdges();
  colorEdge(q);
  render(canvas);
  //bounceSound.play();

  return results;
}

function comparerPath(r1: Result, r2: Result) {
  return r1.cost - r2.cost;
}

function delay(ms: number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

function findEdge(labelVertexStart: string, labelVertexEnd: string) {
  const edge = edges.reduce((acc, e) => {
    if (
      (e.startV.getLabel() === labelVertexStart &&
        e.endV.getLabel() === labelVertexEnd) ||
      (e.startV.getLabel() === labelVertexEnd &&
        e.endV.getLabel() === labelVertexStart)
    )
      acc = e;
    return acc;
  }, {} as Edge);
  return edge;
}

function colorEdge(edges: number[]) {
  for (let i = 0; i < edges.length - 1; i++) {
    const currentEdge = findEdge(String(edges[i]), String(edges[i + 1]));
    currentEdge.setColor("red");
    currentEdge.setLineWidth(5);
  }
}

function resetEdges() {
  edges.forEach((e) => {
    e.setColor("black");
    e.setLineWidth(1);
  });
}

export function botHandler() {
  clearResultsField();
  Vertex.nextUniqueLabel = 0;
  edges.length = 0;
  vertexes.length = 0;
  const minVParsed = Number.parseInt(minV.value);
  const maxVParsed = Number.parseInt(maxV.value);

  const startRangeV = isNaN(minVParsed) ? 3 : minVParsed;
  const endRangeV = isNaN(maxVParsed) ? 9 : maxVParsed;

  clearCalcForm();

  const bot = new Bot(startRangeV, endRangeV);
  bot.getVertexes().forEach((v) => vertexes.push(v));
  bot.getEdges().forEach((e) => edges.push(e));
  render(canvas);
}

export function clearHandler() {
  clearResultsField();
  clearRangeForm();
  clearCalcForm();
  Vertex.nextUniqueLabel = 0;
  vertexes.length = 0;
  edges.length = 0;
  render(canvas);
}

function clearResultsField() {
  resultElement.innerHTML = "";
}

function clearRangeForm() {
  minV.value = "";
  maxV.value = "";
}

function clearCalcForm() {
  startV.value = "";
  endV.value = "";
  delayMS.value = "";
}
