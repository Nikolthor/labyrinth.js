function App(){
    this.interface = new Interface();
    this.registerEvents();
    
    this.labyrinth = new Labyrinth();
    this.labyrinth.setDisplay(new Display('.display1'));
    this.interface.updateState();

    this.labyrinth.setSize(parseInt(this.settings.size), parseInt(this.settings.size));
    this.configureLabyrinth();
    this.runGeneration();
}
App.prototype = {
    interface: null,
    settings: null,
    labyrinth: null,

    runGeneration(){
        this.labyrinth.generate();
        document.querySelector('.iteration').textContent = this.labyrinth.getIterationCounter();
        this.labyrinth.updateDisplay();
    },

    configureLabyrinth(){
        this.labyrinth.setUsePathMasks(this.settings.pathMasks);
        this.labyrinth.setDisplayAvailableArea(this.settings.displayAvailableArea);
        this.labyrinth.setDisplayPath(this.settings.displayPath);
        this.labyrinth.setAlgorythm(this.settings.algorythm);
        this.labyrinth.setAnalyze(this.settings.analyze);
    },

    registerEvents(){
        var app = this;
        document.addEventListener('interface.update', function(event){
            app.updateState(event.detail);
        });
        document.addEventListener('action.resize', function(event){
            app.labyrinth.setSize(parseInt(app.settings.size), parseInt(app.settings.size));
            app.runGeneration();
        });
        document.addEventListener('action.create', function(event){
            app.runGeneration();
        });
    },
    
    updateState(interfaceData){
        this.settings = interfaceData;
        this.configureLabyrinth();
        this.labyrinth.updateDisplay();
    }
}

window.app = new App();