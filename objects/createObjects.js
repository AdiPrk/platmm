function CreateObjects(helper) {
    if (mouse.disabled) return;
    
    switch (selectedObjectType) {
        case 0: {
            // Room
            helper.x = roundToGrid(mouse.x - 1600 / 2);
            helper.y = roundToGrid(mouse.y - 900 / 2);
            helper.w = 1600;
            helper.h = 900;
            
            for (let i = 0; i < map["rooms"].length; i++) {
                let room = map["rooms"][i];
                if (RectVsRect(helper, map["rooms"][i])) {
                    helper.color = "red";
                }
            }

            if (mouse.clicked && helper.color == "green") {
                map["rooms"].push(new Room(helper));
            }

            break;
        }
        case 1:
        case 2: case 16: {
            // 1: Start, 2: Spawn, 5: Crawler
            // One block big entities only
            helper.x = roundToGrid(mouse.x - gridSize / 2);
            helper.y = roundToGrid(mouse.y - gridSize / 2);
            helper.w = gridSize;
            helper.h = gridSize;
            
            let selectedRoom = null;
            for (let i = 0; i < map["rooms"].length; i++) {
                let room = map["rooms"][i];
                if (FullyInRectVsRect(helper, map["rooms"][i])) {
                    selectedRoom = room;
                }
            }

            if (!selectedRoom) {
                helper.color = "red";
                break;
            }
            
            for(let i = 0; i < selectedRoom.entities.length; i++) {
                let obj = selectedRoom.entities[i];
                if (RectVsRect(obj, helper)) {
                    // helper.color = "red";
                }
            }
            
            if (mouse.released && helper.color == "green") {
                if (selectedObjectType == 1) {
                    selectedRoom.entities.push(new Start(helper));
                } else if (selectedObjectType == 2) {
                    selectedRoom.entities.push(new Spawn(helper));
                } else if (selectedObjectType == 5) {
                    selectedRoom.entities.push(new Crawler(helper));
                } else if (selectedObjectType == 16) {
					selectedRoom.entities.push(new GrapplePoint(helper));
				}
            }

            break;
        }
        case 3: 
        case 4:
		case 5:
        case 6:
        case 8: 
        case 11:
        case 12: 
        case 13:
		case 14: case 15: {
            // More than 1 block big
            if (!mouse.clicked && !mouse.released) {
                helper.x = roundToGrid(mouse.x - gridSize / 2);
                helper.y = roundToGrid(mouse.y - gridSize / 2);
                helper.w = gridSize;
                helper.h = gridSize;
            } else {
                let helperOffset = {x: gridSize / 2, y: gridSize / 2};
                if (mouse.x < mouse.downX) helperOffset.x -= gridSize;
                if (mouse.y < mouse.downY) helperOffset.y -= gridSize;
                
                helper.x = roundToGrid(mouse.downX - helperOffset.x);
                helper.y = roundToGrid(mouse.downY - helperOffset.y);
                helper.w = roundToGrid(mouse.x + helperOffset.x) - helper.x;
                helper.h = roundToGrid(mouse.y + helperOffset.y) - helper.y;


                if (helper.w == 0 || helper.h == 0) {
                    helper.color = "red";
                    break;
                }
                
                if (helper.w < 0) {
                    helper.x += helper.w;
                    helper.w = Math.abs(helper.w);
                }
                if (helper.h < 0) {
                    helper.y += helper.h;
                    helper.h = Math.abs(helper.h);
                }
            }

            let selectedRoom = null;
            for (let i = 0; i < map["rooms"].length; i++) {
                let room = map["rooms"][i];
                if (FullyInRectVsRect(helper, map["rooms"][i])) {
                    selectedRoom = room;
                }
            }

            if (!selectedRoom) {
                helper.color = "red";
                break;
            }
            
            // for(let i = 0; i < selectedRoom.entities.length; i++) {
            //     let obj = selectedRoom.entities[i];
            //     if (RectVsRect(obj, helper)) {
            //         helper.color = "red";
            //     }
            // }
            
            if (mouse.released && helper.color == "green") {
                if (selectedObjectType == 3) {
                    selectedRoom.entities.push(new BasicBlock(helper));
                } else if (selectedObjectType == 4) {
                    selectedRoom.entities.push(new Lava(helper));
                } else if (selectedObjectType == 5) {
					selectedRoom.entities.push(new SafeZone(helper));
				} else if (selectedObjectType == 6) {
                    selectedRoom.entities.push(new HelpTextTrigger(helper));
                }
                else if (selectedObjectType == 7) {
                    selectedRoom.entities.push(new MoveTrigger(helper));
                }
                else if (selectedObjectType == 8) {
                    selectedRoom.entities.push(new CutsceneTrigger(helper));
                }
                else if (selectedObjectType == 11) {
                    selectedRoom.entities.push(new Light(helper));
                }
                else if (selectedObjectType == 12) {
                    selectedRoom.entities.push(new DarknessBlock(helper));
                }
                else if (selectedObjectType == 13) {
                    selectedRoom.entities.push(new CamOffsetTrigger(helper));
                }
				else if (selectedObjectType == 14) {
					selectedRoom.entities.push(new EnemySpawner(helper));
				}
                else if (selectedObjectType == 15) {
					selectedRoom.entities.push(new SwingingBlock(helper));
				}
            }
            
            break;
        }
        default: {
            break;
        }
    }
}