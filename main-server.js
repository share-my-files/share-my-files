const PORT = process.env.PORT


const http = require('http')
// const https = require("https")
const server = http.createServer();
//const PORT = 7001;
const subtle = require('crypto').webcrypto.subtle

server.on('request', HandleRequest)
server.listen(PORT, ListenStart);
let INITIAL_API_ADDRESS = process.env.ADDRESS
const API_ADDRESS_HOST = INITIAL_API_ADDRESS.substr(8, INITIAL_API_ADDRESS.length)
console.log(API_ADDRESS_HOST)


let rawHekoPublicKey = JSON.stringify({
    key_ops: ['encrypt'],
    ext: true,
    kty: 'RSA',
    n: 'wEXJVf_F6o4aeFQ92d2z-gsjXl8tcxV0NwF1C40do6LEfpZRYv_bFXBJZJiOQfXfuPYpbFrU3GgSGygBrWp2kfwjwIjYUUAkqIzEI6hSzj7fw7NrG5mGPQfQmCsP_oF287J8f4TpP7uneuSQm22LJTkrmSdCYa50-SACa5STQjoX_57P-myEXhMHpvYaO1BIE7H-gbUrM6CjOiCcM8EpNV5GrFIy3aq5_2FDjIIf7hq_3kWtcj7KRGx7jhgKv3hLgwzARn8_YZiaDCaf0u-TLwHJwoxvpOZfHzSQSrqsDpZc319HDii6xNHjK2fp1c_6byONJSz0jQuDnDzj7FPlGoByt14FLNSzVQfnuwusc9mhAjgK2Gj3TxmU68yryT0-1DZiQWr_1EJxtTJTHYBYyi4rOXP5nAfrVyV2fnXptvz7HinXgDFD-7QpTc9h8hobgxIyh8nW6Wvbl_ifhCXyTxLk2l86H8FBow9mgP6CDKa7V06Mu1nHLyu2bB5sF8Yz6Mb_cPyvxJ1cye_fMYMnFYFKYakUfZSzJncb_dfxEp68QuzNKLf5u8E6bfX5KkYscE9jKVoQGJzL1ENiLyTKlmnh-iQFiqL8jBkgXlypp6M097OXSgvYgP4hR0ppVRakq0B9OdvoAAATYkWl8SM_k0JdhugEkWi5KoaNF5QGYXc',
    e: 'AQAB',
    alg: 'RSA-OAEP-256'
})
let parsedHekoPublicKey = JSON.parse(rawHekoPublicKey)
let raw2IvString = "155,207,0,240,227,165,241,76,243,123,82,95,227,67,170,232"
let splitForHeko = raw2IvString.split(",")
let ivArrayForHeko = new Uint8Array(splitForHeko.length)
for (let i = 0; i < splitForHeko.length; i++) {
    ivArrayForHeko[i] = splitForHeko[i]
}
subtle.importKey("jwk", parsedHekoPublicKey, { name: "RSA-OAEP", padding: "RSA_PKCS1_PADDING", hash: { name: "SHA-256" } }, true, ["encrypt"]).then(kk => {
    parsedHekoPublicKey = kk;
})



let rawHekoPrivateKey = JSON.stringify({
    key_ops: ['decrypt'],
    ext: true,
    kty: 'RSA',
    n: 'siRaPgR8ALINt9nFzzNp8ztm2n1Nz4Cs1lA-HOspkMUV-EaHdAJAdU5kDCsHc0PXAr4H_C2w94yiwQ4uzmfXSuJSeN9DDdqTnZVRdIo8ce-nijgh6kPdYoEjk3CjOtmlNM228stow4QAZEYB-xlIsVBE3ht-p0kSh4spKRnZ4_s_VhMDBs-S0VmQLlex3FMzVe4m5ZgNh6jNQnzHaUllhzYQ_pN6oXGTXAzMHSfUHPy7xkeBbICfTvHAXcgfdopGw8QdMBrmKgon0YkkNa_PHw3UnTQCP6xknjdeOR1MXbWK3hvRHYFY7Oo5LH6wleXiSJ7Ri2T3mLPOn_vRy4tQ978SiwFvbeuXxM-W-voPLciaI6N9bj2k7NEWQMDBhT_IczHP8xBKHJ05NjsVT1PedbEPshlZPdHLF3-7S3N1VIGqOkBVUF5sjHS6bqYVbg0rZtCUtKu_aPdecyOcGOWBPNuzcLEjaI5Y0vwniKU3m27SFRg4WisEgju6A8bkPnWoDMIUsWWYLYuKUZ0PflGY7YdoXftY9pJS_lS_kYZlLmCF_E2T_-vCVdDcOzBVIuVzem4xnvt8D56Zq3_pFyyUW430A3zz2AEWyXfIvhYyUaBdJy3KG9Z3dZiUrmIetM_NzdwDTF02_3X8SajvnDETgAWaQzn0zaMxHlj8L4Y5Ejc',
    e: 'AQAB',
    d: 'Q9JRRSFB8KXZUTCo_czOPptT-kUQdbrAkst0CmCBr6tJRP_dHA6rab3Rm0xahsjCODoPIjRnFqhFYoi6yzx_m_P0gC5IAiNAZhNuMpdakeoy-A2M4_q4c4NE_yI4EvS_0A2t5FwK470CxSpeILIsmc08mu8O1jOcyVvy7MH50bFbGLMeSN6IQAoAOZSLk51dgw6rYmf0ZryegPyukugtrj-oUrPlUUfDWZ1JrKP4Ppz-BGw-2wdRH6YsncfOKrxUWr30etcS39iD9mNnFMV9bo4-bydY39MLb60Ww1njNB4k45DlmX0gVPqLj-Qf6MHf19QXZSGonkt-lCw0YHEG_tjks8lvErYsVZXbCTUGME945WJtQU3M9Ck_3YCeEU3_JzyVVL4wB-AwKxCKg7avRTTqEFHH9d_7STFMH7X0nnpF_KORnoAToHapnUmg_4nu9Y6GaaPlYAvEQA2xnmGj0LVALGxgcRBGOpHQjF32A5f_DI2OVO_ULJwFPoHGnpUyRDv0eUYvf0JiAjsLf7_8-vwryxntgUCUjSV4MspuRFI5kxoCZILuNUNZpIYRbW1VK9J8tlWNbOl22h_1K1LBuAHHKGkAW5qL90QZHhSEy3uC0Cv3VW8yFomX_L71ZY-rzG6855HVjoSrKJzmMlAD_O-jt_A9PrbSEunriKBYzgE',
    p: '27DCpKEEMuwPAv2K1pHecJ19H3zdqr_vTLdcm6GxbEEpodMfm_DtGCoD942Ds61aymWlUqZHsXQ_m2iQCZJL8CeYwgxaBrcvF2xeDzwkOg3xSRNo_RpIH3wd12Ev4kMRd0NCCQaECfyN6EcIizI81DcMqGH8ukgPu3LjgIKclBGLGwiJXSHv92lYCXtxETbqzUuG_k-22eKiDXWbIudS9mOwKYFLalua_7Wo29GZJnnU5JE-rfabU796CsX5Om6RVcvb5hrP5nbnG7FxSc2rbu3a78KMjXUS3-VFX_D8ebzWFYhDAoc2HmrIeixELBkNwOynkCL_IUFy32Er0QQtNw',
    q: 'z5WmmvlHOW9FM-wsx8fTX9Ax4rosQpiijIG0z2fQLEtTKyp66ihDx_7xFZRpqQFi7NPrRKt5nthAlx9ztHQ1pwVdtZWYJc1OZvq7kkz1id-QqY8Fn32eAUKVyxwo7jUltSKb4VMaQIxhjyvma6WA7yRuQyKfk00hftpqMEUAwiHIdIzbWjy_oxM1td7RvORdmWfb4qay3mng_ia8oMZRCAxjhIiWoo35Ag_DwYxrEhtRl8ep-lr2XwavbEJYisluSz_NYXeAy25hkFzCVOpb4uFc2w4pwYeLSGyIA967fuCXI91bI-gZwiyak2qsfR8A7bzOv7Z2xc8bYdFocVzDAQ',
    dp: 'yJ-WURN-Kyap2thBlwuk8IDSCBRWth0LYqq8lp_F0A99_ns4DYeqbXvJHaQNVuOD2vuSS3TwWdzITZrilusUEB-JAASZnjJhfemHyC_rAV1EMLDaGvGKVb5Z3huxx9XpuFkij-10XU5XJXzhD4T0SfRvycGaM1-lhlA39F7SsOGIgEp-bx-T7gQ00ov5SHg3Wv2TLOENIdM2nEX_Q5OujrWg5XZesaUwWj7CEuRJEPsHcSg27lUbqhJdWENNA5B_hrNhgLSRkWyaRw73XyfEW8w5OOUYyAHXF8JfZWtElcPeWdGTKFbkFEj-BZwxMXg7uCgmKZncFbmYNuidRAalZw',
    dq: 'jVwWkZBRnV4VnS8mq4F7gtLPNducClnQz6gATgEe9RrybwHFpDF5Pvdwi0Z-0XU9PZNuslunPbF8Aq2LaIZ-hteTofVWH9_4lQ4Hr7AywQn6hEz-AkdT0v3Z7e-mO9j7bac8yauCxBQU15-IkSOqcq-3WoZ4bqHmvnDUQTysMIc674uAUKnvwohxWgF7iItm5fGg_m6Qff9SFSCh8UY7piRxnK47DkVqHapIn0QVIcZywM5aBT_uaHWv_iQMEa7sKdgv70Cm92GalOll-NeDbTQUvKOfccfw5Ifr8964hcVBh03VI9WJvP4M4XiSL75uLncVv93scfYAapNk8VW_AQ',
    qi: 'r9-xlf687fD6gazbjkjov3ZCNEEH1SW4FVFLMNC1tfxDJs-0862fTToFtsv4putM3oLa-z7hZ34bkHMh5AP0mon8VRxKaEiLNqlFuUZ7xM3_mVSaJePBmF77lhb6OQ0CPMH_g09VWaTXFRqsWoXMa_vH9_iS9JEOWzA0_P4YqHzsaEkXcInKlQwHyeWPog_5HXeMge1qvHM0Q4YudItJzyG3obQ0GQFYpqsBpU6GaN09eMsSyy3nv6BxoFG8-wQB8ln58r9ZaYKv2TR1S9O4k41XDP97WcgR6fm5HL1VW3-9gQGHfcgsWWn7WcyJCOiYXjVjGTZKDTcoPquBUfMifw',
    alg: 'RSA-OAEP-256'
})
let parsedHekoPrivateKey = JSON.parse(rawHekoPrivateKey)
let raw2IvString2 = "155,207,0,240,227,165,241,76,243,123,82,95,227,67,170,232"
let splitForHeko2 = raw2IvString2.split(",")
let ivArrayForHeko2 = new Uint8Array(splitForHeko2.length)
for (let i = 0; i < splitForHeko2.length; i++) {
    ivArrayForHeko2[i] = splitForHeko2[i]
}
subtle.importKey("jwk", parsedHekoPrivateKey, { name: "RSA-OAEP", padding: "RSA_PKCS1_PADDING", hash: { name: "SHA-256" } }, true, ["decrypt"]).then(kk => {
    parsedHekoPrivateKey = kk;
})




function HandleRequest(incomingMessage, response) {
    console.log("======Request Received======")
    const url = incomingMessage.url
    const method = incomingMessage.method
    const headers = incomingMessage.headers
    const req = incomingMessage
    const res = response
    console.log("URL: ", url, "METHOD: ", method)


    const replacerFunc = () => {
        const visited = new WeakSet();
        return (key, value) => {
            if (typeof value === "object" && value !== null) {
                if (visited.has(value)) {
                    return;
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
        let headersList = req.headers["access-control-request-headers"] // Do not use the Pascal Casing for htat as server always change it to lower case
        // console.log(req.headers)
        object = {
            'Access-Control-Allow-Origin': `${req.headers.origin}`,
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Headers': `${headersList}`,
            'Access-Control-Allow-Methods': "POST",
            'Content-Type': "text/json",
            'X-Powered-By': "MOO.JS",
        }
        res.writeHead(201, { ...object })
        res.end()
        // console.log("Options Sent To: ", object["Access-Control-Allow-Origin"])
    }
    else if (method == "POST") {
        let str = ""
        req.on("data", function (chunk) {
            str += chunk
        })
        req.on("end", function () {
            let substitutedReqObj = MakeSubstituteReqObject(req)
            SendTheClientRequestToMainServer(substitutedReqObj, res, str)
        })
    } else if (method == "GET") {
        let substitutedReqObj = MakeSubstituteReqObject(req)
        SendTheClientRequestToMainServer(substitutedReqObj, res)
    } else {
        ErrorHandle("Request Method Not Supported", "1", req, res)
    }
}


function ErrorHandle(err, sendBack = "0", req = "", res = "") {
    console.log("Error:: ", err)
    if (sendBack != "0") {
        res.writeHead(200, { "stats": "error" })
        res.write("404 Error")
        res.end()
    }
}
function ListenStart(err) {
    if (err) {
        console.log("Error: While Starting The Server", err);
    }
    else {
        console.log(`Server Started On Port: ${PORT}`)
    }
}
function RawArrayStringToTypedArray(rawString) {
    // console.log(rawString, typeof rawString)
    let split = rawString.split(",")
    let array = new Uint8Array(split.length)
    for (let i = 0; i < split.length; i++) {
        array[i] = split[i]
    }
    return array;
}
function StringToTypedArray(responseToSend) {
    let array = new Uint8Array(responseToSend.length)
    for (let i = 0; i < responseToSend.length; i++) {
        array[i] = responseToSend.charCodeAt(i)
    }
    // console.log(array.length, typeof array, "this is the converted string to array")
    return array;
}
function ConverArrayBufferToString(decrypted) {
    let string = ''
    for (let i = 0; i < decrypted.length; i++) {
        string += String.fromCharCode(decrypted[i])
    }
    return string
}
function SendTheClientRequestToMainServer(originalRequest, originalResponse, body = "notDefined") {
    let requestToSendToMainServer;
    if (body == "notDefined") {
        requestToSendToMainServer = JSON.stringify(originalRequest) + "*^*^*^" + "notDefined"
    } else {
        requestToSendToMainServer = JSON.stringify(originalRequest) + "*^*^*^" + body
    }

    EncryptForHeko(requestToSendToMainServer, callMe)
    function callMe(requestToSendToMainServer, err = "notDefined") {
        if (err != "notDefined") {
            console.log("Error At Heko Encrypt: ", err)
            ErrorHandle(err, "1", req, originalResponse)
            return;
        }
        let length = requestToSendToMainServer.length
        let options = {
            host: `${API_ADDRESS_HOST}`,
            port: 80,
            path: "/",
            method: 'POST',
            headers: { "accept": "application/json", "content-length": length }
        }
        // console.log("Destructued Options Made : ", { ...options })
        var req = http.request({ ...options }, (response) => {
            var receivedBody = ''
            response.on('data', function (chunk) {
                receivedBody += chunk
            });

            let origin = originalRequest.headers.origin
            response.on('end', function () {
                let splitMessages = receivedBody.split("^^**^^")
                receivedTopHeaders = splitMessages[0]
                receivedBottomBody = splitMessages[1]

                DecryptForHeko(receivedTopHeaders, callMEE)
                function callMEE(buffer, error = "") {
                    if (error != "") { console.log(error); return; }

                    let splittedMessages = buffer.split("^^**^^")
                    let receivedStatusCode = splittedMessages[0].toString()
                    let receivedHeaders = JSON.parse(splittedMessages[1])

                    DecryptForHeko(receivedBottomBody, callMeAgain)
                    function callMeAgain(buffer, error = "") {
                        if (error != "") { console.log(error); return; }
                        console.log("=======Handle Response======")
                        // console.log("Origin: ", origin, "StatusCode: ", receivedStatusCode, "\n" + "Received Headers: ", JSON.stringify(receivedHeaders).substr(0, 5), "Received Body: ", receivedBody.substr(0, 20))
                        console.log("Origin: ", origin, "StatusCode: ", receivedStatusCode, "\n" + "Received Headers: ", JSON.stringify(receivedHeaders).substr(0, 5))
                       
                        originalResponse.writeHead(receivedStatusCode, {
                            ...receivedHeaders,
                            'Access-Control-Allow-Origin': `${origin}`,
                            'Access-Control-Allow-Methods': `${originalRequest.method}`,
                        })
                        originalResponse.write(buffer)
                        originalResponse.end()
                    }
                }
            })
        }
        )
        req.on('error', (error) => {
            console.log('Error:: While Sending The Request To -> ', INITIAL_API_ADDRESS, error);
        })
        requestToSendToMainServer = requestToSendToMainServer.toString()
        req.write(requestToSendToMainServer)
        req.end()
        // console.log("RequestToSendToMainServer: ", requestToSendToMainServer.substring(0, 20))

    }
}

function MakeSubstituteReqObject(req) {
    let url = req.url
    let headers = req.headers
    let method = req.method
    let obj = {
        "url": url,
        "headers": headers,
        "method": method
    }
    return obj
}



function Hellow(message, max, current, buffer, callback) {
    let messageLength = message.length
    let testerLength = (current * 100) + 100
    if (testerLength > messageLength) { messageLength = messageLength }
    else { messageLength = testerLength }
    // let messageTemp = message.substr(current * 100, messageLength) //IMPORTANT Due to some reasons he is not slicing the string into fixed length of 100 digits or chars, maybe it has some trick, So we used substring() which works perfectly , this was also the reason why padding was failing due to size.
    // messageTemp = message.substr(current * 200, (current * 200) + 200)
    let messageTemp = message.substring(current * 100, messageLength)
    return new Promise((resolve, reject) => {
        subtle.encrypt({
            name: "RSA-OAEP",
            iv: ivArrayForHeko,
        }, parsedHekoPublicKey, StringToTypedArray(messageTemp)
        ).then(function (encrypted) {
            let sendingThing = new Uint8Array(encrypted).toString()
            buffer += sendingThing
            current += 1
            let updatedBuffer = buffer;
            // console.log("Message Temp :", messageTemp.length , "Total Length :" ,updatedBuffer.length, "Last Data :", updatedBuffer[updatedBuffer.length -1],  current -1 ,  "/", max)
            messageTemp = ""
            if (current < max) {
                Hellow(message, max, current, "", callback).then(buff => {
                    updatedBuffer = updatedBuffer + "^*^*" + buff
                    // console.log(updatedBuffer.substr(0, 20),"Last Data :", updatedBuffer[updatedBuffer.length -1],  current -1 , "/", max)
                    resolve(updatedBuffer)
                })
            } else {
                resolve(updatedBuffer)
            }
        }).catch(function (err) {
            console.error(err);
            callback("", err)
            reject();
        })
    })
}
function EncryptForHeko(message, callback) {
    let actualQ = (message.length) / 100
    let floor = Math.floor(actualQ)
    if (actualQ > floor) { actualQ += 1 }
    actualQ = Math.floor(actualQ)
    let starter = 0
    let buffer = ""
    // console.log("Message : ", message.substr(0, 10), starter, "/", actualQ, "Message Length: ", message.length, callback)

    Hellow(message, actualQ, starter, buffer, callback)
        .then((buffer) => {
            callback(buffer)
        })
}
function Mellow(message, max, current, buffer, callback) {
    messageTemp = message.split("^*^*")[current]
    messageTemp = RawArrayStringToTypedArray(messageTemp)
    // console.log("Message Temp: ", current,  messageTemp)
    return new Promise((resolve, reject) => {
        subtle.decrypt({
            name: "RSA-OAEP",
            iv: ivArrayForHeko,
        }, parsedHekoPrivateKey, messageTemp
        ).then(function (encrypted) {
            // console.log('This is the decrypted buffer: ', encrypted)
            let sendingThing = new Uint8Array(encrypted)
            // console.log("This is the decrypted uint8Array: ", sendingThing)
            sendingThing = ConverArrayBufferToString(sendingThing)
            // console.log("This is the decrypted string: " ,sendingThing)
            buffer += sendingThing
            current += 1
            let updatedBuffer = buffer;
            // console.log(updatedBuffer.substr(0, 20), "Last Data :", updatedBuffer[updatedBuffer.length - 1], current - 1, "/", max)
            if (current < max) {
                Mellow(message, max, current, "", callback).then(buff => {
                    updatedBuffer = updatedBuffer + buff
                    // console.log(updatedBuffer.substr(0, 20), "Last Data :", updatedBuffer[updatedBuffer.length - 1], current - 1, "/", max)
                    resolve(updatedBuffer)
                })
            } else {
                resolve(updatedBuffer)
            }
            // callback(updatedBuffer, "");
        }).catch(function (err) {
            console.error(err);
            callback("", err)
            reject()
        })
    })
}
function DecryptForHeko(message, callback) {
    let actualQ = message.split("^*^*").length
    let starter = 0
    let buffer = ""
    // console.log("Starting Message : ", message.substr(0, 10), starter, "/", actualQ, buffer, callback)
    Mellow(message, actualQ, starter, buffer, callback)
        .then((buffer) => {
            callback(buffer)
        })
}
