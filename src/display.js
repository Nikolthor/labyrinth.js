/**
 * Block display
 * @param {string} displayClass Canvas class
 */
function Display(displayClass){
    this.init(displayClass);
}
Display.prototype = {
    displayNode: null,
    context: null,
    dividerX: null,
    dividerY: null,
    itemWidth: null,
    itemHeight: null,
    offsetX: null,
    offsetY: null,

    init(displayClass){
        this.displayNode = document.querySelector(displayClass);
        this.context = this.displayNode.getContext('2d');
    },

    /**
     * Get left offset in blocks
     * @returns int count
     */
    getOffsetItemsX(){
        return this.offsetX;
    },

    /**
     * Get top offset in blocks
     * @returns int count
     */
    getOffsetItemsY(){
        return this.offsetY;
    },

    /**
     * Draw line on canvas
     * @param {int} x1 start point
     * @param {int} y1 start point
     * @param {int} x2 end point
     * @param {int} y2 end point
     */
    drawLine(x1,y1,x2,y2){
        this.context.beginPath();    
        this.context.moveTo(x1, y1);   
        this.context.lineTo(x2, y2);  
        this.context.stroke();
    },

    /**
     * Display block with borders
     * @param {int} x block position
     * @param {int} y block position
     * @param {int} left display left border
     * @param {int} top display top border
     * @param {int} right display right border
     * @param {int} bottom display bottom border
     */
    drawBox(x,y,left,top,right,bottom){
        x += this.getOffsetItemsX();
        y += this.getOffsetItemsY();

        var posLeft = x*this.itemWidth;
        var posRight = posLeft+this.itemWidth;
        var posTop = y*this.itemHeight;
        var posBottom = posTop+this.itemHeight;

        if(left){
            this.drawLine(posLeft,posTop,posLeft,posBottom);
        }
        if(top){
            this.drawLine(posLeft,posTop,posRight,posTop);
        }
        if(right){
            this.drawLine(posRight,posTop,posRight,posBottom);
        }
        if(bottom){
            this.drawLine(posLeft,posBottom,posRight,posBottom)
        }
        
    },

    /**
     * Display fill rect block
     * @param {int} x 
     * @param {int} y 
     */
    fillRect(x,y){
        x += this.getOffsetItemsX();
        y += this.getOffsetItemsY();
        x = x*this.itemWidth;
        y = y*this.itemHeight;

        this.context.fillRect(x,y,this.itemWidth,this.itemHeight);
    },

    /**
     * Set screen size in blocks
     * @param {int} x 
     * @param {int} y 
     */
    setDividers(x,y){
        if(x > 100 || y > 100){
            this.context.lineWidth = 4;
        } else {
            this.context.lineWidth = 4;
        }

        this.dividerX = (x + 2);
        this.dividerY = (y + 2);
        this.itemWidth = Math.floor(this.context.canvas.width / this.dividerX);
        this.itemHeight = Math.floor(this.context.canvas.height / this.dividerY);
        this.offsetX = Math.ceil((Math.ceil(this.context.canvas.width / this.itemWidth) - this.dividerX) / 2);
        this.offsetY = Math.ceil((Math.ceil(this.context.canvas.height / this.itemHeight) - this.dividerX) / 2);
    },

    /**
     * Clear screen
     */
    clearScreen(){
        var width = this.displayNode.width;
        var height = this.displayNode.height;
        this.context.fillStyle = '#fff';
        this.context.fillRect(0,0,width,height);
    },

    /**
     * Set canvas fill color
     * @param {string} color canvas color
     */
    setFillStyle(color){
        this.context.fillStyle = color;
    },

    /**
     * Set canvas stroke color
     * @param {string} color canvas color
     */
    setStrokeStyle(color){
        this.context.strokeStyle = color;
    },

    /**
     * Final image actions
     */
    finalImageProcess(){

    }
}