import {
  allowDrop,
  clickHandler,
  dragVertex,
  dropHandler,
  calcHandler,
  botHandler,
  clearHandler
} from "./Utils";
const canvas = document.getElementById("drop");
const vertex = document.getElementById("vertex");
const calc = document.getElementById("calc");
const bot = document.getElementById("bot");
const clear = document.getElementById("clear");

canvas?.addEventListener("dragover", allowDrop);
canvas?.addEventListener("mousedown", clickHandler);
canvas?.addEventListener("mouseup", clickHandler);
canvas?.addEventListener("mousemove", clickHandler);
canvas?.addEventListener("drop", dropHandler);

vertex?.addEventListener("drag", dragVertex);

calc?.addEventListener("click", calcHandler);

bot?.addEventListener("click", botHandler);
clear?.addEventListener("click", clearHandler);
