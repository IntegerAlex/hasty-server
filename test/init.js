const  Server=  require('../server/index.js')
const  server  =  new Server()

server.get("/",(req,res)=>{
	console.log(req)
	res.status(200).json({status:200})
})

server.post("/",(req,res)=>{
	console.log(req)
	res.status(201).json({status:201})
})

server.put("/",(req,res)=>{
	console.log(req)
	res.status(202).json({status:202})
})

server.patch("/",(req,res)=>{
	console.log(req)
	res.status(200).json({status:200})
})

server.delete("/",(req,res)=>{
	console.log(req)
	res.status(204).json({status:204})
})

server.listen(8080,()=>{
	console.log("test")
})
