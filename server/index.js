const { httpParser } = require('../lib/httpParser.js');
const net = require('net'); 

function  getSocket(callback){
	return net.createServer(callback)
}

function handler(socket){
	 socket.on('data', (data) => {
         const buff = data.toString(); // Convert buffer data to string
         httpParser(buff) // Parse the HTTP request
             .then((data) => {
                console.log("test : "+JSON.stringify(data)); // Log the parsed data
             });
     });
        socket.write('HTTP/1.1 200 OK\nContent-Type: text/plain\n\nHello World\n'); // Send a response
        socket.end(); // Close the connection

}

class  Server  {
	socket;  	
	constructor(){
	this.socket = getSocket(handler);
	this.routes= [] 
	}

	listen(PORT,callback){
		this.socket.listen(PORT,callback)
	}
}

class  RouteHandler extends Server{
	 
	constructor(){
		super()
		this.socket.on('data',()=>this.handler())
	}

	setRoute(method,object){
		const route  =  new  Object();
		route.callback = object.callback;
		route.path  =  object.path;
		route.method=method;
		this.routes.push(route)
		console.log(this.routes)
	}


	get(path,callback){
		this.setRoute("GET",{callback:callback,path:path})	
	}
	post(path,callback){
		this.setRoute("POST",{callback:callback,path:path})
	}
	
}


const  routeHandler  = new RouteHandler()
//routeHandler.get({callback:()=>{
//	console.log("we are getting started")
//},path:"/"})
//routeHandler.setRoute("POST",{callback:()=>{},path:"/post"})
//server.listen(8080,()=>{V
//	console.log("server started");
//})
routeHandler.listen(8080,()=>{
	console.log("server started")
})

  
routeHandler.get("/",()=>{})
