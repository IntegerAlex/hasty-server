const   Server=  require('../server/index.js')
const  server  =  new Server()

server.post("/",(req,res)=>{
	console.log(req)
	res.send({status:200})
})
server.listen(8080,()=>{
	console.log("test")
})
