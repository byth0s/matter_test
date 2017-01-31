var game = {

	config:{},
	objects:{},
	stage:null,
	app:null,
	init:function(objects){
		this.app = new PIXI.Application(window.innerWidth, window.innerHeight, {backgroundColor : 0x1099bb},true);
		document.body.appendChild(this.app.view);

		
		

	},
	updateObjects:function(objects){

		for(obj_id in this.objects) {
			 if(objects[obj_id] == undefined || objects[obj_id] == null) {
			 	this.app.stage.removeChild(this.objects[obj_id]);
			 	delete this.objects[obj_id];
			 }
		}


		for(objID in objects) {
			if(this.objects[objID] != undefined) {
				this.objects[objID].x = objects[objID].x;
				this.objects[objID].y = objects[objID].y;
				this.objects[objID].rotation = objects[objID].angle;
			} else {
				if(objects[objID].type != 'ground') {
					var objTexture = PIXI.Texture.fromImage('trollface.png'); 
					var objectSprite = new PIXI.Sprite(objTexture);
					objectSprite.x = objects[objID].x;
					objectSprite.y = objects[objID].y;
					objectSprite.anchor.set(0.5);
					objectSprite.rotation = objects[objID].angle;
					this.objects[objID] = objectSprite;	
					this.app.stage.addChild(this.objects[objID]);
				}
				

			}

		}


		console.log(Object.keys(this.objects).length);

	},
	draw:function() {
		if(this.app != undefined) {
			
		}
	}







}