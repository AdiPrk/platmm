const objectMap = {
    0: Room,
//    1: Start,
    1: Spawn,
    2: BasicBlock,
    4: Lava,
    5: Crawler,
    6: HelpTextTrigger,
    7: MoveTrigger,
    8: CutsceneTrigger,
    12: DarknessBlock,
    13: CamOffsetTrigger
}

function loadMap(m) {
    entUniqueid = 0;
    if (m) {
        if (typeof m != "string") {
            m = JSON.stringify(m);
        }
        
        map = JSON.parse(m);
        
        if (!map.rooms) {
            console.log(map);
            map = {"rooms": map};
        }
    }
    
    let tempmap = {"rooms": []};
    
    for (let i = 0; i < map["rooms"].length; i++) {
        let room = map["rooms"][i];
        tempmap["rooms"][i] = new Room(room);
        
        for(let j = 0; j < map["rooms"][i].entities.length; j++) {
            let obj = map["rooms"][i].entities[j];

            tempmap["rooms"][i].entities.push(new objectMap[obj.type](obj));

            entUniqueid = Math.max(entUniqueid, obj.id);
        }
    }

    map = tempmap;
    entUniqueid++;
}

loadMap();