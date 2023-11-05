var selectedObjectType = 3;
var selectedObject = null;
var fps = 60;
let updateFps = 0;

let then = performance.now();

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let now = performance.now();
    let dt = now - then;
    then = now;

    // moving selected objects
    let objectSpeed = 0.015 * dt;
    let rotationSpeed = 0.0025 * dt;
    if (selectedObject) {
        let obj = selectedObject[0];
        
        if (Keys.j && obj.rotation != null) {
            obj.rotation += rotationSpeed;
            obj.rotation = Math.round(obj.rotation * 1000) / 1000;
        }
        if (Keys.k && obj.rotation != null) {
            obj.rotation -= rotationSpeed;
            obj.rotation = Math.round(obj.rotation * 1000) / 1000;
        }

        let setAnchor = false;
        if (obj.type == "15" && obj.arrowsMoveAnchor) {
            setAnchor = true;
        }

        let newObjX = setAnchor ? obj.anchorX : obj.x;
        let newObjY = setAnchor ? obj.anchorY : obj.y;

        if (Keys.leftarrow) {
            if (Keys.shift) {
                newObjX = roundToGrid(newObjX - gridSize / 2);
            }
            else {
                newObjX -= objectSpeed;
            }
        }
        if (Keys.rightarrow) {
            if (Keys.shift) {
                if (newObjX != roundToGrid(newObjX - gridSize / 2)) {
                    newObjX = roundToGrid(newObjX + gridSize - gridSize / 2);
                }
            }
            else {
                newObjX += objectSpeed;
            }
        }
        if (Keys.uparrow) {
            if (Keys.shift) {
                newObjY = roundToGrid(newObjY - gridSize / 2);
            }
            else {
                newObjY -= objectSpeed;
            }
        }
        if (Keys.downarrow) {
            if (Keys.shift) {
                if (newObjY != roundToGrid(newObjY - gridSize / 2)) {
                    newObjY = roundToGrid(newObjY + gridSize - gridSize / 2);
                }
            }
            else {
                newObjY += objectSpeed;
            }
        }

        if (setAnchor) {
            obj.anchorX = Math.round(newObjX * 1000) / 1000;
            obj.anchorY = Math.round(newObjY * 1000) / 1000;
        }
        else {
            obj.x = Math.round(newObjX * 1000) / 1000;
            obj.y = Math.round(newObjY * 1000) / 1000;
        }
    }


    // Camera movement
    let cameraspeed = (Keys.shift == true ? 1.5 : 0.5) / camera.scale;

    if (Keys.left) camera.x -= cameraspeed * dt;
    if (Keys.right) camera.x += cameraspeed * dt;
    if (Keys.up) camera.y -= cameraspeed * dt;
    if (Keys.down) camera.y += cameraspeed * dt;

    // Move canvas to camera
    const canvasTranslateX = canvas.width / 2 - camera.x * camera.scale;
    const canvasTranslateY = canvas.height / 2 - camera.y * camera.scale;
    ctx.translate(canvasTranslateX, canvasTranslateY);
    ctx.scale(camera.scale, camera.scale);

    // Hover and select objects
    if (Keys.space) {
        hoverObj = null;
        hoverObjType = null;
        roomInd = null;
        blockInd = null;
        
        for (let i = 0; i < map["rooms"].length; i++) {
            let room = map["rooms"][i];

            if (PointVsRect(mouse, room)) {
                hoverObj = room;
                hoverObjType = "room";
                roomInd = i;

                for(let j = 0; j < room.entities.length; j++) {
                    let obj = room.entities[j];

                    if (PointVsRect(mouse, obj)) {
                        hoverObj = obj;
                        hoverObjType = "other";
                        blockInd = j;
                        break;
                    }
                }
            }
        }

        if (hoverObj) {
            hoverObj.hovering = true;

            if (mouse.clicked) {
                if (selectedObject) selectedObject[0].selected = false;
                hoverObj.selected = true;
                selectedObject = [hoverObj, hoverObjType, roomInd, blockInd];

                hoverObj.justSelected++;
            }
        }
    }

    // Delete objects
    // if (mouse.rightClick && selectedObject != null && !toolsDiv.contains(document.activeElement)) {
    //     map["rooms"][selectedObject[2]].layers[camera.view].splice(selectedObject[3], 1);
    //     selectedObject = null;
    // }
    
    // Render Map
    let canvasBounds = getCanvasBounds();
    for (let i = 0; i < map["rooms"].length; i++) {
        let room = map["rooms"][i];

        if (RectVsRect(room, canvasBounds)) room.render();
    }

    // Render helper box
    if (!Keys.space) { 
        let helper = {
            x: roundToGrid(mouse.x - gridSize / 2),
            y: roundToGrid(mouse.y - gridSize / 2),
            w: gridSize,
            h: gridSize, 
            color: "green"
        };
        
        CreateObjects(helper);
    
        ctx.strokeStyle = helper.color;
        ctx.shadowColor = helper.color;
        ctx.shadowBlur = helper.color == "green" ? 10 : 0;
        
        ctx.lineWidth = 5;
        ctx.strokeRect(helper.x, helper.y, helper.w, helper.h);
        if (helper.color == "red") {
            ctx.globalAlpha = 0.5;
            ctx.beginPath();
            ctx.moveTo(helper.x, helper.y);
            ctx.lineTo(helper.x + helper.w, helper.y + helper.h);
            ctx.moveTo(helper.x + helper.w, helper.y);
            ctx.lineTo(helper.x, helper.y + helper.h);
            ctx.stroke();
            ctx.closePath();
            ctx.globalAlpha = 1;
        }
        ctx.shadowBlur = 0;
    }

    // Canvas Mouse Pointer
    ctx.fillStyle = "gold";
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.globalAlpha = 1;
    
    // Move canvas back to origin
    ctx.scale(1 / camera.scale, 1 / camera.scale);
    ctx.translate(-canvasTranslateX, -canvasTranslateY);
    
    // Render Popups
    RenderPopups();

    // Selected Object Div
    if (selectedObject != null) {
        selectDiv.style.display = "";
        noSelectDiv.style.display = "none";
    } else {
        selectDiv.style.display = "none";
        noSelectDiv.style.display = "";
    }

    // Reset Mouse Released
    if (mouse.released) mouse.released = false;
    
    // Display FPS
    // ctx.fillStyle = "white";
    // ctx.font = "30px 'Exo 2'"
    // ctx.textAlign = "left";
    // ctx.textBaseline = "bottom";
    // if (updateFps > 400) {
    //     fps = Math.round(1000 / dt);
    //     updateFps = 0;
    // } else {
    //     updateFps += dt;
    // }
    // ctx.fillText("fps: " + fps, 0, canvas.height);

    requestAnimationFrame(update);
}

window.onwheel = (e) => {
    camera.scale -= e.deltaY * 0.001;

    camera.scale = Math.max(0.02, camera.scale);
    camera.scale = Math.min(10, camera.scale);
}

window.onload = () => {
    document.getElementById("loading").classList.add("fadeout");
    requestAnimationFrame(update);
}