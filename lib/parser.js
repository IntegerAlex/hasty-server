const http  = require('http');
const { abort } = require('process');

const server = http.createServer((req, res) => {
	console.log(req.url);		
	console.log(req.method);
	console.log(req.headers);
	console.log(req);
	req.on('data', (data) => {
		console.log(data);
		console.log(data.toString());
	})

})


//server.listen(8080, () => {V
//	console.log('Server is running on port 8080');
//})

//POST /api/users HTTP/1.1
function httpParser(req){
	const requestString = req.split("\n");
	const method  =requestString[0].split(" ")[0];
	const path  =  requestString[0].split(" ")[1];
	const version  =  requestString[0].split(" ")[2];
	console.log(method + "\n")
	console.log(path + "\n" )
	console.log( version + "\n")
	console.log(requestString[1])

}
//httpParser("POST /api/users HTTP/1.1 \nhost:www.google.com")
//console.time('Execution Time');
JSONbodyParser("{key:value,loda:lassan,}")


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
	console.log("length"+req.length)
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
                        console.log(req)
                        storePair(req,httpJSON)
                        console.log("i")
                }
        }
        console.log(req + flag+pos)
        console.log(httpJSON)
        console.log(JSON.stringify(httpJSON))
        console.timeEnd('Execution Time');
        return  req || httpJSON;
}




