interface Vertex {
  label: number;
  used: boolean;
  links: Link[];
}

interface Link {
  vertex: Vertex;
  cost: number;
}

interface Results {
  path: number[];
  cost: number;
}

const v1: Vertex = {
  label: 1,
  used: false,
  links: [],
};
const v2: Vertex = {
  label: 2,
  used: false,
  links: [],
};
const v3: Vertex = {
  label: 3,
  used: false,
  links: [],
};
const v4: Vertex = {
  label: 4,
  used: false,
  links: [],
};
const v5: Vertex = {
  label: 5,
  used: false,
  links: [],
};
const v6: Vertex = {
  label: 6,
  used: false,
  links: [],
};

v1.links = [
  { vertex: v2, cost: 3 },
  { vertex: v3, cost: 5 },
  { vertex: v4, cost: 2 },
  { vertex: v6, cost: 15 },
];
v2.links = [
  { vertex: v1, cost: 3 },
  { vertex: v3, cost: 6 },
  { vertex: v5, cost: 9 },
  { vertex: v6, cost: 12 },
];
v3.links = [
  { vertex: v1, cost: 5 },
  { vertex: v2, cost: 6 },
  { vertex: v4, cost: 7 },
  { vertex: v5, cost: 9 },
  { vertex: v6, cost: 4 },
];
v4.links = [
  { vertex: v1, cost: 2 },
  { vertex: v3, cost: 7 },
  { vertex: v5, cost: 8 },
  { vertex: v6, cost: 1 },
];
v5.links = [
  { vertex: v2, cost: 9 },
  { vertex: v3, cost: 9 },
  { vertex: v4, cost: 8 },
  { vertex: v6, cost: 2 },
];
v6.links = [
  { vertex: v4, cost: 1 },
  { vertex: v5, cost: 2 },
  { vertex: v2, cost: 12 },
  { vertex: v1, cost: 15 },
  { vertex: v3, cost: 4 },
];

function explore(currentStartV: Vertex, currentStartEnd: Vertex) {
  const q: number[] = [];
  const results: { path: number[]; cost: number }[] = [];
  let cost = 0;
  traverse(currentStartV, currentStartEnd);
  function traverse(startV: Vertex, endV: Vertex) {
    startV.used = true;
    q.push(startV.label);
    if (startV.label === endV.label) {
      startV.used = false;
      return true;
    }
    if (startV.links.every((v) => v.vertex.used)) {
      startV.used = false;
      return false;
    }
    for (const nextV of startV.links) {
      if (!nextV.vertex.used) {
        cost += nextV.cost;
        const res = traverse(nextV.vertex, endV);
        if (res) {
          const result = {
            path: new Array(...q),
            cost,
          };
          results.push(result);
        }
        q.pop();
        cost -= nextV.cost;
      }
    }
    startV.used = false;
    return false;
  }
  return results;
}

const run = () => explore(v1, v2);

// tslint:disable-next-line:no-console
const explrResults = run();
// tslint:disable-next-line:no-console
console.log(explrResults.length);

const travel = explrResults.filter((r) => r.path.length === 6);
const travelSort = (r1: Results, r2: Results) => r1.cost - r2.cost;

// tslint:disable-next-line:no-console
console.log(travel.sort(travelSort));

export default run;
