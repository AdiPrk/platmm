var entUniqueid = 0;

class Entity {
    constructor(helper) {
        this.x = helper.x;
        this.y = helper.y;
        this.w = helper.w;
        this.h = helper.h;
        this.alterableProperties = new AlterableProperties(this, []);
        
        if (helper.id) {
            this.id = helper.id;
        } else {
            this.id = entUniqueid;
            entUniqueid++;
        }
    }
    renderHoverAndSelect(showID) {
        ctx.strokeWidth = 15;
        
        if (this.hovering == true) {
            this.hovering = false;
            ctx.strokeStyle = "purple";
            ctx.setLineDash([15, 15]);
            ctx.strokeRect(this.x, this.y, this.w, this.h);
            ctx.setLineDash([]);
        }

        if (this.selected) {
            ctx.strokeStyle = "blue";
            ctx.strokeRect(this.x, this.y, this.w, this.h);

            if (this.justSelected == 1) {
                this.alterableProperties.displayFields();
            }
        } else {
            this.justSelected = 0;
        }

        if (Keys.space && showID != 0) {
            // Select Mode On - show ID
            ctx.font = "25px 'Exo 2'"    
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(this.id, this.x + this.w / 2, this.y + this.h / 2);
        }
    }
}

class BasicBlock extends Entity {
    constructor(helper) {
        super(helper);
        this.type = Object.keys(objectMap).find(key => objectMap[key] === BasicBlock);

        this.texture = helper.texture || -1;

        this.alterableProperties = new AlterableProperties(this, [
            {
                "span": "Texture",
                "input": ["number", "texture"]
            },
        ]);
    }
    render() {
        ctx.fillStyle = "green";
        ctx.fillRect(this.x, this.y, this.w, this.h);

        this.renderHoverAndSelect();
    }
}

class Lava extends Entity {
    constructor(helper) {
        super(helper);
        this.type = Object.keys(objectMap).find(key => objectMap[key] === Lava);
    }
    render() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.w, this.h);

        this.renderHoverAndSelect();
    }
}

class DarknessBlock extends Entity {
    constructor(helper) {
        super(helper);
        this.type = Object.keys(objectMap).find(key => objectMap[key] === DarknessBlock);
    }
    render() {
        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, this.w, this.h);

        this.renderHoverAndSelect();
    }
}

class Start extends Entity {
    constructor(helper) {
        super(helper);
        this.type = Object.keys(objectMap).find(key => objectMap[key] === Start);
    }
    render() {
        ctx.fillStyle = "blue";
        ctx.fillRect(this.x, this.y, this.w, this.h);

        this.renderHoverAndSelect(0);
    }
}

class Crawler extends Entity {
    constructor(helper) {
        super(helper);
        this.type = Object.keys(objectMap).find(key => objectMap[key] === Crawler);
    }
    render() {
        ctx.fillStyle = "orange";
        ctx.fillRect(this.x, this.y, this.w, this.h);

        this.renderHoverAndSelect(0);
    }
}

class Spawn extends Entity {
    constructor(helper) {
        super(helper);
        this.type = Object.keys(objectMap).find(key => objectMap[key] === Spawn);
    }
    render() {
        ctx.fillStyle = "rgba(120,200,200,1)";
        ctx.fillRect(this.x, this.y, this.w, this.h);

        this.renderHoverAndSelect(0);
    }
}

class HelpTextTrigger extends Entity {
    constructor(helper) {
        super(helper);
        this.type = Object.keys(objectMap).find(key => objectMap[key] === HelpTextTrigger);
        this.text = helper.text || "";

        this.alterableProperties = new AlterableProperties(this, [
            {
                "span": "Text",
                "input": ["text", "text"]
            }
        ]);
    }
    render() {
        ctx.fillStyle = "green";
        ctx.globalAlpha /= 3;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.strokeStyle = "purple";
        ctx.globalAlpha *= 3;
        ctx.lineWidth = 5;
        ctx.strokeRect(this.x, this.y, this.w, this.h);

        if (!Keys.space) {
            ctx.font = "25px 'Exo 2'"
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
                ctx.fillText("T", this.x + this.w / 2, this.y + this.h / 2);
        }

        this.renderHoverAndSelect();
    }
}

class CutsceneTrigger extends Entity {
    constructor(helper) {
        super(helper);
        this.type = Object.keys(objectMap).find(key => objectMap[key] === CutsceneTrigger);
        this.cutsceneName = helper.cutsceneName || "";

        this.alterableProperties = new AlterableProperties(this, [
            {
                "span": "Cutscene Name",
                "input": ["text", "cutsceneName"]
            }
        ]);
    }
    render() {
        ctx.fillStyle = "blue";
        ctx.globalAlpha /= 3;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.strokeStyle = "green";
        ctx.globalAlpha *= 3;
        ctx.lineWidth = 5;
        ctx.strokeRect(this.x, this.y, this.w, this.h);

        if (!Keys.space) {
            ctx.font = "25px 'Exo 2'"
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
                ctx.fillText("C", this.x + this.w / 2, this.y + this.h / 2);
        }

        this.renderHoverAndSelect();
    }
}

class MoveTrigger extends Entity {
    constructor(helper) {
        super(helper);
        this.type = Object.keys(objectMap).find(key => objectMap[key] === MoveTrigger);
        this.targetId = helper.targetId || 0;
        this.xShift = helper.xShift || 0;
        this.yShift = helper.yShift || 0;
        this.moveTime = helper.moveTime || 0;

        this.alterableProperties = new AlterableProperties(this, [
            {
                "span": "Target ID",
                "input": ["number", "targetId"]
            },
            {
                "span": "X Shift",
                "input": ["number", "xShift"]
            },
            {
                "span": "Y Shift",
                "input": ["number", "yShift"]
            },
            {
                "span": "Move Time (ms)",
                "input": ["number", "moveTime"]
            }
        ]);
    }
    render() {
        ctx.fillStyle = "blue";
        ctx.globalAlpha /= 3;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.strokeStyle = "purple";
        ctx.globalAlpha *= 3;
        ctx.lineWidth = 5;
        ctx.strokeRect(this.x, this.y, this.w, this.h);

        if (!Keys.space) {
            ctx.font = "25px 'Exo 2'"
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
                ctx.fillText("M", this.x + this.w / 2, this.y + this.h / 2);
        }

        this.renderHoverAndSelect();
    }
}

class CamOffsetTrigger extends Entity {
    constructor(helper) {
        super(helper);
        this.type = Object.keys(objectMap).find(key => objectMap[key] === CamOffsetTrigger);
        this.offsetX = helper.offsetX || 0;
        this.offsetY = helper.offsetY || 0;

        this.alterableProperties = new AlterableProperties(this, [
            {
                "span": "Offset X",
                "input": ["number", "offsetX"]
            },
            {
                "span": "Offset Y",
                "input": ["number", "offsetY"]
            },
        ]);
    }
    render() {
        ctx.fillStyle = "blue";
        ctx.globalAlpha /= 3;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.strokeStyle = "purple";
        ctx.globalAlpha *= 3;
        ctx.lineWidth = 5;
        ctx.strokeRect(this.x, this.y, this.w, this.h);

        if (!Keys.space) {
            ctx.font = "25px 'Exo 2'"
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
                ctx.fillText("C", this.x + this.w / 2, this.y + this.h / 2);
        }

        this.renderHoverAndSelect();
    }
}