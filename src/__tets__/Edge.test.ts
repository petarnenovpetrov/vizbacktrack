import Edge from "../Edge";
import Vertex from "../Vertex";

describe("Edge class", () => {
  it("should create instance", () => {
    Vertex.nextUniqueLabel=0;    
    const v1 = new Vertex(0, 0, 5);
    const v2 = new Vertex(100, 0, 2);
    

    const testEdge = new Edge(v1, v2);
  });
});
