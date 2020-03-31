import Vertex from "../Vertex";

describe("Vertex class", () => {
  beforeAll(() => {
    Vertex.nextUniqueLabel = 0;
  });
  it("should create instance", () => {
    const v1 = new Vertex(0, 0, 5);
    expect(Vertex.nextUniqueLabel).toEqual(1);
    expect(v1).toBeDefined();
    expect(v1).toBeInstanceOf(Vertex);
    expect(v1.maxLinks).toEqual(5);
    expect(v1.getColor()).toEqual("lightblue");
    expect(v1.getLabel()).toEqual("1");
    expect(v1.getMaxLinks()).toEqual(5);
    expect(v1.getRadius()).toEqual(10);
    expect(v1.getLinkPool()).toBeInstanceOf(Set);
    expect(v1.getLinkPool().size).toEqual(0);
  });
});
