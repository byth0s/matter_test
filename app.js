
var express = require('express');
var app = express();
var io = require('socket.io');
var serv = require('http').Server(app);
var Matter = require('matter-js/build/matter.js');
global.md5 = require('js-md5');



app.get('/',function(req,res){
	res.sendFile(__dirname + '/index.html');
});
app.get('/:file',function(req,res){
        res.sendFile(__dirname + '/'+req.params.file);
});
app.get('/js/:js_file',function(req,res){
        res.sendFile(__dirname + '/js/'+req.params.js_file);
});


app.use('/',express.static(__dirname + '/'));


serv.listen(80);

var io = require('socket.io')(serv,{});

var engine = Matter.Engine.create();
engine.world.gravity.y = 0;

//engine.world.bounds = { min: { x: -1600000, y: -1600000 }, max: { x: 1600000, y: 1600000 } }
for(var i = 0; i < 500 ; i++) {
	var box = Matter.Bodies.rectangle(Math.floor(Math.random()*1600), Math.floor(Math.random()*800), 80, 80);
	box.objID = md5(Math.floor(new Date().getTime()*Math.random()).toString());
	
	Matter.Body.setVelocity(box, {x:Math.floor(Math.random()*-5),y:Math.floor(Math.random()*-5)}) ;
	
	
	box.type_ = 'box';
	Matter.World.add(engine.world, box);
}


setInterval(function(){
	var box = Matter.Bodies.rectangle(Math.floor(Math.random()*1600), Math.floor(Math.random()*800), 80, 80);
	box.objID = md5(Math.floor(new Date().getTime()*Math.random()).toString());
	
	Matter.Body.setVelocity(box, {x:Math.floor(Math.random()*-5),y:Math.floor(Math.random()*-5)}) ;
	box.type_ = 'box';
	
	Matter.World.add(engine.world, box);


	 engine.world.bodies.forEach(function(obj){
    	if(obj.type_ != 'ground') {
	    	Matter.Body.setVelocity(obj, {x:Math.floor(Math.random()*-10),y:Math.floor(Math.random()*-10)}) ;
    	}
    });

},500);







//var ground = Matter.Bodies.rectangle(500, 400, 810, 60, { isStatic: true });
//ground.objID = md5(Math.floor(new Date().getTime()*Math.random()).toString());

//ground.type_ = 'ground';


//Matter.World.add(engine.world, ground);

var viewCoords = {min:{x:-200,y:-200}, max:{x:2000,y:1600}};

var SOCKETS_LIST = [];

io.sockets.on('connection',function(socket){
	
	socket.id = md5(Math.floor(new Date().getTime()*Math.random()).toString());
	
	SOCKETS_LIST[socket.id] = socket;

	console.log('connect user with ID ' + socket.id);
});



setInterval( function(){
	var objects = {}
    Matter.Events.trigger(engine, 'tick', { timestamp: engine.timing.timestamp });
    Matter.Engine.update(engine, engine.timing.delta);
    Matter.Events.trigger(engine, 'afterTick', { timestamp: engine.timing.timestamp });
    engine.world.bodies.forEach(function(obj){
    	if(obj.type_ != 'ground') {
    		if((obj.position.x > viewCoords.min.x && obj.position.x < viewCoords.max.x) && 
    			(obj.position.y > viewCoords.min.y && obj.position.y < viewCoords.max.y)) {
	    	objects[obj.objID] =  {
	    		type:obj.type_,
	    		x:obj.position.x,
	    		y:obj.position.y,
	    		width:obj.type_ == 'ground' ? 810 : 80,
	    		height:obj.type_ == 'ground' ? 60 : 80,
	    		angle:obj.angle,
	    		id:obj.objID,

	    	};
		}
    	}
    });


    for(socket_id in SOCKETS_LIST) {
    	SOCKETS_LIST[socket_id].emit('updateWorld',{objects:objects});
    }
   

    
},1000/34);





console.log("server started on port 80");


