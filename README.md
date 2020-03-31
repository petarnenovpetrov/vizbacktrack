# Visualization BackTrack Algorithm  

## Installation steps  

### Prerequisites  

    0. Git
    1. NodeJs
    2. NPM
    3. Docker /not necessary/

### Clone repository

    ```bash
    cd ~
    mkdir nodejs_projects
    cd nodejs_projects
    git clone https://github.com/petarnenovpetrov/vizbacktrack.git
    cd vizbacktrack
    npm install
    ```

### If you have installed Docker on a local machine, just go

http://localhost:8080

OR

    ```bash
    npm run dev:serve
    ```

and go to

http://localhost:1234

## Usage  

### Fast demo with random vertexes from 3 to 9 and random edges between them  

    1. Click button "Bot";
    2. In form bellow add:
       1. number of start Vertex / 1 /
       2. number of end Vertex / N /
       3. delay in ms / 500 /
       4. push "Calc"
    3. To restart click button "Clear Canvas"
    4. Step 1

### Manual step:  

    1. Drag&Drop "vertex" to canvas to create a vertex
    2. Add min two vertexes
    3. Click in vertex circle and drag to another vertex circle to create an edge
    4. Create as many as you want edges and vertexes.
    5. Goto to step 2 in Fast demo;

### Results  

    1. In bottom right corner will displays:
       1. The shortest path from the start vertex to end vertex
       2. If the salesman problem is resolved then will show the path or undefined if not
       3. All possible combinations to reach end vertex from the start vertex
       4. All combinations
    2. In canvas
       during the calculations 
       will show all currently used vertexes in DODGERBLUE and edges in BOLD RED
    3. Explanations:
       1. 1->2:345 , means vertex 1 is connected to vertex 2 and edge length is 345px
       2. cost:456 , means distance in pixels, 456px

![Snapshot](./public/snapshots/gr1.png "Graph") 
![Snapshot](./public/snapshots/gr2.png "Graph") 
![Snapshot](./public/snapshots/gr3.png "Graph")  
