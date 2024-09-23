const   Server=  require('../server/index.js')

const  server  =  new Server()

server.get("/",(req,res)=>{
	console.log(req)
	if(res){
		res.write("HTTP/1.1 200 OK\n\n Hello World")
		res.end()
	}
	else{
		console.log("Aaise banyega coder")
	
	}
})


server.listen(8080,()=>{
	console.log("test")
})
