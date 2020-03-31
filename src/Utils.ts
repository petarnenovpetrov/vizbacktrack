import Vertex from "./Vertex";
import Edge from "./Edge";
import Result from "./Result";
import Bot from "./Bot";

export const vertexes: Vertex[] = [];
export const edges: Edge[] = [];
export let combinations = 0;

const canvas = document.getElementById("drop") as HTMLCanvasElement;
const bounceSound = document.getElementById("sound") as HTMLAudioElement;

export function dragVertex(e: DragEvent) {
  e.dataTransfer!.setData("vertex", JSON.stringify({ vertex: 1 }));
}

export function dropHandler(e: DragEvent) {
  e.preventDefault();
  const currentX = e.clientX - canvas.offsetLeft;
  const currentY = e.clientY - canvas.offsetTop;
  const vertex = new Vertex(currentX, currentY);
  vertex.on("clicked", e => {
    vertex.center = e;
    render(canvas);
  });
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

export function keydownHandler(e: KeyboardEvent) {
  e.preventDefault();
}

export function clickHandler(e: MouseEvent) {
  const clickX = e.offsetX;
  const clickY = e.offsetY;

  vertexes.forEach(v => {
    const delta = Math.sqrt(
      (clickX - v.center.x) ** 2 + (clickY - v.center.y) ** 2
    );
    if (delta <= v.getRadius()) {
      if (e.type === "mousedown") {
        line.startV = v;
      }
      if (e.type === "mouseup") {
        line.endV = v;
      }
      v.emit("clicked", { x: clickX, y: clickY });
    }
  });
  if (e.type === "mouseup") {
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
  edges.forEach(e => {
    e.calcLength();
    ctx.beginPath();
    ctx.lineWidth = e.getLineWidth();
    ctx.strokeStyle = e.getColor();
    ctx.moveTo(e.startV.center.x, e.startV.center.y);
    ctx.lineTo(e.endV.center.x, e.endV.center.y);
    ctx.stroke();
  });
  vertexes.forEach(v => {
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
  const resultElement = <HTMLSpanElement>document.getElementById("results");
  const startV = (<HTMLInputElement>document.getElementById("startv")).value;
  const endV = (<HTMLInputElement>document.getElementById("endv")).value;
  const delayMS = (<HTMLInputElement>document.getElementById("delay")).value;
  edges.forEach(buildLinks);
  const v1 = vertexes[Number(startV) - 1];
  const v2 = vertexes[Number(endV) - 1];
  const delayInMS = Number(delayMS) || 0;
  const results = v1 && v2 && (await backtrack(v1, v2, delayInMS));

  resultElement.innerText = `Shortest path: ${JSON.stringify(
    results.sort(comparerPath)[0]
  )}
  Shortest salesman: ${JSON.stringify(
    results.sort(comparerPath).filter(r => r.path.length === vertexes.length)[0]
  )}
  All possible paths: ${results.length}
  All combinations: ${combinations}`;
}

function buildLinks(e: Edge) {
  if (!e.startV.links.filter(l => l.vertex === e.endV).length) {
    e.startV.links.push({
      vertex: e.endV,
      cost: e.getLength()
    });
  } else {
    e.startV.links.forEach(l => {
      if (l.vertex === e.endV) l.cost = e.getLength();
    });
  }
  if (!e.endV.links.filter(l => l.vertex === e.startV).length) {
    e.endV.links.push({
      vertex: e.startV,
      cost: e.getLength()
    });
  } else {
    e.startV.links.forEach(l => {
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
    bounceSound.play();
    await delay(delayInMS);

    if (startV.getLabel() === endV.getLabel()) {
      combinations++;
      startV.used = false;
      return true;
    }
    if (startV.links.every(v => v.vertex.used)) {
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
            cost
          };
          results.push(result);
        }
        q.pop();
        nextV.vertex.setColor("lightblue");
        cost -= nextV.cost;
        resetEdges();
        colorEdge(q);
        render(canvas);
        bounceSound.play();
        await delay(delayInMS);
      }
    }

    startV.used = false;
    return false;
  }
  currentStartV.setColor("");
  resetEdges();
  colorEdge(q);
  render(canvas);
  bounceSound.play();

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
  edges.forEach(e => {
    e.setColor("black");
    e.setLineWidth(1);
  });
}

export function botHandler() {
  const canvas = document.getElementById("drop") as HTMLCanvasElement;
  Vertex.nextUniqueLabel = 0;
  edges.length = 0;
  vertexes.length = 0;
  const bot = new Bot(2, 9);
  bot.getVertexes().forEach(v => vertexes.push(v));
  bot.getEdges().forEach(e => edges.push(e));
  render(canvas);
}

export function clearHandler() {
  Vertex.nextUniqueLabel = 0;
  vertexes.length = 0;
  edges.length = 0;
  render(canvas);
}

//FIXME: find last filing and fix color
