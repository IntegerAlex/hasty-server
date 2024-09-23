const { sourceMapsEnabled } = require('process');
const { httpParser } = require('../lib/httpParser.js');
const net = require('net'); 

function  getSocket(callback,context){
	return net.createServer(Socket=>callback(Socket,context))
}

function handler(socket,context){
	 socket.on('data', (data) => {
         const buff = data.toString(); // Convert buffer data to string
         httpParser(buff) // Parse the HTTP request
             .then((data) => {
                //console.log("test : "+JSON.stringify(data)); // Log the parsed data
		pathController(data,context,socket)    
				
		//
		//socket.write('HTTP/1.1 404 \nContent-Type: text/plain\n\nNOT FOUND\n'); // Send a response
		//socket.end(); // Close the connection
             });
     });

}



function pathController(data,context, socket) {
    const path = data.path;
    console.log("pathController: " + path);

    // Check if the path exists in the context.routes
    const route = context.routes.find(route => route.path === path);
    
    if (route) {
        route.callback(data, socket);
    } else {
        return "404";
    }
}



class  Server  {
	socket;  	
	constructor(){
	this.socket = getSocket(handler,this);
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

module.exports = RouteHandler

//const  routeHandler  = new RouteHandler()
//routeHandler.get({callback:()=>{
//	console.log("we are getting started")
//},path:"/"})
//routeHandler.setRoute("POST",{callback:()=>{},path:"/post"})
//server.listen(8080,()=>{V
//	console.log("server started");
//})
//routeHandler.listen(8080,()=>{
	//console.log("server started")
//})

  
