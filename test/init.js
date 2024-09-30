const   Server=  require('../server/index.js')
const  server  =  new Server()

server.get("/",(req,res)=>{
	console.log(req)
	res.json({status:200})
})
server.listen(8080,()=>{
	console.log("test")
})
