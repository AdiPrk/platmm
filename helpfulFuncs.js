function PointVsRect(p, r) {
    return (p.x >= r.x && p.y >= r.y && p.x < r.x + r.w && p.y < r.y + r.h);
}

function RectVsRect(r1, r2) {    
    return (r1.x < r2.x + r2.w && r1.x + r1.w > r2.x && r1.y < r2.y + r2.h && r1.y + r1.h > r2.y);
}

function FullyInRectVsRect(r1, r2) {
    return (r1.x >= r2.x && r1.x + r1.w <= r2.x + r2.w && r1.y >= r2.y && r1.y + r1.h <= r2.y + r2.h);
}

function roundToGrid(number) {
    if (number > -gridSize / 2) {
        return (number + gridSize/2) - (number + gridSize/2) % gridSize;
    }

    return (number + gridSize/2) - (number + gridSize/2) % gridSize - gridSize;
}

function indexOfObject(arr, obj) {
    arr.findIndex(object => {
      return object == obj;
    });
}

function getCanvasBounds() {
    var r = canvas.getBoundingClientRect()

    let scaledCanvasWidth = canvas.width / camera.scale;
    let scaledCanvasHeight = canvas.height / camera.scale;
    
    let scaledX = ((0 - r.left) / (r.right - r.left)) * scaledCanvasWidth - (canvas.width / camera.scale - canvas.width) / 2;
    let scaledY = ((0 - r.top) / (r.bottom - r.top)) * scaledCanvasHeight - (canvas.height / camera.scale - canvas.height) / 2;
    
    let cameraShiftX = canvas.width / 2 - camera.x;
    let cameraShiftY = canvas.height / 2 - camera.y;
    
    let bounds = {};
    bounds.x = scaledX - cameraShiftX;
    bounds.y = scaledY - cameraShiftY;
    
    scaledX = ((innerWidth - r.left) / (r.right - r.left)) * scaledCanvasWidth - (canvas.width / camera.scale - canvas.width) / 2;
    scaledY = ((innerHeight - r.top) / (r.bottom - r.top)) * scaledCanvasHeight - (canvas.height / camera.scale - canvas.height) / 2;
    
    bounds.w = (scaledX - cameraShiftX) - bounds.x;
    bounds.h = (scaledY - cameraShiftY) - bounds.y;

    return bounds;
}