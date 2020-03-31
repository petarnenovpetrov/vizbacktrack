import { EventEmitter } from "events";
import Vertex from "./Vertex";

export default class Edge {
  lineWidth = 1;
  color = "black";
  length = 0;
  constructor(public startV: Vertex, public endV: Vertex) {}
  public calcLength() {
    this.length = Math.floor(
      Math.sqrt(
        (this.startV.center.x - this.endV.center.x) ** 2 +
          (this.startV.center.y - this.endV.center.y) ** 2
      )
    );
  }

  public getLineWidth() {
    return this.lineWidth;
  }

  public setLineWidth(lineWidth: number) {
    this.lineWidth = lineWidth;
  }

  public setColor(color: string) {
    this.color = color;
  }

  public getColor() {
    return this.color;
  }
  public getLength() {
    return this.length;
  }
}
