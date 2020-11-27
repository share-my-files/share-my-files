const http = require('http');
const port = process.env.PORT

const httpServer = http.createServer()

httpServer.on("request",(req, res) => {
  res.writeHead(200, {
     'Content-Type' : 'text/html',
   })
  res.end('<h1>Server is intializing!</h1>');
})
httpServer.listen(port,() => {
  console.log(`Server running at port `+ port);
})
