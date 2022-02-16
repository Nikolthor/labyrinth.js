function Interface(){
    this.bindControls();
}

Interface.prototype = {
    interfaceValues: {},
    getValues(){
        return this.interfaceValues;
    },
    lockInterface(){
        document.querySelectorAll('.control, .action-new').forEach(function(element){
            element.disabled = true;
        });
    },
    unlockInterface(){
        document.querySelectorAll('.control, .action-new').forEach(function(element){
            element.disabled = false;
        });
    },
    readSettings(){
        var app = this;
        
        document.querySelectorAll('.control').forEach(function(element){
            switch (element.type) {
                case 'checkbox':
                    app.interfaceValues[element.name] = element.checked;
                break;
                case 'select-one':
                    app.interfaceValues[element.name] = element.value;
                break;
                default:
                break;
            }
            
        });
    },
    updateState(){
        this.readSettings();
        const event = new CustomEvent('interface.update', {detail: this.interfaceValues});
        document.dispatchEvent(event);
    },
    bindControls(){
        var app = this;
        document.querySelectorAll('.control').forEach(function(element){
            element.addEventListener('change', function(){
                app.readSettings();
                app.updateState();
            });
        });
        document.querySelector('.action').addEventListener('click', function(){
            var element = this;
            app.lockInterface();
            
            setTimeout(function(){
                if(element.dataset.action){
                    const event = new CustomEvent('action.'+element.dataset.action);
                    document.dispatchEvent(event);
                }
                app.unlockInterface();
            },20);

        });
        document.querySelector('.action-change').addEventListener('change', function(){
            var element = this;
            app.lockInterface();
            setTimeout(function(){
                if(element.dataset.action){
                    const event = new CustomEvent('action.'+element.dataset.action);
                    document.dispatchEvent(event);
                }
                app.unlockInterface();
            },20);
        });
    }
}