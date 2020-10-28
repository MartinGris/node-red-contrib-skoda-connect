const request = require('request');
const rp = require('request-promise');
const crypto = require("crypto");
const { Crypto } = require("@peculiar/webcrypto");
const uuidv4 = require("uuid/v4");
const traverse = require("traverse");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

jar = request.jar();

type = "Skoda";
country = "CZ";
clientId = "7f045eee-7003-4379-9968-9355ed2adb06%40apps_vw-dilab_com";
xclientId = "28cd30c6-dee7-4529-a0e6-b1e07ff90b79";
scope = "openid%20profile%20phone%20address%20cars%20email%20birthdate%20badge%20dealers%20driversLicense%20mbb";
redirect = "skodaconnect%3A%2F%2Foidc.login%2F";
xrequest = "cz.skodaauto.connect";
responseType = "code%20id_token";
xappversion = "3.2.6";
xappname = "cz.skodaauto.connect";
homeRegion = "https://msg.volkswagen.de";
config = new Object();


etags = {};

relogin = false;
personalData = {};
currentEmail = "";
currentPassword = "";
vehiclePropertyMapping = {
    "0x0203010001": { "statusName": "MAINTENANCE_INTERVAL_DISTANCE_TO_OIL_CHANGE", "unit_of_measurement": "km" },
    "0x0203010002": { "statusName": "MAINTENANCE_INTERVAL_TIME_TO_OIL_CHANGE", "unit_of_measurement": "days" },
    "0x0203010003": { "statusName": "MAINTENANCE_INTERVAL_DISTANCE_TO_INSPECTION", "unit_of_measurement": "km" },
    "0x0203010004": { "statusName": "MAINTENANCE_INTERVAL_TIME_TO_INSPECTION", "unit_of_measurement": "days" },
    "0x0203010005": { "statusName": "WARNING_OIL_CHANGE", "unit_of_measurement": "" },
    "0x0203010006": { "statusName": "MAINTENANCE_INTERVAL_ALARM_INSPECTION", "unit_of_measurement": "" },
    "0x0203010007": { "statusName": "MAINTENANCE_INTERVAL_MONTHLY_MILEAGE", "unit_of_measurement": "" },
    "0x02040C0001": { "statusName": "MAINTENANCE_INTERVAL_AD_BLUE_RANGE", "unit_of_measurement": "" },
    "0x0204040001": { "statusName": "OIL_LEVEL_AMOUNT_IN_LITERS", "unit_of_measurement": "l" },
    "0x0204040002": { "statusName": "OIL_LEVEL_MINIMUM_WARNING", "unit_of_measurement": "" },
    "0x0204040003": { "statusName": "OIL_LEVEL_DIPSTICK_PERCENTAGE", "unit_of_measurement": "%" },
    "0x0301010001": { "statusName": "LIGHT_STATUS", "unit_of_measurement": "" },
    "0x0301030005": { "statusName": "TOTAL_RANGE", "unit_of_measurement": "km" },
    "0x030103000A": { "statusName": "FUEL_LEVEL_IN_PERCENTAGE", "unit_of_measurement": "%" },
    "0x030103000D": { "statusName": "CNG_LEVEL_IN_PERCENTAGE", "unit_of_measurement": "%" },
    "0x0301040001": { "statusName": "LOCK_STATE_LEFT_FRONT_DOOR", "unit_of_measurement": "" },
    "0x0301040002": { "statusName": "OPEN_STATE_LEFT_FRONT_DOOR", "unit_of_measurement": "" },
    "0x0301040003": { "statusName": "SAFETY_STATE_LEFT_FRONT_DOOR", "unit_of_measurement": "" },
    "0x0301040004": { "statusName": "LOCK_STATE_LEFT_REAR_DOOR", "unit_of_measurement": "" },
    "0x0301040005": { "statusName": "OPEN_STATE_LEFT_REAR_DOOR", "unit_of_measurement": "" },
    "0x0301040006": { "statusName": "SAFETY_STATE_LEFT_REAR_DOOR", "unit_of_measurement": "" },
    "0x0301040007": { "statusName": "LOCK_STATE_RIGHT_FRONT_DOOR", "unit_of_measurement": "" },
    "0x0301040008": { "statusName": "OPEN_STATE_RIGHT_FRONT_DOOR", "unit_of_measurement": "" },
    "0x0301040009": { "statusName": "SAFETY_STATE_RIGHT_FRONT_DOOR", "unit_of_measurement": "" },
    "0x030104000A": { "statusName": "LOCK_STATE_RIGHT_REAR_DOOR", "unit_of_measurement": "" },
    "0x030104000B": { "statusName": "OPEN_STATE_RIGHT_REAR_DOOR", "unit_of_measurement": "" },
    "0x030104000C": { "statusName": "SAFETY_STATE_RIGHT_REAR_DOOR", "unit_of_measurement": "" },
    "0x030104000D": { "statusName": "LOCK_STATE_TRUNK_LID", "unit_of_measurement": "" },
    "0x030104000E": { "statusName": "OPEN_STATE_TRUNK_LID", "unit_of_measurement": "" },
    "0x030104000F": { "statusName": "SAFETY_STATE_TRUNK_LID", "unit_of_measurement": "" },
    "0x0301040010": { "statusName": "LOCK_STATE_HOOD", "unit_of_measurement": "" },
    "0x0301040011": { "statusName": "OPEN_STATE_HOOD", "unit_of_measurement": "" },
    "0x0301040012": { "statusName": "SAFETY_STATE_HOOD", "unit_of_measurement": "" },
    "0x0301050001": { "statusName": "STATE_LEFT_FRONT_WINDOW", "unit_of_measurement": "" },
    "0x0301050002": { "statusName": "POSITION_LEFT_FRONT_WINDOW", "unit_of_measurement": "" },
    "0x0301050003": { "statusName": "STATE_LEFT_REAR_WINDOW", "unit_of_measurement": "" },
    "0x0301050004": { "statusName": "POSITION_LEFT_REAR_WINDOW", "unit_of_measurement": "" },
    "0x0301050005": { "statusName": "STATE_RIGHT_FRONT_WINDOW", "unit_of_measurement": "" },
    "0x0301050006": { "statusName": "POSITION_RIGHT_FRONT_WINDOW", "unit_of_measurement": "" },
    "0x0301050007": { "statusName": "STATE_RIGHT_REAR_WINDOW", "unit_of_measurement": "" },
    "0x0301050008": { "statusName": "POSITION_RIGHT_REAR_WINDOW", "unit_of_measurement": "" },
    "0x0301050009": { "statusName": "STATE_CONVERTIBLE_TOP", "unit_of_measurement": "" },
    "0x030105000A": { "statusName": "POSITION_CONVERTIBLE_TOP", "unit_of_measurement": "" },
    "0x030105000B": { "statusName": "STATE_SUN_ROOF_MOTOR_COVER", "unit_of_measurement": "" },
    "0x030105000C": { "statusName": "POSITION_SUN_ROOF_MOTOR_COVER", "unit_of_measurement": "" },
    "0x030105000D": { "statusName": "STATE_SUN_ROOF_REAR_MOTOR_COVER_3", "unit_of_measurement": "" },
    "0x030105000E": { "statusName": "POSITION_SUN_ROOF_REAR_MOTOR_COVER_3", "unit_of_measurement": "" },
    "0x030105000F": { "statusName": "STATE_SERVICE_FLAP", "unit_of_measurement": "" },
    "0x0301050010": { "statusName": "POSITION_SERVICE_FLAP", "unit_of_measurement": "" },
    "0x0301050011": { "statusName": "STATE_SPOILER", "unit_of_measurement": "" },
    "0x0301050012": { "statusName": "POSITION_SPOILER", "unit_of_measurement": "" },
    "0x0101010001": { "statusName": "UTC_TIME_STATUS", "unit_of_measurement": "" },
    "0x0101010002": { "statusName": "KILOMETER_STATUS", "unit_of_measurement": "km" },
    "0x0301030006": { "statusName": "PRIMARY_RANGE", "unit_of_measurement": "km" },
    "0x0301030007": { "statusName": "PRIMARY_DRIVE", "unit_of_measurement": "" },
    "0x0301030008": { "statusName": "SECONDARY_RANGE", "unit_of_measurement": "km" },
    "0x0301030009": { "statusName": "SECONDARY_DRIVE", "unit_of_measurement": "" },
    "0x0301030002": { "statusName": "STATE_OF_CHARGE", "unit_of_measurement": "%" },
    "0x0301020001": { "statusName": "TEMPERATURE_OUTSIDE", "unit_of_measurement": "C" },
    "0x0301030001": { "statusName": "PARKING_BRAKE", "unit_of_measurement": "" },
    "0x0301060001": { "statusName": "TYRE_PRESSURE_LEFT_FRONT_CURRENT_VALUE", "unit_of_measurement": "" },
    "0x0301060002": { "statusName": "TYRE_PRESSURE_LEFT_FRONT_DESIRED_VALUE", "unit_of_measurement": "" },
    "0x0301060003": { "statusName": "TYRE_PRESSURE_LEFT_REAR_CURRENT_VALUE", "unit_of_measurement": "" },
    "0x0301060004": { "statusName": "TYRE_PRESSURE_LEFT_REAR_DESIRED_VALUE", "unit_of_measurement": "" },
    "0x0301060005": { "statusName": "TYRE_PRESSURE_RIGHT_FRONT_CURRENT_VALUE", "unit_of_measurement": "" },
    "0x0301060006": { "statusName": "TYRE_PRESSURE_RIGHT_FRONT_DESIRED_VALUE", "unit_of_measurement": "" },
    "0x0301060007": { "statusName": "TYRE_PRESSURE_RIGHT_REAR_CURRENT_VALUE", "unit_of_measurement": "" },
    "0x0301060008": { "statusName": "TYRE_PRESSURE_RIGHT_REAR_DESIRED_VALUE", "unit_of_measurement": "" },
    "0x0301060009": { "statusName": "TYRE_PRESSURE_SPARE_TYRE_CURRENT_VALUE", "unit_of_measurement": "" },
    "0x030106000A": { "statusName": "TYRE_PRESSURE_SPARE_TYRE_DESIRED_VALUE", "unit_of_measurement": "" },
    "0x030106000B": { "statusName": "TYRE_PRESSURE_LEFT_FRONT_TYRE_DIFFERENCE", "unit_of_measurement": "" },
    "0x030106000C": { "statusName": "TYRE_PRESSURE_LEFT_REAR_TYRE_DIFFERENCE", "unit_of_measurement": "" },
    "0x030106000D": { "statusName": "TYRE_PRESSURE_RIGHT_FRONT_TYRE_DIFFERENCE", "unit_of_measurement": "" },
    "0x030106000E": { "statusName": "TYRE_PRESSURE_RIGHT_REAR_TYRE_DIFFERENCE", "unit_of_measurement": "" },
    "0x030106000F": { "statusName": "TYRE_PRESSURE_SPARE_TYRE_DIFFERENCE", "unit_of_measurement": "" }
}

module.exports = function (RED) {
    function SkodaConnectNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.status({ fill: "grey", shape: "dot", text: "not logged in" });
        node.on('input', async function (msg, send, done) {

            var skodaResultObject = new Object();
           
            if(this.credentials.email != currentEmail || this.credentials.password != currentPassword || relogin){
                node.status({ fill: "yellow", shape: "ring", text: "logging in" });
                relogin = false;
                personalData = {};
                await login(this.credentials.email, this.credentials.password, node).then(async () => {
                    currentEmail = this.credentials.email;
                    currentPassword = this.credentials.password;
                    
                    await getPersonalData(node).then(function (value) {
                       personalData = value;
                    }).catch(([error,body]) => {
                        errorHandling(error, node, body);
                    });

                }).catch(([error,body]) =>{
                    errorHandling(error, node, body);
                });
           

            }

            skodaResultObject.personalData = personalData;
            node.status({ fill: "green", shape: "dot", text: "requesting data ..." });
               
            getVehicles(node).then(function (value) {
                vins = [];
                vins = value;

                getAllCarsData(vins, node).then(function (carsData) {
                    skodaResultObject.vehicles = carsData;
                    node.status({});
                    node.requestActive = false;
                    msg = { payload: skodaResultObject };
                    node.send(msg);
                }).catch(([error,body]) =>{
                    errorHandling(error, node, body);
                });

            }).catch(([error,body]) =>{
                errorHandling(error, node, body);
            });
         
           
            
        });
    }
    RED.nodes.registerType("skoda-connect", SkodaConnectNode, {
        credentials: {
            email: { type: "text" },
            password: { type: "password" }
        }
    });
}

async function errorHandling(error, node, body){    
    node.status({ fill: "red", shape: "dot", text: "error" })
    error &&  node.error(error) && console.log(error);

    if(body && IsJsonString(body)){
        body = JSON.parse(body);
    }
   
    if(body && body.error && body.error.description.indexOf("expired") !== -1) {
        node.error("Token is expired. try to get refresh token");
        console.log("Token is expired. try to get refresh token");
        node.error(body.error_description);
        console.log(body.error_description);
        
        refreshToken(node).catch(() => {
            node.error("Refresh Token was not successful");
            relogin = true;
        });
    }
   
}
function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function login(email, pass, node) {
    return new Promise((resolve, reject) => {


        jar = request.jar();
        const nonce = getNonce();
        const state = uuidv4();
        const [code_verifier, codeChallenge] = getCodeChallenge();

        var method = "GET";
        var form = {};
        var url =
            "https://identity.vwgroup.io/oidc/v1/authorize?client_id=" +
            clientId +
            "&scope=" +
            scope +
            "&response_type=" +
            responseType +
            "&redirect_uri=" +
            redirect +
            "&nonce=" +
            nonce +
            "&state=" +
            state;
        let getRequest = request(
            {
                method: method,
                url: url,
                headers: {
                    "User-Agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/74.0.3729.185 Mobile Safari/537.36",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
                    "Accept-Language": "en-US,en;q=0.9",
                    "Accept-Encoding": "gzip, deflate",
                    "x-requested-with": xrequest,
                    "upgrade-insecure-requests": 1,
                },
                jar: jar,
                form: form,
                followAllRedirects: true,
            },
            (err, resp, body) => {
                if (err || (resp && resp.statusCode >= 400)) {
                    node.error("Failed in first login step ");
                    node.error(err);
                    resp && node.error(resp.statusCode);
                    body && node.error(JSON.stringify(body));
                    console.log(err);
                    getTokens(getRequest, code_verifier, reject, resolve, node);
                    // reject();
                    // return;
                }

                try {


                    const dom = new JSDOM(body);
                    const form = {};
                    const formLogin = dom.window.document.querySelector("#emailPasswordForm");
                    if (formLogin) {
                        console.log("parseEmailForm");
                        for (const formElement of dom.window.document.querySelector("#emailPasswordForm").children) {
                            if (formElement.type === "hidden") {
                                form[formElement.name] = formElement.value;
                            }
                        }
                        form["email"] = email;
                    } else {
                        node.error("No Login Form found");
                        console.log(err);
                        return;
                    }
                    request.post(
                        {
                            url: "https://identity.vwgroup.io/signin-service/v1/" + clientId + "/login/identifier",
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded",
                                "User-Agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/74.0.3729.185 Mobile Safari/537.36",
                                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
                                "Accept-Language": "en-US,en;q=0.9",
                                "Accept-Encoding": "gzip, deflate",
                                "x-requested-with": xrequest,
                            },
                            form: form,
                            jar: jar,
                            followAllRedirects: true,
                        },
                        (err, resp, body) => {
                            if (err || (resp && resp.statusCode >= 400)) {
                                node.error("Failed to get login identifier");
                                resp && node.error(resp.statusCode);
                                body && node.error(JSON.stringify(body));
                                reject([err, body]);
                                return;
                            }
                            try {
                                const dom = new JSDOM(body);
                                const form = {};
                                const formLogin = dom.window.document.querySelector("#credentialsForm");
                                if (formLogin) {
                                    console.log("parsePasswordForm");
                                    for (const formElement of dom.window.document.querySelector("#credentialsForm").children) {
                                        if (formElement.type === "hidden") {
                                            form[formElement.name] = formElement.value;
                                        }
                                    }
                                    form["password"] = pass;
                                } else {
                                    node.error("No Login Form found. Please check your E-Mail in the app.");
                    
                                    reject();
                                    return;
                                }
                                request.post(
                                    {
                                        url: "https://identity.vwgroup.io/signin-service/v1/" + clientId + "/login/authenticate",
                                        headers: {
                                            "Content-Type": "application/x-www-form-urlencoded",
                                            "User-Agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/74.0.3729.185 Mobile Safari/537.36",
                                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
                                            "Accept-Language": "en-US,en;q=0.9",
                                            "Accept-Encoding": "gzip, deflate",
                                            "x-requested-with": xrequest,
                                        },
                                        form: form,
                                        jar: jar,
                                        followAllRedirects: false,
                                    },
                                    (err, resp, body) => {
                                        if (err || (resp && resp.statusCode >= 400)) {
                                            node.error("Failed to get login authenticate");
                                            resp && node.error(resp.statusCode);
                                            body && node.error(JSON.stringify(body));
                                            reject([err, body]);
                                            return;
                                        }

                                        try {
                                            // console.log(JSON.stringify(body));
                                            // console.log(JSON.stringify(resp.headers));
                                            if (resp.headers.location.split("&").length <= 1) {
                                                node.error("No userId found, please check your account");
                                                return;
                                            }
                                            config.userid = resp.headers.location.split("&")[2].split("=")[1];
                                            let getRequest = request.get(
                                                {
                                                    url: resp.headers.location,
                                                    headers: {
                                                        "User-Agent":
                                                            "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/74.0.3729.185 Mobile Safari/537.36",
                                                        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
                                                        "Accept-Language": "en-US,en;q=0.9",
                                                        "Accept-Encoding": "gzip, deflate",
                                                        "x-requested-with": xrequest,
                                                    },
                                                    jar: jar,
                                                    followAllRedirects: true,
                                                },
                                                (err, resp, body) => {
                                                    if (err) {
                                                        console.log(err);
                                                        getTokens(getRequest, code_verifier, reject, resolve, node);
                                                    } else {
                                                        console.log("No Token received visiting url and accept the permissions.");
                                                        const dom = new JSDOM(body);
                                                        let form = "";
                                                        for (const formElement of dom.window.document.querySelectorAll("input")) {
                                                            if (formElement.type === "hidden") {
                                                                form += formElement.name + "=" + formElement.value + "&";
                                                            }
                                                        }
                                                        getRequest = request.post(
                                                            {
                                                                url: getRequest.uri.href,
                                                                headers: {
                                                                    "Content-Type": "application/x-www-form-urlencoded",
                                                                    "User-Agent":
                                                                        "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/74.0.3729.185 Mobile Safari/537.36",
                                                                    "Accept":
                                                                        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
                                                                    "Accept-Language": "en-US,en;q=0.9",
                                                                    "Accept-Encoding": "gzip, deflate",
                                                                    "x-requested-with": xrequest,
                                                                    referer: getRequest.uri.href,
                                                                },
                                                                form: form,
                                                                jar: jar,
                                                                followAllRedirects: true,
                                                            },
                                                            (err, resp, body) => {
                                                                if (err) {
                                                                    getTokens(getRequest, code_verifier, reject, resolve, node);
                                                                } else {
                                                                    node.error("No Token received.");
                                                                    
                                                                }
                                                            }
                                                        );
                                                    }
                                                }
                                            );
                                        } catch (error) {
                                            node.error("Login was not successful, please check your login credentials and selected type");
                                            error.stack && node.error(error.stack);
                                            reject([error, null]);
                                        }
                                    }
                                );
                            } catch (error) {
                                reject([error, null]);
                            }
                        }
                    );
                } catch (error) {
                   reject([error, null]);
                }
            }
        );
    });
}

function getAllCarsData(vins, node) {

    return new Promise(async (resolve, reject) => {

        vehicles = [];
        for (i = 0; i < vins.length; i++) {

            vin = vins[i];
            currentCar = new Object();
            currentCar.vin = vin;
            
            await getHomeRegion(vin, node).then(async function () {
                await getVehicleData(vin, node).then(async function (value) {
                    vehicleDataValue = value;
                    currentCar.vehicleData = vehicleDataValue;

                    await getVehicleStatus(vin, node, "$homeregion/fs-car/bs/vsr/v1/$type/$country/vehicles/$vin/status").then(function (value) {
                        statusObject = value;

                        dataFields = [];
                        statusObject.StoredVehicleDataResponse.vehicleData.data.forEach(dataElement => {
            
                            dataElement["field"].forEach(dataField => {
                                dataFields.push(dataField);
                            });
            
                            dataFields.push(dataElement)
                        });
            
                        vehicleProperties = {};
                        Object.keys(vehiclePropertyMapping).forEach(stateId => {
                            var stateName = vehiclePropertyMapping[stateId]["statusName"];
            
                            var result = dataFields.filter(obj => {
                                return obj.id === stateId
                            })
                            if ((typeof (result[0]) !== 'undefined') && (result[0] !== null)) {
            
                                vehicleProperties[stateName] = new Object();
                                vehicleProperties[stateName].value = result[0].value;
                                vehicleProperties[stateName].unit = result[0].unit;
                            }

            
                        });
            
                        currentCar.vehicleStatus = vehicleProperties;
            
            
            
                        vehicles.push(currentCar);

                    }).then(async function (value) {

                        
                        await getVehicleStatus(vin, node, "$homeregion/fs-car/bs/cf/v1/$type/$country/vehicles/$vin/position").then(function (value) {

                            positionObject = value;
                            if (positionObject && positionObject.findCarResponse) {
                                currentCar.parking = positionObject.findCarResponse;
                            }

                        }).catch(([error,body]) =>{

                            reject([error, body]);
                            return;
                        });;
                        
                    }).catch(([error,body]) =>{

                        reject([error, body]);
                        return;
                    });

                }).catch(([error,body]) =>{
                    reject([error, body]);
                    return;
                });
                

            }).catch(([error,body]) =>{
                reject([error, body]);
                return;
            });
            
        }
        resolve(vehicles);
    });
}

function getCodeChallenge() {
    let hash = "";
    let result = "";
    while (hash === "" || hash.indexOf("+") !== -1 || hash.indexOf("/") !== -1 || hash.indexOf("=") !== -1 || result.indexOf("+") !== -1 || result.indexOf("/") !== -1) {
        const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        result = "";
        for (let i = 64; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        result = Buffer.from(result).toString("base64");
        result = result.replace(/=/g, "");
        hash = crypto.createHash("sha256").update(result).digest("base64");
        hash = hash.slice(0, hash.length - 1);
    }
    return [result, hash];
}

function replaceVarInUrl(url, vin) {
    return url
        .replace("/$vin/", "/" + vin + "/")
        .replace("$homeregion/", homeRegion + "/")
        .replace("/$type/", "/" + type + "/")
        .replace("/$country/", "/" + country + "/")
        .replace("/$tripType", "/" + config.tripType);
}
function getTokens(getRequest, code_verifier, reject, resolve, node) {
    let hash = "";
    if (getRequest.uri.hash) {
        hash = getRequest.uri.hash;
    } else {
        hash = getRequest.uri.query;
    }
    const hashArray = hash.split("&");
    let state;
    let jwtauth_code;
    let jwtaccess_token;
    let jwtid_token;
    hashArray.forEach((hash) => {
        const harray = hash.split("=");
        if (harray[0] === "#state" || harray[0] === "state") {
            state = harray[1];
        }
        if (harray[0] === "code") {
            jwtauth_code = harray[1];
        }
        if (harray[0] === "access_token") {
            jwtaccess_token = harray[1];
        }
        if (harray[0] === "id_token") {
            jwtid_token = harray[1];
        }
    });

    let body = "auth_code=" + jwtauth_code + "&id_token=" + jwtid_token + "&brand=skoda";
    let url = "https://tokenrefreshservice.apps.emea.vwapps.io/exchangeAuthCode";

    request.post(
        {
            url: url,
            headers: {
                // "user-agent": "okhttp/3.7.0",
                "X-App-version": xappversion,
                "content-type": "application/x-www-form-urlencoded",
                "x-app-name": xappname,
                "accept": "application/json",
            },
            body: body,
            jar: jar,
            followAllRedirects: false,
        },
        (err, resp, body) => {
            if (err || (resp && resp.statusCode >= 400)) {
                node.error("Failed to get token");
               
                resp && node.error(resp.statusCode);
                body &&  node.error(JSON.stringify(body));
                reject([err, body]);
            }
            try {
                const tokens = JSON.parse(body);
                getVWToken(tokens, jwtid_token, reject, resolve, node);
            } catch (error) {
                node.error(error);
                node.status({ fill: "red", shape: "dot", text: "error" })
                console.log(error);
            }
        }
    );
}
function getNonce() {
    const timestamp = Date.now();
    let hash = crypto.createHash("sha256").update(timestamp.toString()).digest("base64");
    hash = hash.slice(0, hash.length - 1);
    return hash;
}

function getVWToken(tokens, jwtid_token, reject, resolve, node) {
    config.atoken = tokens.access_token;
    config.rtoken = tokens.refresh_token;

    request.post(
        {
            url: "https://mbboauth-1d.prd.ece.vwg-connect.com/mbbcoauth/mobile/oauth2/v1/token",
            headers: {
                "User-Agent": "okhttp/3.7.0",
                "X-App-Version": xappversion,
                "X-App-Name": xappname,
                "X-Client-Id": xclientId,
                "Host": "mbboauth-1d.prd.ece.vwg-connect.com",
            },
            form: {
                grant_type: "id_token",
                token: jwtid_token,
                scope: "sc2:fal",
            },
            jar: jar,
            followAllRedirects: true,
        },
        (err, resp, body) => {
            if (err || (resp && resp.statusCode >= 400)) {
                resp && node.error(resp.statusCode);
                reject([err, body]);
            }
            try {
                const tokens = JSON.parse(body);
                config.skodaAccessToken = tokens.access_token;
                config.skodaRefreshToken = tokens.refresh_token;
                resolve();
            } catch (error) {
                reject([error, null]);
            }
        }
    );
}
function refreshToken(node) {

    let form = "";

    let url = "https://mbboauth-1d.prd.ece.vwg-connect.com/mbbcoauth/mobile/oauth2/v1/token";
    let rtoken = config.skodaRefreshToken;
    body = "grant_type=refresh_token&scope=sc2%3Afal&token=" + rtoken;

    return new Promise((resolve, reject) => {
        console.log("refreshToken");
        request.post(
            {
                url: url,
                headers: {
                    "user-agent": "okhttp/3.7.0",
                    "content-type": "application/x-www-form-urlencoded",
                    "X-App-version": xappversion,
                    "X-App-name": xappname,
                    "X-Client-Id": xclientId,
                    "accept": "application/json",
                },
                body: body,
                form: form,
                gzip: true,
                followAllRedirects: true,
            },
            (err, resp, body) => {
                if (err || (resp && resp.statusCode >= 400)) {
                    node.error("Failing to refresh token.");
                    console.log("Failing to refresh token.");

                    resp &&  node.error(resp.statusCode);
                    body && node.error(JSON.stringify(body));
                    reject([err, body]);
                    return;
                }
                try {
                    // console.log(body);
                    const tokens = JSON.parse(body);
                    if (tokens.error) {
                        node.error(JSON.stringify(body));
                        reject(tokens.error);
                        return;
                    }

                    config.skodaAccessToken = tokens.access_token;
                    if (tokens.refresh_token) {
                        config.skodaRefreshToken = tokens.refresh_token;
                    }

                    resolve();
                } catch (error) {
                    node.error("Failing to parse refresh token. The instance will do restart and try a relogin.");
                    body && node.error(JSON.stringify(body));
                    resp && node.error(resp.statusCode);
                    error.stack && node.error(error.stack);         
                     
                    reject([error, null]);
                }
            }
        );
    });
}

function getPersonalData(node) {
    return new Promise((resolve, reject) => {

        if(Object.keys(personalData).length > 0 ){
            resolve(personalData);
            return;
        }

        console.log("getPersonalData");
        request.get(
            {
                url: "https://customer-profile.apps.emea.vwapps.io/v1/customers/" + config.userid + "/personalData",
                headers: {
                    "user-agent": "okhttp/3.7.0",
                    "X-App-version": xappversion,
                    "X-App-name": xappname,
                    "authorization": "Bearer " + config.atoken,
                    "accept": "application/json",
                    "Host": "customer-profile.apps.emea.vwapps.io",
                },
                followAllRedirects: true,
            },
            (err, resp, body) => {
                if (err || (resp && resp.statusCode >= 400)) {
                    resp &&  node.error(resp.statusCode);
                    body && node.error(JSON.stringify(body));
                    reject([err, body]);
                    return;
                }
                try {
                    if (body.error) {
                        node.error(JSON.stringify(body.error));
                        console.log(body.error);
                        reject(body.error);
                    }
                    // console.log(body);
                    personalData = JSON.parse(body);
                    resolve(personalData);
                } catch (error) {
                   reject([error, null]);
                }
            }
        );
    });
}

function getVehicles(node) {
    return new Promise((resolve, reject) => {
        console.log("getVehicles");

        let url = replaceVarInUrl("https://msg.volkswagen.de/fs-car/usermanagement/users/v1/$type/$country/vehicles");
        let headers = {
            "User-Agent": "okhttp/3.7.0",
            "X-App-Version": xappversion,
            "X-App-Name": xappname,
            "Authorization": "Bearer " + config.skodaAccessToken,
            "Accept": "application/json",
        };
        request.get(
            {
                url: url,
                headers: headers,
                followAllRedirects: true,
                gzip: true,
                json: true,
            },
            (err, resp, body) => {
                if (err || (resp && resp.statusCode >= 400)) {
                    resp && node.error(resp.statusCode);
                    body && node.error(JSON.stringify(body));
                    reject([err, body]);
                    return;
                }
                try {
                    if (body.errorCode) {
                        node.error("getVehicles failed");
                        console.log("getVehicles failed");
                        node.error(JSON.stringify(body));
                        reject(body.errorCode);
                    }
                    // console.log(JSON.stringify(body));

                    const vehicles = body.userVehicles.vehicle;
                    vinArray = [];
                    vehicles.forEach((vehicle) => {
                        vinArray.push(vehicle);
                    });
                    resolve(vinArray);
                } catch (error) {
                    node.error("Not able to find vehicle, did you choose the correct type?.");
                    reject([error, null]);
                }
            }
        );
    });
}

function getHomeRegion(vin, node) {
    return new Promise((resolve, reject) => {

        console.log("getHomeRegion");
        request.get(
            {
                url: "https://mal-1a.prd.ece.vwg-connect.com/api/cs/vds/v1/vehicles/" + vin + "/homeRegion",
                headers: {
                    "user-agent": "okhttp/3.7.0",
                    "X-App-version": xappversion,
                    "X-App-name": xappname,
                    "authorization": "Bearer " + config.skodaAccessToken,
                    "accept": "application/json",
                },
                followAllRedirects: true,
                gzip: true,
                json: true,
            },
            (err, resp, body) => {
                if (err || (resp && resp.statusCode >= 400)) {
                    resp && node.error(resp.statusCode);
                    node.error("getHomeRegion failed");
                    body && node.error(JSON.stringify(body));
                    reject([err, body]);  
                    return;            
                }
                try {
                    if (body.error) {
                        node.error(JSON.stringify(body.error));
                        reject(body.error);
                        return;
                    }
                    // console.log(body);
                    if (body.homeRegion && body.homeRegion.baseUri && body.homeRegion.baseUri.content) {
                        if (body.homeRegion.baseUri.content !== "https://mal-1a.prd.ece.vwg-connect.com/api") {
                            homeRegion = body.homeRegion.baseUri.content.split("/api")[0].replace("mal-", "fal-");
                            // console.log("Set URL to: " + homeRegion);
                        }
                    }
                    resolve();
                } catch (error) {
                    reject([error, null]);
                }
            }
        );
    });
}


function getVehicleData(vin, node) {
    return new Promise((resolve, reject) => {
        console.log("getVehicleData");

        let accept = "application/vnd.vwg.mbb.vehicleDataDetail_v2_1_0+json, application/vnd.vwg.mbb.genericError_v1_0_2+json";

        let url = replaceVarInUrl("https://msg.volkswagen.de/fs-car/promoter/portfolio/v1/$type/$country/vehicle/$vin/carportdata", vin);
        accept = "application/json";

        let atoken = config.skodaAccessToken;

        request.get(
            {
                url: url,
                headers: {
                    "User-Agent": "okhttp/3.7.0",
                    "X-App-Version": xappversion,
                    "X-App-Name": xappname,
                    "X-Market": "de_DE",
                    "Authorization": "Bearer " + atoken,
                    "If-None-Match": etags[url] || "",
                    "Accept": accept,
                },
                followAllRedirects: true,
                gzip: true,
                json: true,
            },
            (err, resp, body) => {
                if (err || (resp && resp.statusCode >= 400)) {
                    node.error("getVehicleData failed");
                    console.log("getVehicleData failed");
                    resp &&  node.error(resp.statusCode);
                    body && node.error(JSON.stringify(body));
                    reject([err, body]);
                }
                try {
                    // console.log(JSON.stringify(body));
                    var result = body;
                    resolve(result);

                } catch (error) {
                    reject([error,null]);
                }
            }
        );
    });
}

function getVehicleStatus(vin, node, url) {
    return new Promise((resolve, reject) => {

        console.log("getVehicleStatus");

        url = replaceVarInUrl(url, vin);
        accept = "application/json"
        request.get(
            {
                url: url,
                headers: {
                    "User-Agent": "okhttp/3.7.0",
                    "X-App-Version": xappversion,
                    "X-App-Name": xappname,
                    "Authorization": "Bearer " + config.skodaAccessToken,
                    "Accept-charset": "UTF-8",
                    "Accept": accept,
                },
                followAllRedirects: true,
                gzip: true,
                json: true,
            },
            (err, resp, body) => {
                if (err || (resp && resp.statusCode >= 400)) {
    
                    resp &&  node.error(resp.statusCode);
                    body && node.error(JSON.stringify(body));
                    reject([err, body]);
                    return;                   
                }
                try {
                    // console.log(JSON.stringify(body));
                    if (resp) {
                        etags[url] = resp.headers.etag;
                        if (resp.statusCode === 304) {
                            console.log("304 No values updated");
                            reject([resp.statusCode, null]);
                            return;
                        }
                    }

                    resolve(body);

                } catch (error) {
                    node.error("error while reading getVehicleStatus result");
                    reject([error, null]);
                }
            }
        );
    });
}

