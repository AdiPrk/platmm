let popup = [];
let oldTimeout1 = null;
let oldTimeout2 = null;

function CreatePopup(text, time) {    
    popup = [text, 1];

    if (oldTimeout1 != null) clearTimeout(oldTimeout1);    
    if (oldTimeout2 != null) clearTimeout(oldTimeout2);

    oldTimeout1 = setTimeout(() => {
        popup[1] -= 1 / fps;
        oldTimeout1 = null;
    }, Math.max(0, time - 1000));
    
    oldTimeout2 = setTimeout(() => {
        popup = [];
        oldTimeout2 = null;
    }, time)
}

function RenderPopups() {
    if (popup.length == 0) return;
    
    let text = popup[0];
                    
    if (popup[1] != 1) popup[1] -= (1 / fps);
    ctx.globalAlpha = Math.max(0, popup[1]);

    ctx.font = "40px 'Exo 2'";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    let metrics = ctx.measureText(text);
    let textWidth = metrics.width + 25;
    
    ctx.fillStyle = "green";
    ctx.fillRect(canvas.width / 2 - textWidth / 2, canvas.height / 2 - 35, textWidth, 70);

    const gradient = ctx.createLinearGradient(canvas.width / 2 - textWidth / 2, canvas.height / 2 - 35, canvas.width / 2 + textWidth / 2, canvas.height / 2 + 35);
    gradient.addColorStop(1, 'gold');
    gradient.addColorStop(0, 'gold');
    gradient.addColorStop(0.8, 'grey');
    gradient.addColorStop(0.2, 'grey');
    gradient.addColorStop(0.6, 'orange');
    gradient.addColorStop(0.4, 'orange');
    gradient.addColorStop(0.5, 'green');
    ctx.strokeStyle = gradient;
    
    ctx.lineWidth = 5;
    ctx.shadowBlur = 2;
    ctx.shadowColor = "gold";
    ctx.strokeRect(canvas.width / 2 - textWidth / 2, canvas.height / 2 - 35, textWidth, 70);
    
    ctx.fillStyle = "black";
    ctx.shadowBlur = 3;
    ctx.shadowColor = "grey";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
}