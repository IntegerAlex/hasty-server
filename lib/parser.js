const  request =  require('../test/test.js')
const  net = require('net')


//net.createServer((socket)=>{
//	socket.on('data',(data)=>{
//		console.log(data)
//		const  buff = data.toString()
//		console.log(buff)
//		httpParser(buff)
//	})
//}).listen(8080,()=>{
//	console.log("server started")
//
//})

function findFirstBrac(req){
	const target="{";
	for (let i = 0; i < req.length; i++) {
        	if (req[i] === target) {
        		return i; // Return the position of the target character
			}
	}
	return -1;
}


//POST /api/users HTTP/1.1
async function httpParser(request){
	const req = new Object()
	const requestString = request.split("\n");
	const pos = findFirstBrac(requestString)
	const requestWoBody =  requestString.slice(0,pos)
	//console.log(requestWoBody)
		HTTPbody(requestString,pos)
		.then(async(data)=>{
			req.body = await JSONbodyParser(data)
			console.log(req)
		})

	//console.log(requestString)  
	req.method  = requestWoBody[0].split(" ")[0];
	req.path  =  requestString[0].split(" ")[1];
	req.version  =  requestString[0].split(" ")[2];
	//console.log(requestString[1])
	console.log(req)
	return req;

}
//httpParser("POST /api/users HTTP/1.1 \nhost:www.google.com")
//console.time('Execution Time');
//JSONbodyParser("{key:value,loda:lassan,}")
//console.time()
httpParser(request)

function  storePair(req,httpJSON){
	 let  key ="" ;
	let  i =0;
        while(req[i]!=":"){
		key  += req[i];
                req.shift();
//		console.log(req)
	}
        req.shift()
        let value = "";
	i = 0;
//	console.log(req)
        while(req[i]!=","){
		if(req[i]==null){
			break;
		}
		value  += req[i];
                req.shift();
//		console.log(req)
        }
	req.shift()
	httpJSON[key] = value;
//	console.log(req)
	//console.log("length"+req.length)
	return req
	
}


function JSONbodyParser(body){
	 const req  =  body.split("")
        const httpJSON =  new Object()
        let flag =  0 ;
        let pos= 0;
	while(req.length !=0){
                if(req[0]=="{"){
                        flag += 1;
                        pos +=1;
                        req.shift()
                }
                else if(req[0]=="}"){
                        flag -=1;
                        pos +=1;
                        req.shift()
                }
                else{
//                        console.log(req)
                        storePair(req,httpJSON)
//                        console.log("i")
                }
        }
        console.log(req + flag+pos)
        console.log(httpJSON)
        //console.log(JSON.stringify(httpJSON))
        //console.timeEnd('Execution Time');
        return  req || httpJSON;
}



function  HTTPbody(req,pos){
	flag  =  0;
	let body  ="" 
	return new Promise((resolve,reject)=>{
		const position  =pos; 
		for(let  i=position;i<req.length;i++){
			if(req[i]=="{"){
				flag++;
				body +=req[i]
			}
			else if(req[i]=="}"){
				flag--;
				body +=  req[i]
			}
        		body += req[i]
		}
		console.log(flag)
		resolve(body.replace(/\s+/g, ''))
	})

}
