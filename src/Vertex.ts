import Point from "./Point";
import Link from "./Link";
import { EventEmitter } from "events";

export default class Vertex extends EventEmitter {
  maxLinks: number;
  linkPool = new Set<Vertex>();
  links = [] as Link[];
  used = false;
  center = {} as Point;
  private radius = 10;
  private color = "lightblue";
  private label: string;
  public static nextUniqueLabel = 0;
  constructor(x: number, y: number, maxLinks = Number.POSITIVE_INFINITY) {
    super();
    this.center = new Point(x, y);
    this.label = (++Vertex.nextUniqueLabel).toString();
    this.maxLinks = maxLinks;
  }
  public getLabel() {
    return this.label;
  }
  public getRadius() {
    return this.radius;
  }
  public getColor() {
    return this.color;
  }
  public setColor(color: string) {
    this.color = color;
  }
  public setMaxLink(maxLinks: number) {
    this.maxLinks = maxLinks;
  }
  public getMaxLinks() {
    return this.maxLinks;
  }
  public decreaseMaxLinks() {
    this.maxLinks--;
  }
  public getLinkPool() {
    return this.linkPool;
  }
}
