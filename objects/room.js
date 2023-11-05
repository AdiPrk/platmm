var roomUniqueId = 0;

class Room {
    constructor(helper) {
        this.x = helper.x;
        this.y = helper.y;
        this.w = helper.w;
        this.h = helper.h;

        this.entities = [];
        this.resizer = new Resizer(this);
        this.justSelected = 0;

        this.backgroundColor = helper.backgroundColor || "#000000";
        this.camOffsetX = helper.camOffsetX || 0;
        this.camOffsetY = helper.camOffsetY || 0;
        this.camScale = helper.camScale || 1;
        this.camScaleSpeed = helper.camScaleSpeed || 1;

        this.id = roomUniqueId;
        roomUniqueId++;
        
        this.alterableProperties = new AlterableProperties(this, [
            {
                "span": "Background",
                "input": ["color", "backgroundColor"]
            },
            {
                "span": "Cam X Offset",
                "input": ["number", "camOffsetX"]
            },
            {
                "span": "Cam Y Offset",
                "input": ["number", "camOffsetY"]
            },
            {
                "span": "Cam Scale",
                "input": ["number", "camScale"]
            },
            {
                "span": "Cam Scale Speed",
                "input": ["number", "camScaleSpeed"]
            }
        ]);
    }
    resize() {
        if (Keys.space) {
            this.resizer.update();
            if (this.resizer.changed) {
                switch (this.resizer.changed) {
                    case "left": {
                        let diff = this.resizer.handles[0].x + this.resizer.handles[0].w / 2 - this.x;
                        this.x += diff;
                        this.w -= diff;
                        
                        break;
                    }
                    case "right": {
                        let diff = this.resizer.handles[1].x + this.resizer.handles[1].w / 2 - (this.x + this.w);
                        this.w += diff;
                        
                        break;
                    }
                    case "top": {
                        let diff = this.resizer.handles[2].y + this.resizer.handles[2].h / 2 - this.y;
                        this.y += diff;
                        this.h -= diff;
                        
                        break;
                    }
                    case "bottom": {
                        let diff = this.resizer.handles[3].y + this.resizer.handles[3].h / 2 - (this.y + this.h);
                        this.h += diff;
                        
                        break;
                    }
                    default: {
                        break;
                    }
                }

                this.resizer.recenter();
            }
            if (this.resizer.alert == 1 || this.resizer.alert == 2) {
                let text = this.resizer.alert == 1 ? "Cannot Make Room Smaller" : "Rooms Cannot Overlap";
                CreatePopup(text, 1000);

                this.resizer.alert = false;
            }
        }
    }
    render() {
        // Border
        ctx.fillStyle = this.backgroundColor;
        ctx.strokeStyle = "white";
        ctx.lineWidth = 3;

        ctx.globalAlpha = 0.7;
        
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.strokeRect(this.x, this.y, this.w, this.h);

        // Grid
        ctx.strokeStyle = "grey";
        ctx.lineWidth = 2;
        
        for(let x = this.x; x < this.x + this.w; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, this.y);
            ctx.lineTo(x, this.y + this.h);
            ctx.stroke();
            ctx.closePath();
        }

        for(let y = this.y; y < this.y + this.h; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(this.x, y);
            ctx.lineTo(this.x + this.w, y);
            ctx.stroke();
            ctx.closePath();
        }

        // Layers
        ctx.globalAlpha = 1;
        for(let i = 0; i < this.entities.length; i++) {
            let obj = this.entities[i];
            obj.render();
        }

        ctx.globalAlpha = 1;
        
        // Resizer
        this.resize();

        // Hover
        if (this.hovering == true) {
            this.hovering = false;
            ctx.strokeStyle = "purple";
            ctx.setLineDash([15, 15]);
            ctx.strokeRect(this.x, this.y, this.w, this.h);
            ctx.setLineDash([]);
        }

        if (this.selected) {
            ctx.strokeStyle = "blue";
            ctx.strokeWidth = 5;
            ctx.strokeRect(this.x, this.y, this.w, this.h);

            if (this.justSelected == 1) {
                this.alterableProperties.displayFields();
            }
        } else {
            this.justSelected = 0;
        }
    }
}

class Resizer {
    constructor(parent) {
        this.color = "gold";
        
        this.changed = false;
        this.parent = parent;
        this.handleSelected = false;
        
        this.w = gridSize * 0.67;
        this.h = gridSize * 0.67;
        this.handles = [
            {
                x: parent.x - this.w / 2,
                y: parent.y + parent.h / 2 - this.h / 2,
                w: this.w,
                h: this.h,
                hover: false,
                selected: false,
                id: "left"
            },
            {
                x: parent.x + parent.w - this.w / 2,
                y: parent.y + parent.h / 2 - this.h / 2,
                w: this.w,
                h: this.h,
                hover: false,
                selected: false,
                id: "right"
            },
            {
                x: parent.x + parent.w / 2 - this.w / 2,
                y: parent.y - this.h / 2,
                w: this.w,
                h: this.h,
                hover: false,
                selected: false,
                id: "top"
            },
            {
                x: parent.x + parent.w / 2 - this.w / 2,
                y: parent.y + parent.h - this.w / 2,
                w: this.w,
                h: this.h,
                hover: false,
                selected: false,
                id: "bottom"
            }
        ];
    }
    recenter() {
        this.handles[0].x = this.parent.x - this.w / 2;
        this.handles[0].y = this.parent.y + this.parent.h / 2 - this.h / 2;

        this.handles[1].x = this.parent.x + this.parent.w - this.w / 2;
        this.handles[1].y = this.parent.y + this.parent.h / 2 - this.h / 2;

        this.handles[2].x = this.parent.x + this.parent.w / 2 - this.w / 2;
        this.handles[2].y = this.parent.y - this.h / 2;

        this.handles[3].x = this.parent.x + this.parent.w / 2 - this.w / 2;
        this.handles[3].y = this.parent.y + this.parent.h - this.w / 2;
    }
    render() {
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.globalAlpha = 1;
        
        for (let i = 0; i < this.handles.length; i++) {
            let handle = this.handles[i];
            ctx.shadowBlur = handle.hover == true ? 4 : 0;
            
            ctx.fillRect(handle.x, handle.y, handle.w, handle.h);
        }

        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    }
    update () {
        let anyHandlesSelected = false;
        for (let i = 0; i < this.handles.length; i++) {
            let handle = this.handles[i];
            if (PointVsRect(mouse, handle)) {
                handle.hover = true;

                if (this.handleSelected == false) {
                    handle.hover = true;
                    this.handleSelected = mouse.clicked;
                    handle.selected = mouse.clicked;
                }
            } else {
                if (handle.selected && !mouse.clicked) handle.selected = false;
                handle.hover = handle.selected;
            }

            if (handle.selected) {
                anyHandlesSelected = true;
                if (handle.id == "left") {
                    let newX = roundToGrid(mouse.x) - handle.w / 2;

                    if (this.handles[1].x - newX > minRoomWidth) {
                        handle.x = newX;
                        
                        for (let i = 0; i < map["rooms"].length; i++) {
                            let room = map["rooms"][i];
                            if (room.x == this.parent.x && room.y == this.parent.y) continue;

                            let current = {
                                x: this.handles[0].x + this.w / 2,
                                y: this.handles[2].y + this.h / 2,
                                w: this.handles[1].x - this.handles[0].x,
                                h: this.handles[3].y - this.handles[2].y
                            }
                            
                            if (RectVsRect(current, room)) {
                                handle.x = room.x + room.w - this.w / 2;
                                this.alert = 2;
                            }
                        }
                    } else {
                        handle.x = this.handles[1].x - minRoomWidth;
                        let alert = this.handles[1].x - newX < minRoomWidth - gridSize;
                        if (alert) this.alert = 1;
                    }
                } else if (handle.id == "right") {
                    let newX = roundToGrid(mouse.x) - handle.w / 2;

                    if (newX - this.handles[0].x > minRoomWidth) {
                        handle.x = newX;
                        
                        for (let i = 0; i < map["rooms"].length; i++) {
                            let room = map["rooms"][i];
                            if (room.x == this.parent.x && room.y == this.parent.y) continue;

                            let current = {
                                x: this.handles[0].x + this.w / 2,
                                y: this.handles[2].y + this.h / 2,
                                w: this.handles[1].x - this.handles[0].x,
                                h: this.handles[3].y - this.handles[2].y
                            }
                            
                            if (RectVsRect(current, room)) {
                                handle.x = room.x - this.w / 2;
                                this.alert = 2;
                            }
                        }
                    } else {
                        handle.x = this.handles[0].x + minRoomWidth;
                        let alert = newX - this.handles[0].x < minRoomWidth - gridSize;
                        if (alert) this.alert = 1;
                    }
                }
                else if (handle.id == "top") {
                    let newY = roundToGrid(mouse.y) - handle.h / 2;

                    if (this.handles[3].y - newY > minRoomHeight) {
                        handle.y = newY;
                        
                        for (let i = 0; i < map["rooms"].length; i++) {
                            let room = map["rooms"][i];
                            if (room.x == this.parent.x && room.y == this.parent.y) continue;

                            let current = {
                                x: this.handles[0].x + this.w / 2,
                                y: this.handles[2].y + this.h / 2,
                                w: this.handles[1].x - this.handles[0].x,
                                h: this.handles[3].y - this.handles[2].y
                            }
                            
                            if (RectVsRect(current, room)) {
                                handle.y = room.y + room.h - this.h / 2;
                                this.alert = 2;
                            }
                        }
                    } else {
                        handle.y = this.handles[3].y - minRoomHeight;
                        let alert = this.handles[3].y - newY < minRoomHeight - gridSize;
                        if (alert) this.alert = 1;
                    }
                } else if (handle.id == "bottom") {
                    let newY = roundToGrid(mouse.y) - handle.h / 2;

                    if (newY - this.handles[2].y > minRoomHeight) {
                        handle.y = newY;
                        
                        for (let i = 0; i < map["rooms"].length; i++) {
                            let room = map["rooms"][i];
                            if (room.x == this.parent.x && room.y == this.parent.y) continue;

                            let current = {
                                x: this.handles[0].x + this.w / 2,
                                y: this.handles[2].y + this.h / 2,
                                w: this.handles[1].x - this.handles[0].x,
                                h: this.handles[3].y - this.handles[2].y
                            }
                            
                            if (RectVsRect(current, room)) {
                                handle.y = room.y - this.h / 2;
                                this.alert = 2;
                            }
                        }
                    } else {
                        handle.y = this.handles[2].y + minRoomHeight;
                        let alert = newY - this.handles[2].y < minRoomHeight - gridSize;
                        if (alert) this.alert = 1;
                    }
                }
                
                this.changed = handle.id;
            }
            this.handleSelected = anyHandlesSelected;
        }
        
        this.render();
    }
}