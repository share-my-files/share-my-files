const http = require('http')
const crypto = require('crypto');
const { Console } = require('console');
const server = http.createServer();
const PORT = process.env.PORT || 7001;
const subtle = require('crypto').webcrypto.subtle
var sendToClient = "0"
const RANDOM_DELAY = 2000
const ARRAY_TIMERS = [400, 500, 600, 700, 800, 900, 1000] //[3000, 10000, 12000, 7000, 11000, 5000, 15000]  // [400, 500, 600, 700, 800, 900, 1000]
server.on('request', HandleRequest)
server.listen(PORT, ListenStart);
// let INITIAL_API_ADDRESS = "https://e3db285c3243.ngrok.io"
let INITIAL_API_ADDRESS = process.env.ADDRESS ||
[
    { "address" : "https://ab5d61f083ad.ngrok.io" , "usedCounter" : 0 , "startTime" : 0},
    { "address" : "https://fa7a83b72246.ngrok.io" , "usedCounter" : 0 , "startTime" : 0},
    { "address" : "https://de67bba8e3d8.ngrok.io" , "usedCounter" : 0 , "startTime" : 0},
    { "address" : "https://ecfcfbe8ad9d.ngrok.io" , "usedCounter" : 0 , "startTime" : 0},
    { "address" : "https://64b115b4e934.ngrok.io" , "usedCounter" : 0 , "startTime" : 0},
    { "address" : "https://5d98de17e146.ngrok.io" , "usedCounter" : 0 , "startTime" : 0},
    { "address" : "https://44dc43295eee.ngrok.io" , "usedCounter" : 0 , "startTime" : 0},
    { "address" : "https://27e234b603b0.ngrok.io" , "usedCounter" : 0 , "startTime" : 0},
    { "address" : "https://ba58b24d37c7.ngrok.io" , "usedCounter" : 0 , "startTime" : 0},
    { "address" : "https://87a282e2a63c.ngrok.io" , "usedCounter" : 0 , "startTime" : 0},
    ]

// INITIAL_API_ADDRESS = JSON.parse(INITIAL_API_ADDRESS)
// const API_ADDRESS_HOST = INITIAL_API_ADDRESS.substr(8, INITIAL_API_ADDRESS.length)
// console.log(API_ADDRESS_HOST)


let rawHekoPublicKey = JSON.stringify({
    key_ops: ['encrypt'],
    ext: true,
    kty: 'RSA',
    n: 'wEXJVf_F6o4aeFQ92d2z-gsjXl8tcxV0NwF1C40do6LEfpZRYv_bFXBJZJiOQfXfuPYpbFrU3GgSGygBrWp2kfwjwIjYUUAkqIzEI6hSzj7fw7NrG5mGPQfQmCsP_oF287J8f4TpP7uneuSQm22LJTkrmSdCYa50-SACa5STQjoX_57P-myEXhMHpvYaO1BIE7H-gbUrM6CjOiCcM8EpNV5GrFIy3aq5_2FDjIIf7hq_3kWtcj7KRGx7jhgKv3hLgwzARn8_YZiaDCaf0u-TLwHJwoxvpOZfHzSQSrqsDpZc319HDii6xNHjK2fp1c_6byONJSz0jQuDnDzj7FPlGoByt14FLNSzVQfnuwusc9mhAjgK2Gj3TxmU68yryT0-1DZiQWr_1EJxtTJTHYBYyi4rOXP5nAfrVyV2fnXptvz7HinXgDFD-7QpTc9h8hobgxIyh8nW6Wvbl_ifhCXyTxLk2l86H8FBow9mgP6CDKa7V06Mu1nHLyu2bB5sF8Yz6Mb_cPyvxJ1cye_fMYMnFYFKYakUfZSzJncb_dfxEp68QuzNKLf5u8E6bfX5KkYscE9jKVoQGJzL1ENiLyTKlmnh-iQFiqL8jBkgXlypp6M097OXSgvYgP4hR0ppVRakq0B9OdvoAAATYkWl8SM_k0JdhugEkWi5KoaNF5QGYXc',
    e: 'AQAB',
    alg: 'RSA-OAEP-256'
})
let parsedHekoPublicKey = JSON.parse(rawHekoPublicKey)
let raw2IvString = process.env.PUBLIC_IV || "236,67,122,52,35,109,70,65,43,74,215,168,207,157,156,241" // "155,207,0,240,227,165,241,76,243,123,82,95,227,67,170,232"
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
let raw2IvString2 = process.env.PRIVATE_IV || "121,19,199,207,80,18,86,123,194,37,83,178,136,31,189,196" //"155,207,0,240,227,165,241,76,243,123,82,95,227,67,170,232"
let splitForHeko2 = raw2IvString2.split(",")
let ivArrayForHeko2 = new Uint8Array(splitForHeko2.length)
for (let i = 0; i < splitForHeko2.length; i++) {
    ivArrayForHeko2[i] = splitForHeko2[i]
}
subtle.importKey("jwk", parsedHekoPrivateKey, { name: "RSA-OAEP", padding: "RSA_PKCS1_PADDING", hash: { name: "SHA-256" } }, true, ["decrypt"]).then(kk => {
    parsedHekoPrivateKey = kk;
})

var policyLimit = 0
// setInterval(ClearThePolicyLimit, 70000)
// function ClearThePolicyLimit() {
//     console.log("Cleared the policy limit")
//     policyLimit = 0
//     for (let i = 0; i <= INITIAL_API_ADDRESS.length - 1; i++) {
//         INITIAL_API_ADDRESS[i].usedCounter = 0
//     }
// }
// setInterval(UpdateTheAddressTime, 1000)
// function UpdateTheAddressTime() {
//     // console.log("Updated The Address Time")
//     for (let i = 0; i <= INITIAL_API_ADDRESS.length - 1; i++) {
//         if ( INITIAL_API_ADDRESS[i].usedCounter > 0){
//             INITIAL_API_ADDRESS[i].startTime += 1
//             if(INITIAL_API_ADDRESS[i].startTime >= 60){
//                 INITIAL_API_ADDRESS[i].usedCounter = 0
//                 INITIAL_API_ADDRESS[i].startTime = 0
//             }
//         }
//     }
// }

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
            'Access-Control-Allow-Methods': `${req.method}`,
            'Content-Type': "text/json",
            'X-Powered-By': "OptionsServed.GoodJS",
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
            // let timeDelay = Math.floor((Math.random() * ARRAY_TIMERS.length))
            // timeDelay = ARRAY_TIMERS[timeDelay]
            // timeDelay = timeDelay + Math.floor(Math.random() * RANDOM_DELAY)
            // console.log("Time Delay: ", timeDelay)
            // setTimeout((substitutedReqObj, res, str) => { SendTheClientRequestToMainServer(substitutedReqObj, res, str) }, timeDelay, substitutedReqObj, res, str)


            CheckerForPolicyLimitOf20(substitutedReqObj, res, str)

            function CheckerForPolicyLimitOf20(substitutedReqObj, res, str) {
                let chosenObj = INITIAL_API_ADDRESS[policyLimit]
                let chosenAddress = chosenObj.address
                let chosenCounter = chosenObj.usedCounter
                // console.log(chosenAddress, chosenCounter, "Of the unreliable one")
                let foundOne = 1
                if (INITIAL_API_ADDRESS[policyLimit].usedCounter > 19) {
                    foundOne = 0
                    if (policyLimit != INITIAL_API_ADDRESS.length - 1) {
                        policyLimit++
                        chosenObj = INITIAL_API_ADDRESS[policyLimit]
                        if (INITIAL_API_ADDRESS[policyLimit].usedCounter < 19) {
                            foundOne = 1
                        }
                        // for (let i = policyLimit + 1; i <= INITIAL_API_ADDRESS.length - 1; i++) {
                        //     if (INITIAL_API_ADDRESS[i].usedCounter < 20) {
                        //         chosenObj = INITIAL_API_ADDRESS[i]
                        //         foundOne = 1
                        //         policyLimit++
                        //         break;
                        //     }
                        // }
                    } else {
                        policyLimit = 0;
                        chosenObj = INITIAL_API_ADDRESS[policyLimit]
                        if (INITIAL_API_ADDRESS[policyLimit].usedCounter < 19) {
                            foundOne = 1;
                        }
                        // for (let i = 0; i <= INITIAL_API_ADDRESS.length - 1; i++) {
                        //     if (INITIAL_API_ADDRESS[i].usedCounter < 20) {
                        //         chosenObj = INITIAL_API_ADDRESS[i]
                        //         foundOne = 1
                        //         policyLimit = i
                        //         break;
                        //     }
                        // }
                    }
                }
                if (foundOne == 1) {
                    // console.log("Inside it**************")
                    chosenAddress = INITIAL_API_ADDRESS[policyLimit]["address"]
                    chosenCounter = INITIAL_API_ADDRESS[policyLimit]["usedCounter"]
                    console.log(chosenAddress, chosenCounter)
                    INITIAL_API_ADDRESS[policyLimit].usedCounter = INITIAL_API_ADDRESS[policyLimit].usedCounter + 1
                    if (INITIAL_API_ADDRESS[policyLimit]["usedCounter"] == 1) {
                        setTimeout((policyLimit) => { INITIAL_API_ADDRESS[policyLimit].usedCounter = 0; console.log("Resetted the Add With ID: ", policyLimit) }, 61000, policyLimit)
                    }
                    SendTheClientRequestToMainServer(substitutedReqObj, res, str, INITIAL_API_ADDRESS[policyLimit]["address"])
                } else {
                    ErrorHandle("MAXIMUM POLICY LIMIT REACHED TIME TO UPGRADE", "1", substitutedReqObj, res)
                }
            }


            // function CheckerForPolicyLimitOf20(substitutedReqObj, res, str) {
            //     let random = Math.floor(Math.random() * 10)
            //     let chosenObj = INITIAL_API_ADDRESS[random]
            //     let chosenAddress = chosenObj.address
            //     let chosenCounter = chosenObj.usedCounter
            //     let foundOne = 1
            //     if (chosenCounter > 19) {
            //         foundOne = 0
            //         for (let i = 0; i <= INITIAL_API_ADDRESS.length - 1; i++) {
            //             if (INITIAL_API_ADDRESS[i].usedCounter < 20) {
            //                 chosenObj = INITIAL_API_ADDRESS[i]
            //                 foundOne = 1
            //                 break;
            //             }
            //         }
            //     }
            //     if (foundOne == 1) {
            //         chosenAddress = chosenObj.address
            //         chosenCounter = chosenObj.usedCounter
            //         chosenObj.usedCounter += chosenObj.usedCounter + 1
            //         SendTheClientRequestToMainServer(substitutedReqObj, res, str, chosenAddress)
            //     } else {
            //         ErrorHandle("MAXIMUM POLICY LIMIT REACHED TIME TO UPGRADE", "1", substitutedReqObj, res)
            //     }

            //     // if (policyLimit > 19 && policyLimit < 40) {
            //     //     policyLimit++
            //     //     SendTheClientRequestToMainServer(substitutedReqObj, res, str, INITIAL_API_ADDRESS[1])
            //     //     // setTimeout(CheckerForPolicyLimitOf20, 50, substitutedReqObj, res, str, INITIAL_API_ADDRESS[1])
            //     // } else if (policyLimit > 39) {
            //     //     if (policyLimit != 1000) {
            //     //         console.log("Can't send the request to server as the policy limit has been exceeded!")
            //     //     }
            //     //     policyLimit = 1000;
            //     //     setTimeout(CheckerForPolicyLimitOf20, 50, substitutedReqObj, res, str)
            //     // }
            //     // else {
            //     //     policyLimit++
            //     //     SendTheClientRequestToMainServer(substitutedReqObj, res, str, INITIAL_API_ADDRESS[0])
            //     // }
            // }
            // SendTheClientRequestToMainServer(substitutedReqObj, res, str)
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
        res.write("keyError")
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
function SendTheClientRequestToMainServer(originalRequest, originalResponse, body = "notDefined", initialApiAddress) {
    let requestToSendToMainServer;
    if (body == "notDefined") {
        requestToSendToMainServer = JSON.stringify(originalRequest) + "*^*^*^" + "notDefined"
    } else {
        requestToSendToMainServer = JSON.stringify(originalRequest) + "*^*^*^" + body
    }
    // console.log(body, originalRequest.headers)
    originalRequest = originalRequest
    EncryptForHeko(requestToSendToMainServer, callMe, originalRequest, originalResponse)
    function callMe(requestToSendToMainServer, err = "notDefined", originalRequest, originalResponse) {
        if (err != "notDefined") {
            console.log("Error At Heko Encrypt: ", err)
            ErrorHandle(err, "1", originalRequest, originalResponse)
            return;
        };
        let length = requestToSendToMainServer.length
        let API_ADDRESS_HOST = initialApiAddress.substring(8, initialApiAddress.length)
        // console.log(API_ADDRESS_HOST)
        let options = {
            host: `${API_ADDRESS_HOST}`,
            port: 80,
            path: "/",
            method: 'POST',
            headers: { "accept": "application/json", "content-length": length }
        }
        // console.log("Destructued Options Made : ", { ...options })
        let req = http.request({ ...options }, (response) => {
            // console.log("Inside it")
            CheckIt(response, originalRequest, originalResponse)
            async function CheckIt(response, originalRequest, originalResponse) {
                if (sendToClient == "1") {
                    console.log("Busy so setting a timeout for it.")
                    setTimeout(CheckIt, 0, response, originalRequest, originalResponse)
                } else {
                    sendToClient = "1";
                    SendToTheClient(response, originalRequest, originalResponse)
                }
            }
            function SendToTheClient(response, originalRequest, originalResponse) {
                // let originalRequest = originalRequest
                response.on('error', (error) => {
                    console.log('Error:: While Receiving The Request From -> ', INITIAL_API_ADDRESS, error);
                    originalResponse.end()
                })
                console.log("=======Handle Response======")
                let receivedBody = ''
                let i = 0;
                response.on('data', function (chunk) {
                    i++
                    // console.log(i, end = "")
                    receivedBody += chunk
                    // if (chunk.toString()[chunk.length - 1] == ">") {
                    // if (receivedBody.toString().length > 4000) {
                    // console.log("Received the last chunk : ", chunk.length)
                    // runAtEnd()
                    // }
                });

                let origin = originalRequest.headers.origin
                response.on('end', function () { //})
                    // function runAtEnd() {
                    // let originalRequest = originalRequest
                    try {
                        receivedBody = receivedBody.toString().substring(0, receivedBody.length - 1)
                        let splitMessages = receivedBody.split("^^**^^")
                        // console.log("split messages" , splitMessages.toString().substring(0 , 20)) // IMPORTANT THIS TOLD US ABOUT THE POLICY LIMIT OF 20 AS THAT PROXY WAS IMPLEMENTING A HTML RESPONSE TO NOTIFY US ABOUT HTE PLICY AND THUS WE FAILED TO PARSE OR SPLIT THE MESSAGES BELOW
                        receivedTopHeaders = splitMessages[1]
                        let newSplitMessages = receivedBody.split("**&&**")
                        receivedBottomBody = newSplitMessages[1]
                        // console.log("End Chunk At: ", i)
                        // console.log("Inside End ", receivedTopHeaders.toString().substring(0, 5), "Length : ", receivedBody.length)
                        // console.log("Inside End ", receivedBottomBody.toString().substring(0, 5))
                        DecryptForHeko(receivedTopHeaders, callMEE, originalRequest, originalResponse)
                        function callMEE(buffer, error = "", originalRequest, originalResponse) {
                            if (error != "") { console.log(error); return; }
                            // let originalRequest = originalRequest
                            let splittedMessages;
                            let receivedStatusCode;
                            let receivedHeaders;
                            try {
                                splittedMessages = buffer.split("^^**^^")
                                receivedStatusCode = splittedMessages[0].toString()
                                receivedHeaders = JSON.parse(splittedMessages[1])
                            } catch (error) {
                                ErrorHandle(err, "1", originalRequest, originalResponse)
                            }
                            DecryptForHeko(receivedBottomBody, callMeAgain, originalRequest, originalResponse)
                            function callMeAgain(buffer, error = "", originalRequest, originalResponse) {
                                if (error != "") { console.log(error); return; }
                                // console.log("=======Handle Response======")
                                // console.log("Origin: ", origin, "StatusCode: ", receivedStatusCode, "\n" + "Received Headers: ", JSON.stringify(receivedHeaders).substr(0, 5), "Received Body: ", receivedBody.substr(0, 20))
                                // console.log("Origin: ", origin, "StatusCode: ", receivedStatusCode, "\n" + "Received Headers: ", JSON.stringify(receivedHeaders).substring(0, 5))
                                console.log("Origin: ", origin, "StatusCode: ", receivedStatusCode, "\n" + "Sending Body: ", buffer.substring(0, 50))
                                originalResponse.writeHead(receivedStatusCode, {
                                    ...receivedHeaders,
                                    'Access-Control-Allow-Origin': `${origin}`,
                                    'Access-Control-Allow-Methods': `${originalRequest.method}`,
                                })
                                originalResponse.write(buffer)
                                originalResponse.end()
                                sendToClient = "0"
                            }
                        }
                    } catch (error) {
                        sendToClient = "0"
                        // response.destroy()
                        console.log("ERROR:: Usual Input Stream Error", error)
                        ErrorHandle("Request Method Not Supported", "1", req, originalResponse)
                        // originalResponse.end()
                        return;
                    }
                    // }
                })
            }
        }
        )
        req.on('error', (error) => {
            console.log('Error:: While Sending The Request To -> ', initialApiAddress, error);
            ErrorHandle("Request Method Not Supported", "1", req, originalResponse)
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


async function EncryptForHeko(message, callback, originalRequest, originalResponse) {
    message = message + "^^***^^^"
    message = StringToTypedArray(message)
    subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"])
        .then(key => {
            let iv = crypto.randomBytes(16);
            iv = new Uint8Array(iv)
            // console.log("First IV: ", iv)
            subtle.encrypt({ name: "AES-GCM", iv: iv }, key, message).then(encrypted => {
                subtle.exportKey("raw", key).then(exportedKey => {
                    let valueToEncrypt = iv.toString() + "^***^" + new Uint8Array(exportedKey).toString()
                    // console.log("These are the encryption data: ", valueToEncrypt)
                    subtle.encrypt({
                        name: "RSA-OAEP",
                        iv: ivArrayForHeko,
                    }, parsedHekoPublicKey, StringToTypedArray(valueToEncrypt)
                    ).then(function (encryptedKeys) {
                        encrypted = new Uint8Array(encrypted).toString()
                        encrypted = encrypted + "^***^" + new Uint8Array(encryptedKeys).toString()
                        callback(encrypted, "notDefined", originalRequest, originalResponse)
                    })
                })
            })
        })
}
async function DecryptForHeko(message, callback, originalRequest, originalResponse) {
    // console.log("Inside Decrypt ", message.toString().substring(0, 5))
    let messagess = message.split("^***^")
    let message0 = messagess[0]
    let message1 = messagess[1]
    let messageBody = RawArrayStringToTypedArray(message0)
    let encryptedData = RawArrayStringToTypedArray(message1)
    // console.log("Message: ", messageBody)
    // console.log("Encrypted Data: ", encryptedData.toString())
    subtle.decrypt({
        name: "RSA-OAEP",
        iv: ivArrayForHeko2,
    }, parsedHekoPrivateKey, encryptedData
    ).then(function (data) {
        data = ConverArrayBufferToString(new Uint8Array(data))
        // console.log("Data After RSA decryption: ", data)
        data = data.split("^***^")
        let iv = RawArrayStringToTypedArray(data[0])
        let rawKey = RawArrayStringToTypedArray(data[1])
        subtle.importKey("raw", rawKey, "AES-GCM", true, ["encrypt", "decrypt"]).then(key => {
            subtle.encrypt({ name: "AES-GCM", iv: iv }, key, messageBody).then(encrypted => {
                messageBody = ConverArrayBufferToString(new Uint8Array(encrypted))
                messageBody = messageBody.split("^^***^^^")[0]
                // callback(messageBody)
                callback(messageBody, "", originalRequest, originalResponse)
                // console.log("Decrypted Message: ", messageBody)
                // console.log("Splitted Decrypted Message", messageBody.split( "^^***^^^" )[0])
            })
        })
    })
}
