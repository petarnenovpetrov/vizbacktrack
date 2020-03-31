import Vertex from "./Vertex";
import Edge from "./Edge";

export default class Bot {
  triesToFindVertex = 0;
  vertexNumber: number;
  vertexes = [] as Vertex[];
  edges = [] as Edge[];
  constructor(minNumberVertex: number, maxNumberVertex: number) {
    this.vertexNumber = Bot.randomInRange(minNumberVertex, maxNumberVertex);
    this.generateVertexes();
    this.generateEdges();
  }

  public static randomInRange(lowBound: number, highBound: number) {
    return ((Math.random() * (highBound - lowBound + 1)) ^ 0) + lowBound;
  }
  public static stringifyVertex(arr: Vertex[]) {
    return arr
      .map((e) =>
        JSON.stringify({
          maxLinks: e.getMaxLinks(),
          linkPool: Array.from(e.getLinkPool()).map((v) => v.getLabel()),
        })
      )
      .join("\n");
  }

  generateVertexes() {
    for (let i = 0; i < this.vertexNumber; i++) {
      const maxLinks = Bot.randomInRange(1, this.vertexNumber - 1);
      const vX = Bot.randomInRange(10, 590);
      const vY = Bot.randomInRange(10, 490);
      const v = new Vertex(vX, vY, maxLinks);
      this.vertexes.push(v);
    }
  }

  generateEdges() {
    this.vertexes.forEach((v, index) => {
      this.generateEdge(index);
    });
  }

  generateEdge(vertexIndex: number) {
    const numberOfEdges = this.vertexes[vertexIndex].getMaxLinks();
    const linkPool = this.vertexes[vertexIndex].getLinkPool();
    while (linkPool.size < numberOfEdges) {
      const randomIndex = Bot.randomInRange(0, this.vertexes.length - 1);
      if (randomIndex !== vertexIndex) {
        if (!linkPool.has(this.vertexes[randomIndex])) {
          const randomLinkPool = this.vertexes[randomIndex].getLinkPool();
          if (!randomLinkPool.has(this.vertexes[vertexIndex])) {
            if (
              randomLinkPool.size < this.vertexes[randomIndex].getMaxLinks()
            ) {
              linkPool.add(this.vertexes[randomIndex]);
              randomLinkPool.add(this.vertexes[vertexIndex]);
            }
          }
        }
      }
      this.triesToFindVertex++;
      if (this.triesToFindVertex > 1000) {
        console.log("max try reaches...");
        this.triesToFindVertex = 0;
        break;
      }
    }
    const arrLinkPool = Array.from(linkPool);
    for (const vertex of arrLinkPool) {
      const currentEdge = new Edge(this.vertexes[vertexIndex], vertex);
      this.edges.push(currentEdge);
    }
  }

  public showVertexes() {
    console.log(Bot.stringifyVertex(this.vertexes));
  }

  public getVertexes() {
    return this.vertexes;
  }
  public getEdges() {
    return this.edges;
  }
}
