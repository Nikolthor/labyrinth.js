function Graph(size){
    this.size = size;
    this.init();
}
Graph.prototype = {
    size: null,
    graph: {},

    /**
     * Initialize empty graph
     */
    createEmptyGraph(){
        var line = {};
        for(x = 1; x <= this.size; x++){
            line = {};
            this.graph[x] = line;
        }
        app = this;

    },

    init(){
        this.createEmptyGraph();
    },

    /**
     * Get edge
     * @param {int} x 
     * @param {int} y 
     * @returns int node value
     */
    get(x,y){
        if(this.graph[x] && this.graph[x][y]){
            return this.graph[x][y];
        } else {
            return 0;
        }
    },

    /**
     * Set edge
     * @param {int} x 
     * @param {int} y 
     * @param {int} val 
     */
    set(x,y,val){
        if(x > 0 && y > 0 && x <= this.size && y <= this.size){
            this.graph[x][y] = val;
            this.graph[y][x] = val;
        }
    },

    /**
     * Get connected nodes to num node
     * @param {int} num 
     * @returns 
     */
    getConnected(num){
        var res = [];
        for (const [key, value] of Object.entries(this.graph[num])) {
            if(value){
                res.push(parseInt(key));
            }
        }

        return res;
    },

    /**
     * Find shortest way between points
     * @param {int} start 
     * @param {int} end 
     * @returns {final: bool, all: array, shortest: array}
     */
    shortestWay(start, end){
        var size = this.size;

        
        var visited = Array.from({length: size+1}, (_, i) => false);
        var distances = Array.from({length: size+1}, (_, i) => Number.MAX_SAFE_INTEGER);
        
        var getMin = function(visited, distances){
            var min = Number.MAX_SAFE_INTEGER;
            var minNode = null;
            for(var i = 1; i <= size; i++){
                if(visited[i]==false && distances[i]<min){
                    min = distances[i];
                    minNode = i;
                }
            }

            return minNode;
        }

        distances[start] = 0;
        allAvailable = [];
        shortest = [];
        parentsMap = [];

        allAvailable.push(start);

        for(var i = 1; i <= size; i++){
            var min = getMin(visited, distances);
            visited[min] = true;

            if(this.graph[min]){
                for (const [key, value] of Object.entries(this.graph[min])) {
                    if(visited[key]==false && value && (newDistance = value + distances[min]) < distances[key]){
                        distances[key] = newDistance;
                        allAvailable.push(key);
                        parentsMap[key] = min;
                    }
                }
            }

        }

        var curr = parentsMap[end];
        shortest[end]=end;
        while(curr){
            shortest[curr]=curr;
            curr = parentsMap[curr];
        }

        return {
            final: distances[end] != Number.MAX_SAFE_INTEGER,
            all: allAvailable,
            shortest: shortest
        }
    },

    /**
     * Fast check way exists
     * @param {int} start 
     * @param {int} end 
     * @returns {final: bool, past: []}
     */
    fastWayExists(start, end){
        var current = Math.min(start, end);
        var final = Math.max(start, end);
        

        var itemsList = this.getConnected(1);
        var pastItems = [current];

        while(current != final && itemsList.length){
            var newToFind = itemsList.pop();
            current = newToFind;

            if(!pastItems.includes(newToFind)){
                pastItems.push(newToFind);
                var newList = this.getConnected(newToFind);
                newList.forEach(function(val){
                    if(val > newToFind){
                        itemsList.push(val);
                    } else {
                        itemsList.unshift(val);
                    }
                });
            }
        }

        return {
            final: current == final,
            past: pastItems
        };
    }
}