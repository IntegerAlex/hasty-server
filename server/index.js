const { httpParser } = require('../lib/httpParser.js'); // Import the httpParser function from the httpParser.js file
const net = require('net');// Import the net module from Node.JS
const  Response = require('./response.js' ); // Import the response object
const { warn } = require('console');
function  getSocket(callback,context){
	return net.createServer(Socket=>callback(Socket,context))
}

function handler(socket,context){
	 socket.on('data', (data) => {
		const  res =  new Response(socket)
         const buff = data.toString(); // Convert buffer data to string
         httpParser(buff) // Parse the HTTP request
             .then((data) => {
                //console.log("test : "+JSON.stringify(data)); // Log the parsed data
		pathController(data,context,res)    
			
             });
     });

}



function pathController(data,context, socket) {
    const path = data.path;
	const  method = data.method
    console.log("pathController: " + method + ": " + path);

    // Check if the path exists in the context.routes
    const route = context.routes.find(route => route.path === path && route.method === method);

    if (route) route.callback(data, socket); 
	else socket.sendStatus(404);
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

class  Hasty extends Server{
	 
	constructor(){
		super()
		this.socket.on('data', ()=> this.handler())
	}

	setRoute(method,object){
		const route  =  new  Object();
		route.callback = object.callback;
		route.path  =  object.path;
		route.method = method;
		this.routes.push(route)
		console.log(this.routes)
	}


	get(path,callback){
		this.setRoute("GET",{callback:callback,path:path})	
	}
	post(path,callback){
		this.setRoute("POST",{callback:callback,path:path})
	}
	put(path,callback){
		this.setRoute("PUT",{callback:callback,path:path})
	}
	delete(path,callback){
		this.setRoute("DELETE",{callback:callback,path:path})
	}
	patch(path,callback){
		this.setRoute("PATCH",{callback:callback,path:path})
	}
	head(path,callback){
		this.setRoute("HEAD",{callback:callback,path:path})
	}
	options(path,callback){
		this.setRoute("OPTIONS",{callback:callback,path:path})
	}

}

module.exports = Hasty

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

  
