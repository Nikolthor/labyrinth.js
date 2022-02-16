function Stopwatch(message){
    this.message = message;
    this.registerStartTime();
}
Stopwatch.prototype = {
    startTime: null,
    endTime: null,
    message: null,
    registerStartTime(){
        this.startTime = Date.now();
    },
    end(){
        this.endTime = Date.now();

        result = (this.endTime - this.startTime) / 1000;
        console.log(this.message + ': ' + result + 's');
    }
}