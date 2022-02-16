function Labyrinth(){
    this.init();
}
Labyrinth.prototype = {
    width: null,
    height: null,
    roomsCount: null,
    display: null,
    graph: null,

    shortestRooms: [],
    availableRooms: [],

    algorythm: 1,
    usePathMasks: true,
    displayAvailableArea: true,
    displayPath: true,
    iterationCounter: 0,
    analyze: true,

    /**
     * Set using analyze of result labyrinth
     * @param {bool} state 
     */
    setAnalyze(state){
        this.analyze = state;
    },

    /**
     * Set using output of available area
     * @param {bool} state 
     */
    setDisplayAvailableArea(state){
        this.displayAvailableArea = state;
    },

    /**
     * Set using output of shortest path
     * @param {bool} state 
     */
    setDisplayPath(state){
        this.displayPath = state;
    },

    /**
     * Set using masks
     * @param {bool} state  
     */
    setUsePathMasks(state){
        this.usePathMasks = state;
    },

    /**
     * Set number of algorythm
     * @param {int} number number of labyrinth
     */
    setAlgorythm(number){
        this.algorythm = number;
    },

    /**
     * Set size of labyrinth. Drops currently generated labyrinth.
     * @param {int} width Rooms width count
     * @param {int} height Rooms height count
     */
    setSize(width, height){
        this.width = width;
        this.height = height;
        this.roomsCount = width*height;

        this.graph = new Graph(this.roomsCount);
        this.display.setDividers(this.width, this.height);
    },

    /**
     * Set display to output labyrinth
     * @param {Display} display Instance of Display
     */
    setDisplay(display){
        this.display = display;
    },

    /**
     * 
     * @param {integer} num Count of iterations
     */
    setIterationCounter(num){
        this.iterationCounter = num;
    },

    /**
     * Get generation iterations count
     * @returns Past iterations
     */
    getIterationCounter(){
        return this.iterationCounter;
    },

    /**
     * Initialize labyrinth
     */
    init(){

    },

    /**
     * Display current labyrinth state
     */
    updateDisplay(){
        this.showLabyrinth();
        this.display.finalImageProcess();
    },

    /**
     * Starts generation of labyrinth based on settings
     */
    generate(){

        if(this.algorythm){
            var algorythm = this.algorythm;
        } else {
            var algorythm = 1;
        }

        (this['algorythm'+algorythm])();

        if(this.analyze){
            var shortest = this.graph.shortestWay(1, this.roomsCount);

            this.shortestRooms = shortest.shortest;
            this.availableRooms = shortest.all;
        } else {
            this.shortestRooms = [];
            this.availableRooms = [];
        }


    },

    /**
     * Generation algorythm based on random
     */
    algorythm1(){
        this.createRandomLabyrinth();
        
        var res = this.graph.fastWayExists(1,this.roomsCount);
        var iterator = 1;
        while(!res.final){
            this.setIterationCounter(iterator++);
            this.createRandomLabyrinth();
            res = this.graph.fastWayExists(1,this.roomsCount);
        }
        
    },

    /**
     * Generation algorythm based on random generation with static normalisation and overlay mask
     */
    algorythm2(){
        if(this.usePathMasks){
            var mask = this.createZigZagMask();
        }
        
        this.createRandomLabyrinth();
        if(this.usePathMasks){
            this.overlayMask(mask);
        }
        this.normalizeLabyrinth2();
        

        var res = this.graph.fastWayExists(1,this.roomsCount);
        var iterator = 1;
        this.setIterationCounter(iterator);
        while(!res.final){
            this.setIterationCounter(iterator++);
            this.createRandomLabyrinth();
            if(this.usePathMasks){
                this.overlayMask(mask);
            }
            this.normalizeLabyrinth();

            res = this.graph.fastWayExists(1,this.roomsCount);
        }

    },

    /**
     * Generation algorythm based on random generation with random normalisation and overlay mask
     */
    algorythm3(){
        if(this.usePathMasks){
            var mask = this.createZigZagMask();
        }
        
        
        this.createRandomLabyrinth();
        if(this.usePathMasks){
            this.overlayMask(mask);
        }
        this.normalizeLabyrinth2();
        

        var res = this.graph.fastWayExists(1,this.roomsCount);
        var iterator = 1;
        this.setIterationCounter(iterator);
        while(!res.final){
            this.setIterationCounter(iterator++);
            this.createRandomLabyrinth();
            if(this.usePathMasks){
                this.overlayMask(mask);
            }
            this.normalizeLabyrinth2();

            res = this.graph.fastWayExists(1,this.roomsCount);
        }

    },

    /**
     * Create diagonal line mask that starts on first room and ends on last room
     * @returns mask
     */
    createStraightPathMask(){
        var mask = Array.from({length: this.width+1}, (_, i) => Array.from({length: this.height+1}, (_, i) => 0));

        for (let i = 1; i <= this.width; i++) {
            mask[i][i] = 1;
        }

        return mask;
    },

    /**
     * Create zig-zag mask
     * @returns 2 dimension array mask
     */
    createZigZagMask(){
        var mask = Array.from({length: this.width+1}, (_, i) => Array.from({length: this.height+1}, (_, i) => 0));
        var app = this;

        var maskMoveLine = function (x1,y1,x2,y2){
            var absX1, absY1, absX2, absY2, middleX, middleY;

            absX1 = 1 + Math.floor((app.width-1)*x1);
            absY1 = 1 + Math.floor((app.height-1)*y1);
            absX2 = 1 + Math.floor((app.width-1)*x2);
            absY2 = 1 + Math.floor((app.height-1)*y2);
            var length = Math.floor(Math.sqrt(Math.pow(absX1 - absX2,2) + Math.pow(absY1 - absY2,2)));
            for(var i = 0; i < length; i++){
                middleX = Math.floor(absX1*(1 - i/length) + absX2*(i/length));
                middleY = Math.floor(absY1*(1 - i/length) + absY2*(i/length));
                mask[middleX][middleY] = 1;
            }
        };

        maskMoveLine(0,0,0.9,0.2);
        maskMoveLine(0.9,0.2,0.1,0.9);
        maskMoveLine(0.1,0.8,1,1);
        maskMoveLine(0.1, 0.4, 0.9, 0.6);

        return mask;
    },

    /**
     * Open rooms based on mask
     * @param {array[][]} mask 2 dimension array with size of labyrinth
     */
    overlayMask(mask){
        var app = this;
        this.roomIterator(function(center, left, top, right, bottom, x, y){
            if(mask[x][y]){
                if(x > 1){
                    app.graph.set(center,left,1);
                }
                if(y > 1){
                    app.graph.set(center,top,1);
                }
                if(x < app.width){
                    app.graph.set(center,right,1);
                }
                if(y < app.height){
                    app.graph.set(center,bottom,1);
                }
            }
        });
    },

    /**
     * Convert chord to room number
     * @param {integer} x chord of room
     * @param {integer} y chord of room
     * @returns Integer room number
     */
    chordToRoom(x,y){
        return (y-1)*this.width + x
    },

    /**
     * Convert room number to chords
     * @param {integer} roomNumber Number of the room
     * @returns [x,y] Array
     */
    roomToChord(roomNumber){
        var x = (roomNumber%this.width);
        if(x == 0){
            x = this.width;
        }
        var y = Math.ceil(roomNumber / this.width);

        return [x,y];
    },

    /**
     * Iterate all the rooms and pass neighbour rooms numbers
     * @param {function} callbackFunction Function to work with rooms
     */
    roomIterator(callbackFunction = function(center, left, top, right, bottom){}){
        var roomCenter, roomLeft, roomTop, roomRight, roomBottom;
        

        for(y=1;y<=this.height;y++){
            for(x=1;x<=this.width;x++){

                roomCenter = this.chordToRoom(x,y);
                roomLeft = this.chordToRoom(x-1,y);
                roomTop = this.chordToRoom(x, y-1);
                roomRight = this.chordToRoom(x+1, y);
                roomBottom = this.chordToRoom(x, y+1);

                callbackFunction(roomCenter, roomLeft, roomTop, roomRight, roomBottom, x, y);
            }
        }
    },

    /**
     * Output labyrinth on display
     */
    showLabyrinth(){
        this.display.clearScreen();
        var l,t,r,b;
        var app = this;
        this.roomIterator(function(center, left, top, right, bottom, x, y){
            l = !app.graph.get(center, left);
            t = !app.graph.get(center, top);
            r = !app.graph.get(center, right);
            b = !app.graph.get(center, bottom);

            if(center == 1){
                t = 0;
            }
            if(center == app.roomsCount){
                b = 0;
            }

            app.display.drawBox(x-1, y-1, l, t, r, b);
        });

        if(this.displayAvailableArea){
            this.higlightRooms(this.availableRooms, '#00ff0055');
        }
        if(this.displayPath){
            this.higlightRooms(this.shortestRooms, '#ff000055');
        }
        
    },

    /**
     * Open and close some rooms in random order
     */
    normalizeLabyrinth2(){
        var l,t,r,b;
        var app = this;

        this.roomIterator(function(center, left, top, right, bottom, x, y){
            l = app.graph.get(center, left);
            t = app.graph.get(center, top);
            r = app.graph.get(center, right);
            b = app.graph.get(center, bottom);
            var openCount = l+t+r+b;
            if(x > 1 && x < app.width && y > 1 && y < app.height){
                
                if(openCount < 2){
                    var toOpen = 2 - openCount;
                    var cyclicIterator = Math.round(Math.random()*4);

                    while(toOpen > 0){
                        switch (cyclicIterator%4) {
                            case 0:
                                if(toOpen && !r){
                                    app.graph.set(center, right, 1);
                                    toOpen--;
                                }
                            break;
                            case 1:
                                if(toOpen && !b){
                                    app.graph.set(center, bottom, 1);
                                    toOpen--;
                                }
                            break;
                            case 2:
                                if(toOpen && !l){
                                    app.graph.set(center, left, 1);
                                    toOpen--;
                                }
                            break;
                            case 3:
                                if(toOpen && !t){
                                    app.graph.set(center, top, 1);
                                    toOpen--;
                                }
                            break;
                        }
                        cyclicIterator++;
                    }

                }
            }
        });
        this.roomIterator(function(center, left, top, right, bottom, x, y){
            l = app.graph.get(center, left);
            t = app.graph.get(center, top);
            r = app.graph.get(center, right);
            b = app.graph.get(center, bottom);
            var openCount = l+t+r+b;
            if(x > 1 && x < app.width && y > 1 && y < app.height){
                
                if(openCount > 3){
                    var toClose =  openCount - 2;
                    var cyclicIterator = Math.round(Math.random()*4);

                    while(toClose){
                        switch (cyclicIterator%4) {
                            case 0:
                                if(toClose && l){
                                    app.graph.set(center, left, 0);
                                    toClose--;
                                }
                            break;
                            case 1:
                                if(toClose && t){
                                    app.graph.set(center, top, 0);
                                    toClose--;
                                }
                            break;
                            case 2:
                                if(toClose && r){
                                    app.graph.set(center, right, 0);
                                    toClose--;
                                }
                            break;
                            case 3:
                                if(toClose && b){
                                    app.graph.set(center, bottom, 0);
                                    toClose--;
                                }
                            break;
                        }
                        cyclicIterator++;
                    }
                }

            }
        });
    },

    /**
     * Open and close some rooms in static order
     */
    normalizeLabyrinth(){
        var l,t,r,b;
        var app = this;

        this.roomIterator(function(center, left, top, right, bottom, x, y){
            l = app.graph.get(center, left);
            t = app.graph.get(center, top);
            r = app.graph.get(center, right);
            b = app.graph.get(center, bottom);
            var openCount = l+t+r+b;
            if(x > 1 && x < app.width && y > 1 && y < app.height){
                
                if(openCount > 2){
                    var toClose =  openCount - 2;
                    
                    if(toClose && l){
                        app.graph.set(center, left, 0);
                        toClose--;
                    }
                    if(toClose && t){
                        app.graph.set(center, top, 0);
                        toClose--;
                    }
                    if(toClose && r){
                        app.graph.set(center, right, 0);
                        toClose--;
                    }
                    if(toClose && b){
                        app.graph.set(center, bottom, 0);
                        toClose--;
                    }
                }

            }
        });

        this.roomIterator(function(center, left, top, right, bottom, x, y){
            l = app.graph.get(center, left);
            t = app.graph.get(center, top);
            r = app.graph.get(center, right);
            b = app.graph.get(center, bottom);
            var openCount = l+t+r+b;
            if(x > 1 && x < app.width && y > 1 && y < app.height){
                
                if(openCount < 2){
                    var toOpen = 2 - openCount;
                    

                    if(toOpen && !r){
                        app.graph.set(center, right, 1);
                        toOpen--;
                    }
                    if(toOpen && !b){
                        app.graph.set(center, bottom, 1);
                        toOpen--;
                    }
                    if(toOpen && !l){
                        app.graph.set(center, left, 1);
                        toOpen--;
                    }
                    if(toOpen && !t){
                        app.graph.set(center, top, 1);
                        toOpen--;
                    }
                }
            }
        });



    },

    /**
     * Randomize opening and closing rooms
     */
    createRandomLabyrinth(){
        var l,t,r,b;
        var app = this;
        this.roomIterator(function(center, left, top, right, bottom, x, y){
            l = Math.round(Math.random());
            t = Math.round(Math.random());
            r = Math.round(Math.random());
            b = Math.round(Math.random());

            if(x > 1){
                app.graph.set(center, left, l);
            }
            if(y > 1){
                app.graph.set(center, top, t);
            }
            if(x < app.width){
                app.graph.set(center, right, r);
            }
            if(y < app.height){
                app.graph.set(center, bottom, b);
            }

        });
    },

    /**
     * Highlight rooms with color
     * @param {array} rooms Rooms numbers array to display
     * @param {string} color Canvas color to higlight (ex. #fff)
     */
    higlightRooms(rooms, color){
        var app = this;
        app.display.setFillStyle(color);

        rooms.forEach(function(value){
            var chord = app.roomToChord(value);
            app.display.fillRect(chord[0]-1, chord[1]-1);
        });
    }
}
