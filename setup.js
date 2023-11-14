// Some constants
const fixedGridSize = 25;
let gridSize = fixedGridSize;
const minRoomWidth = gridSize;
const minRoomHeight = gridSize;

// Canvas
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');

function Resize() {
    var scale = window.innerWidth / canvas.width;
    if (window.innerHeight / canvas.height < window.innerWidth / canvas.width) {
        scale = window.innerHeight / canvas.height;
    }
    canvas.style.transform = "scale(" + scale + ")";
    canvas.style.left = 1 / 2 * (window.innerWidth - canvas.width) + "px";
    canvas.style.top = 1 / 2 * (window.innerHeight - canvas.height) + "px";
}
Resize();

window.addEventListener('resize', function() {
    Resize();
});

// Copy Map
function copyToClipboard(text) {
    console.log(text);
    var dummy = document.createElement("textarea");

    document.body.appendChild(dummy);

    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}

// Camera
const camera = {
    x: 960,
    y: 415,
    scale: 0.6,
}

document.getElementById("resetCamera").onclick = () => {
    camera.x = canvas.width / 2;
    camera.y = canvas.height / 2;
    camera.scale = 0.6;
    CreatePopup("Camera Reset", 2000);
}

var toolsDiv = document.querySelector("body > div.tools-lay")
let objDiv = document.getElementById("obj-div");
let triggerDiv = document.getElementById("trig-div");
let otherDiv = document.getElementById("other-div");
let spawnDiv = document.getElementById("spawn-div");
let selectDiv = document.getElementById("sel-div");
let noSelectDiv = document.getElementById("nosel-div");

let allDivChildren = Array.from(objDiv.children).concat(Array.from(triggerDiv.children)).concat(Array.from(otherDiv.children)).concat(Array.from(spawnDiv.children));

for(let i of allDivChildren) {    
    i.onclick = () => {
        if (i.classList["0"] != "selected") {
            i.classList.toggle('selected')
            selectedObjectType = parseInt(i.id);
        }
        
        for(let j of allDivChildren) {
            if (i.id == j.id) continue;
            j.classList.remove('selected');
        }
    }
}

// Keys
var Keys = {
    up: false,
    down: false,
    left: false,
    right: false,
    uparrow: false,
    downarrow: false,
    leftarrow: false,
    rightarrow: false,
    j: false,
    k: false,
    shift: false,
    space: false
};

window.onkeydown = function(e) {
    var c = e.code;
    var k = e.key;
    if (importVisible) return;
    if (mouse.disabled) return;

    if (c == "KeyW") {
        Keys.up = true;
    }
        if (c == "KeyA") {
        Keys.left = true;
    }
    if (c == "KeyD") {
        Keys.right = true;
    }
    if (c == "KeyS") {
        Keys.down = true;
    }
    if (c == "Equal") {
        if (gridSize == 25) {
            gridSize = 12.5
        }
        else {
            gridSize = 6.25;
        }
    }
    if (c == "Minus") {
        if (gridSize == 6.25) {
            gridSize = 12.5;
        } 
        else {
            gridSize = 25;
        }
    }
    if (c == "KeyJ") {
        Keys.j = true;
    }
    if (c == "KeyK") {
        Keys.k = true;
    }

    if (c == "ArrowUp")
        Keys.uparrow = true;
    if (c == "ArrowLeft")
        Keys.leftarrow = true;
    if (c == "ArrowRight")
        Keys.rightarrow = true;
    if (c == "ArrowDown")
        Keys.downarrow = true;

    if (k == "Shift")
        Keys.shift = true;

    if (c == "Space") {
        Keys.space = !Keys.space;
        CreatePopup("Select Mode " + (Keys.space == true ? "On" : "Off"), 2000);

        if (selectedObject) selectedObject[0].selected = false;
        selectedObject = null;
    }
    
    if (c == "Backspace" && !toolsDiv.contains(document.activeElement)) {
        if (selectedObject == null) return;

        if (selectedObject[1] == "room") {
            map["rooms"].splice(selectedObject[2], 1);

            if (map["rooms"].length == 0 && Keys.space == true) {
                Keys.space = !Keys.space;
                CreatePopup("Select Mode Off, Nothing To Select", 3000);
            }
        } else {
            map["rooms"][selectedObject[2]].entities.splice(selectedObject[3], 1);
            selectedObject = null;
        }
    }    

    if (c == "Enter") {
        copyMap();

        if (Keys.space) {
            Keys.space = false;
            CreatePopup("Copied Map", 2000);
    
            if (selectedObject) selectedObject[0].selected = false;
            selectedObject = null;
        }
    }
};

function copyMap() {
    let m = map;

    // Remove useless properties
    for (let i = 0; i < m["rooms"].length; i++) {
        delete m["rooms"][i].resizer;
        delete m["rooms"][i].hovering;
        delete m["rooms"][i].selected;
        delete m["rooms"][i].alterableProperties;
        delete m["rooms"][i].justSelected;

        for(let j = 0; j < m["rooms"][i].entities.length; j++) {
            let obj = map["rooms"][i].entities[j];

            if (obj.type == 1) {
                m["rooms"][i].starting = true;
            }

            delete obj.hovering;
            delete obj.selected;
            delete obj.alterableProperties;
            delete obj.justSelected;
            delete obj.arrowsMoveAnchor;
        }
    }

    let str = JSON.stringify(m, null, 1);
    
    copyToClipboard(JSON.stringify(m.rooms, null, 1));

    let gameMap = str;
    loadMap(gameMap);

    // let room = map.rooms[0];
    // let width = room.w / gridSize;
    // let height = room.h / gridSize;
    // let str = ``;//`${width} ${height}\n`;

    
    // for (let y = room.y; y < room.y + room.h; y += gridSize) {
    //     for (let x = room.x; x < room.x + room.w; x += gridSize) {
    //         let rect = {x: x, y: y, w: gridSize, h: gridSize};

    //         let entType = 0;
    //         for (let i = 0; i < room.entities.length; i++) {
    //             if (RectVsRect(rect, room.entities[i])) {
    //                 entType = room.entities[i].type;
    //                 break;
    //             }
    //         }

    //         str += `${entType},`;
    //     }

    //     str += "\n";
    // }

    //copyToClipboard(str);
}

window.onkeyup = function(e) {
    var c = e.code;
    var k = e.key;

    if (c == "KeyW")
        Keys.up = false;
    if (c == "KeyA")
        Keys.left = false;
    if (c == "KeyD")
        Keys.right = false;
    if (c == "KeyS")
        Keys.down = false;
    if (k == "Shift")
        Keys.shift = false;

    if (c == "KeyJ") {
        Keys.j = false;
    }
    if (c == "KeyK") {
        Keys.k = false;
    }

    if (c == "ArrowUp")
        Keys.uparrow = false;
    if (c == "ArrowLeft")
        Keys.leftarrow = false;
    if (c == "ArrowRight")
        Keys.rightarrow = false;
    if (c == "ArrowDown")
        Keys.downarrow = false;
}

// Mouse
const mouse = {
    x: -1000,
    y: -1000,
    downX: -1000,
    downY: -1000,
    upX: -1000,
    upY: -1000,
    clicked: false,
    released: false,
    disabled: false,
    rightClick: false
}

window.addEventListener("contextmenu", e => e.preventDefault());

window.addEventListener('mousedown', function(e) {    
    if (importVisible) return;

    if (mouse.disabled == false) {
        if (e.which == 1) {
            mouse.clicked = true;
            mouse.downX = mouse.x;
            mouse.downY = mouse.y;
        } else if (e.which == 3) {
            mouse.rightClick = true;
        }
    }
});

toolsDiv.onmouseover = () => {
    mouse.clicked = false;
    mouse.disabled = true;
};

toolsDiv.onmouseleave = () => {
    mouse.disabled = false;
};

document.getElementById("header").onmouseover = (()=>{
    mouse.clicked = false;
    mouse.disabled = true;
});

document.getElementById("header").onmouseleave = (()=>{
    mouse.disabled = false;
});

window.addEventListener('mouseup', function(e) {
    if (e.which == 1) {
        mouse.clicked = false;
        mouse.upX = mouse.x;
        mouse.upY = mouse.y;
        mouse.released = true;
    } else if (e.which == 3) {
        mouse.rightClick = false;
    }
})

canvas.addEventListener('mousemove', function(e) {    
    var r = canvas.getBoundingClientRect()

    let scaledCanvasWidth = canvas.width / camera.scale;
    let scaledCanvasHeight = canvas.height / camera.scale;

    let scaledMouseX = ((e.clientX - r.left) / (r.right - r.left)) * scaledCanvasWidth - (canvas.width / camera.scale - canvas.width) / 2;
    let scaledMouseY = ((e.clientY - r.top) / (r.bottom - r.top)) * scaledCanvasHeight - (canvas.height / camera.scale - canvas.height) / 2;

    let cameraShiftX = canvas.width / 2 - camera.x;
    let cameraShiftY = canvas.height / 2 - camera.y;

    mouse.x = scaledMouseX - cameraShiftX;
    mouse.y = scaledMouseY - cameraShiftY;
})

// Header Divs
let importVisible = false;
let exportVisible = false;
let helpVisible = false;

document.getElementById("import").onclick = () => {
	importVisible = !importVisible;
	
	document.getElementById("importdiv").style.display = importVisible == true ? "" : "none";
	canvas.style.display = importVisible == true ? "none" : "";

	exportVisible = false;
	helpVisible = false;
	document.getElementById("exportdiv").style.display = "none";
	document.getElementById("helpdiv").style.display = "none";
}
document.getElementById("export").onclick = () => {
	importVisible = false;
	helpVisible = false;
	document.getElementById("importdiv").style.display = "none";
	document.getElementById("helpdiv").style.display = "none";

    copyMap();

    CreatePopup("Copied Map", 2000);
    
    if (Keys.space) {
        Keys.space = false;    

        if (selectedObject) selectedObject[0].selected = false;
        selectedObject = null;
    }
}
document.getElementById("help").onclick = () => {
	helpVisible = !helpVisible;

	document.getElementById("helpdiv").style.display = helpVisible == true ? "" : "none";
	canvas.style.display = helpVisible == true ? "none" : "";

	importVisible = false;
	exportVisible = false;
	document.getElementById("importdiv").style.display = "none";
	document.getElementById("exportdiv").style.display = "none";
}

document.getElementById("saveimport").onclick = () => {    
	importVisible = !importVisible;
	document.getElementById("importdiv").style.display = importVisible == true ? "" : "none";
	canvas.style.display = importVisible == true ? "none" : "";

    let mapText = document.querySelector("#importText").value;
    let ind = mapText.indexOf("{");
    let ind2 = mapText.indexOf("[");
    mapText = mapText.slice(Math.min(ind, ind2));
    loadMap(mapText);
}

function newDiv(parent, _class) {
    let newDiv = document.createElement("div");
    newDiv.classList.add(_class);
    parent.appendChild(newDiv);
    return newDiv;
}
function newSpan(parent, text) {
    let newElem = document.createElement("span");
    let node = document.createTextNode(text);
    newElem.appendChild(node);
    parent.appendChild(newElem);
    return newElem;
}

function newColorInput(parent) {
    let newElem = document.createElement("input");    
    newElem.type = "color";
    parent.appendChild(newElem);
    return newElem;
}

function newNumberInput(parent) {
    let newElem = document.createElement("input");    
    newElem.type = "number";
    parent.appendChild(newElem);
    return newElem;
}

function newTextInput(parent) {
    let newElem = document.createElement("input");    
    newElem.type = "text";
    parent.appendChild(newElem);
    return newElem;
}

function newCheckboxInput(parent) {
    let newElem = document.createElement("input");    
    newElem.type = "checkbox";
    parent.appendChild(newElem);
    return newElem;
}

function ResetAllIds() {
    let resetId = 0;
    for (let i = 0; i < map.rooms.length; i++) {
        let room = map.rooms[i];
        room.id = resetId;
        resetId++;
        for (let i = 0; i < room.entities.length; i++) {
            room.entities[i].id = resetId;
            resetId++;
        }
    }
}