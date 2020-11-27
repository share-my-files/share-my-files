const http = require('http');
const PORT = process.env.PORT
const SERVER_ADDRESS = "http://74.119.146.38"

const server = http.createServer();
server.on('request', HandleRequest)
server.listen(PORT, ListenStart);



function HandleRequest(incomingMessage, response) {
    //console.log("=======Request Received======")
    const url = incomingMessage.url
    const method = incomingMessage.method
    const headers = incomingMessage.headers
    const req = incomingMessage
    const res = response
    //console.log("URL: ", url, "METHOD: ", method)


    const replacerFunc = () => {
        const visited = new WeakSet();
        return (key, value) => {
            if (typeof value === "object" && value !== null) {
                if (visited.has(value)) {
                    return "*************************************************************";
                }
                visited.add(value);
            }
            return value;
        };
    };

    let reqStringify = JSON.stringify(req, replacerFunc());

    req.on("error", ErrorHandle)
    res.on("error", ErrorHandle)

    let headersObj = {
        'Access-Control-Allow-Origin': `${req.headers.origin}`,
        'Access-Control-Allow-Methods': "POST",
        'Content-Type': "text/json",
        'X-Powered-By': "GoodOne.JS",
    }
    if (method == "OPTIONS") {
        object = {
            'Access-Control-Allow-Origin': `${req.headers.origin}`,
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Methods': "POST",
            'Content-Type': "text/json",
            'X-Powered-By': "HelloFromMe.JS",
        }
        res.writeHead(201, { ...object })
        res.end()
        console.log("Options Sent To: ", object["Access-Control-Allow-Origin"])
    }
    else {
        //console.log("Inside Post")
        let str = ""
        req.on("data", function (chunk) {
            str += chunk
        })
        req.on("end", function () {
            SendTheClientRequestToMainServer(req, res, str)
        })
    }
}


function ErrorHandle(err) {
    console.log("Error", err)
}
function ListenStart(err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log(`Server Started On Port: ${PORT}`)
    }
}


function SendTheClientRequestToMainServer(originalRequest, originalResponse, body) {

    let length = originalRequest.length + body.length
    let options = {
        hostname: `${SERVER_ADDRESS}`,
        method: 'POST',
        path: '/',
        headers: { "content-length": length }
    }
    var req = http.request({ ...options }, (response) => {
        var receivedBody = ''
        response.on('data', function (chunk) {
            receivedBody += chunk
        });
        let origin = originalRequest.headers.origin
        response.on('end', function () {
            let receivedStatusCode = response.status
            let receivedHeaders = response.headers

            console.log(origin, "StatusCode: ", receivedStatusCode, "Received Headers: ", receivedHeaders, "Received Body: ", receivedBody)

            originalResponse.writeHead(200, {
                "content-type": "text/json",
                'Access-Control-Allow-Origin': `${origin}`,
                'Access-Control-Allow-Methods': "POST",
            })
            originalResponse.write(receivedBody)
            originalResponse.end()
        })
    }
    )
    req.on('error', (error) => {
        console.log('An error***************', error);
    })
    req.write(originalRequest + "****" + body)
    req.end()

}
