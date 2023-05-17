class AlterableProperties {
    constructor(parent, info) {
        this.parent = parent;
        this.fields = info;
    }
    displayFields() {
        while (selectDiv.firstChild) {
            selectDiv.removeChild(selectDiv.firstChild);
        }

        for (let i = 0; i < this.fields.length; i++) {
            let parentDiv = newDiv(selectDiv, "exit-field");
            
            for (let j of Object.keys(this.fields[i])) {
                let tag = j;
                let extra = this.fields[i][j];
                let targetProperty = null;
                
                if (typeof extra == "object") {
                    targetProperty = extra[1];
                    extra = extra[0];
                }

                switch (tag) {
                    case "span": {
                        newSpan(parentDiv, extra);
                        break;
                    }
                    case "input": {
                        if (extra == "color") {
                            let input = newColorInput(parentDiv);
                            input.value = this.parent[targetProperty];
    
                            input.oninput = () => {
                                this.parent[targetProperty] = input.value;
                            }
                        } else if (extra == "number") {
                            let input = newNumberInput(parentDiv);
                            input.value = this.parent[targetProperty];
    
                            input.oninput = () => {
                                this.parent[targetProperty] = input.value;
                            }
                        } else if (extra == "text") {
                            let input = newTextInput(parentDiv);
                            input.value = this.parent[targetProperty];
    
                            input.oninput = () => {
                                this.parent[targetProperty] = input.value;
                            }
                        } else if (extra == "checkbox") {
                            let input = newCheckboxInput(parentDiv);
                            input.checked = this.parent[targetProperty];
    
                            input.oninput = () => {
                                this.parent[targetProperty] = input.checked;
                            }
                        }
                        
                        
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }            
        }
    }
}

// [
//     {
//         "span": "Background",
//         "input": "color"
//     }
// ];