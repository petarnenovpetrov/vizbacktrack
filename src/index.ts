import {
  allowDrop,
  clickHandler,
  dragVertex,
  dropHandler,
  calcHandler,
  edges,
  vertexes,
  keydownHandler,
  botHandler,
  clearHandler
} from "./Utils";
const c = document.getElementById("drop");
const v = document.getElementById("vertex");
const e = document.getElementById("edge");
const b = document.getElementById("calc");
const bot = document.getElementById("bot");
const clear = document.getElementById("clear")

c?.addEventListener("dragover", allowDrop);
c?.addEventListener("mousedown", clickHandler);
c?.addEventListener("mouseup", clickHandler);
c?.addEventListener("mousemove", clickHandler);
c?.addEventListener("drop", dropHandler);

v?.addEventListener("drag", dragVertex);

b?.addEventListener("click", calcHandler);

bot?.addEventListener("click", botHandler);
clear?.addEventListener("click",clearHandler)

setInterval(fillInfo, 1000);

function fillInfo() {
  while (v?.firstChild) {
    v.removeChild(v.firstChild);
  }
  vertexes.forEach(currentV => {
    const li = document.createElement("li");
    li.innerText = currentV.getLabel();
    v?.appendChild(li);
  });

  while (e?.firstChild) {
    e.removeChild(e.firstChild);
  }
  edges.forEach(currentV => {
    const li = document.createElement("li");
    li.innerText =
      currentV.startV.getLabel() +
      "->" +
      currentV.endV.getLabel() +
      ":" +
      currentV.getLength();
    e?.appendChild(li);
  });
}
