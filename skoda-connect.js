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

loggedIn = false;
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
        node.on('input', function (msg, send, done) {

            if (node.requestActive) {
                node.status({ fill: "yellow", shape: "dot", text: "requesting..." });
                return;
            }


            node.requestActive = true;

            var skodaResultObject = new Object();
            node.status({ fill: "yellow", shape: "ring", text: "logging in" });
            login(this.credentials.email, this.credentials.password, node)
                .then(() => {

                    loggedIn = true;
                    node.status({ fill: "green", shape: "dot", text: "requesting data ..." });

                    getPersonalData(node).then(function (value) {
                        skodaResultObject.personalData = value;

                        getVehicles(node).then(function (value) {
                            vins = [];
                            vins = value;

                            getAllCarsData(vins).then(function (carsData) {
                                skodaResultObject.vehicles = carsData;
                                node.status({});
                                node.requestActive = false;
                                msg = { payload: skodaResultObject };
                                node.send(msg);

                            });


                        });

                    });


                }).finally(() => {
                    node.requestActive = false;
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



function login(email, pass, node) {
    return new Promise((resolve, reject) => {

        if (loggedIn) {
            refreshToken(node);
            resolve();
            return;
        }
        const nonce = getNonce();
        const state = uuidv4();
        const [code_verifier, codeChallenge] = getCodeChallenge();

        let method = "GET";
        let form = {};
        let url =
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
        request(
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
                    err && node.error(err);
                    resp && node.error(resp.statusCode);
                    body && node.error(JSON.stringify(body));
                    console.log(err);
                    return;
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
                        console.log(body);
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
                                err && node.error(err);
                                resp && node.error(resp.statusCode);
                                body && node.error(JSON.stringify(body));
                                console.log(err);
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
                                    console.log(body);
                                    console.log(err);
                                    node.status({ fill: "red", shape: "dot", text: "error" })
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
                                            err && node.error(err);
                                            resp && node.error(resp.statusCode);
                                            body && node.error(JSON.stringify(body));
                                            console.log(err);
                                            return;
                                        }

                                        try {
                                            console.log(JSON.stringify(body));
                                            console.log(JSON.stringify(resp.headers));
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
                                                                    try {
                                                                        console.log(body);
                                                                    } catch (error) {
                                                                        node.error(error);
                                                                        console.log(err);
                                                                    }
                                                                }
                                                            }
                                                        );
                                                    }
                                                }
                                            );
                                        } catch (error) {
                                            node.error("Login was not successful, please check your login credentials and selected type");
                                            err && node.error(err);
                                            node.error(error);
                                            node.error(error.stack);
                                            node.status({ fill: "red", shape: "dot", text: "error" })
                                            console.log(err);
                                        }
                                    }
                                );
                            } catch (error) {
                                node.error(error);
                                node.status({ fill: "red", shape: "dot", text: "error" })
                                console.log(err);
                            }
                        }
                    );
                } catch (error) {
                    node.error(error);
                    node.status({ fill: "red", shape: "dot", text: "error" })
                    console.log(err);
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

            await getHomeRegion(vin, node);
            vehicleDataValue = await getVehicleData(vin, node);
            currentCar.vehicleData = vehicleDataValue;
            statusObject = await getVehicleStatus(vin, node);

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
    // const state = hashArray[0].substring(hashArray[0].indexOf("=") + 1);
    // const jwtauth_code = hashArray[1].substring(hashArray[1].indexOf("=") + 1);
    // const jwtaccess_token = hashArray[2].substring(hashArray[2].indexOf("=") + 1);
    // const jwtid_token = hashArray[5].substring(hashArray[5].indexOf("=") + 1);
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
                err && node.error(err);
                resp && node.error(resp.statusCode);
                body && node.error(JSON.stringify(body));
                console.log(err);
                node.status({ fill: "red", shape: "dot", text: "error" })
                return;
            }
            try {
                const tokens = JSON.parse(body);

                getVWToken(tokens, jwtid_token, reject, resolve, node);
            } catch (error) {
                node.error(error);
                node.status({ fill: "red", shape: "dot", text: "error" })
                console.log(err);
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
    refreshTokenInterval = setInterval(() => {
        refreshToken().catch(() => { });
    }, 0.9 * 60 * 60 * 1000); // 0.9hours

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
                err && node.error(err);
                resp && node.error(resp.statusCode);
                console.log(err);
                node.status({ fill: "red", shape: "dot", text: "error" })
                return;
            }
            try {
                const tokens = JSON.parse(body);
                config.vwatoken = tokens.access_token;
                config.vwrtoken = tokens.refresh_token;
                vwrefreshTokenInterval = setInterval(() => {
                    refreshToken(node).catch(() => { });
                }, 0.9 * 60 * 60 * 1000); //0.9hours
                resolve();
            } catch (error) {
                node.error(error);
                node.status({ fill: "red", shape: "dot", text: "error" })
                console.log(err);
            }
        }
    );
}
function refreshToken(node) {
    let url = "https://tokenrefreshservice.apps.emea.vwapps.io/refreshTokens";
    let rtoken = config.rtoken;
    let body = "refresh_token=" + rtoken;
    let form = "";

    url = "https://mbboauth-1d.prd.ece.vwg-connect.com/mbbcoauth/mobile/oauth2/v1/token";
    rtoken = config.vwrtoken;
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
                    err && node.error(err);
                    resp && node.error(resp.statusCode);
                    console.log(err);
                    node.status({ fill: "red", shape: "dot", text: "error" })
                    return;
                }
                try {
                    console.log(body);
                    const tokens = JSON.parse(body);
                    if (tokens.error) {
                        node.error(JSON.stringify(body));
                        refreshTokenTimeout = setTimeout(() => {
                            refreshToken(isVw).catch(() => {
                                node.error("refresh token failed");
                            });
                        }, 5 * 60 * 1000);
                        console.log(err);
                        return;
                    }

                    config.vwatoken = tokens.access_token;
                    if (tokens.refresh_token) {
                        config.vwrtoken = tokens.refresh_token;
                    }

                    resolve();
                } catch (error) {
                    node.error("Failing to parse refresh token. The instance will do restart and try a relogin.");
                    node.error(error);
                    node.error(JSON.stringify(body));
                    node.error(resp.statusCode);
                    node.error(error.stack);
                    node.status({ fill: "red", shape: "dot", text: "error" })
                }
            }
        );
    });
}

function getPersonalData(node) {
    return new Promise((resolve, reject) => {
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
                    err && node.error(err);
                    resp && node.error(resp.statusCode);
                    console.log(err);
                    return;
                }
                try {
                    if (body.error) {
                        node.error(JSON.stringify(body.error));
                        console.log(err);
                        node.status({ fill: "red", shape: "dot", text: "error" })
                    }
                    console.log(body);
                    var data = JSON.parse(body);
                    resolve(data);
                } catch (error) {
                    node.error(error);
                    node.status({ fill: "red", shape: "dot", text: "error" })
                    console.log(err);
                }
            }
        );
    });
}

function getVehicles(node) {
    return new Promise((resolve, reject) => {
        let url = replaceVarInUrl("https://msg.volkswagen.de/fs-car/usermanagement/users/v1/$type/$country/vehicles");
        let headers = {
            "User-Agent": "okhttp/3.7.0",
            "X-App-Version": xappversion,
            "X-App-Name": xappname,
            "Authorization": "Bearer " + config.vwatoken,
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
                    err && node.error(err);
                    resp && node.error(resp.statusCode);
                    console.log(err);
                }
                try {
                    if (body.errorCode) {
                        node.error(JSON.stringify(body));
                        console.log(err);
                        return;
                    }
                    console.log(JSON.stringify(body));

                    const vehicles = body.userVehicles.vehicle;
                    vinArray = [];
                    vehicles.forEach((vehicle) => {
                        vinArray.push(vehicle);
                    });
                    resolve(vinArray);
                } catch (error) {
                    node.error(error);
                    node.error(error.stack);
                    node.error("Not able to find vehicle, did you choose the correct type?.");
                    node.status({ fill: "red", shape: "dot", text: "error" })
                    console.log(err);
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
                    "authorization": "Bearer " + config.vwatoken,
                    "accept": "application/json",
                },
                followAllRedirects: true,
                gzip: true,
                json: true,
            },
            (err, resp, body) => {
                if (err || (resp && resp.statusCode >= 400)) {
                    err && node.error(err);
                    resp && node.error(resp.statusCode);
                    console.log(err);
                    resolve();
                    return;
                }
                try {
                    if (body.error) {
                        node.error(JSON.stringify(body.error));
                        console.log(err);
                        node.status({ fill: "red", shape: "dot", text: "error" })
                    }
                    console.log(body);
                    if (body.homeRegion && body.homeRegion.baseUri && body.homeRegion.baseUri.content) {
                        if (body.homeRegion.baseUri.content !== "https://mal-1a.prd.ece.vwg-connect.com/api") {
                            homeRegion = body.homeRegion.baseUri.content.split("/api")[0].replace("mal-", "fal-");
                            console.log("Set URL to: " + homeRegion);
                        }
                    }
                    resolve();
                } catch (error) {
                    node.error(error);
                    console.log(err);
                    node.status({ fill: "red", shape: "dot", text: "error" })
                }
            }
        );
    });
}


function getVehicleData(vin, node) {
    return new Promise((resolve, reject) => {
        let accept = "application/vnd.vwg.mbb.vehicleDataDetail_v2_1_0+json, application/vnd.vwg.mbb.genericError_v1_0_2+json";
        let url = replaceVarInUrl("$homeregion/fs-car/vehicleMgmt/vehicledata/v2/$type/$country/vehicles/$vin/", vin);

        url = replaceVarInUrl("https://msg.volkswagen.de/fs-car/promoter/portfolio/v1/$type/$country/vehicle/$vin/carportdata", vin);
        accept = "application/json";

        let atoken = config.vwatoken;

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
                    err && node.error(err);
                    resp && node.error(resp.statusCode);
                    body && node.error(JSON.stringify(body));
                    console.log(err);
                    resolve();
                    return;
                }
                try {
                    console.log(JSON.stringify(body));
                    var result = body;
                    resolve(result);

                } catch (error) {
                    node.error(error);
                    console.log(err);
                    node.status({ fill: "red", shape: "dot", text: "error" })
                }
            }
        );
    });
}

function getVehicleStatus(vin, node) {
    return new Promise((resolve, reject) => {
        url = replaceVarInUrl("$homeregion/fs-car/bs/vsr/v1/$type/$country/vehicles/$vin/status", vin);
        accept = "application/json"
        request.get(
            {
                url: url,
                headers: {
                    "User-Agent": "okhttp/3.7.0",
                    "X-App-Version": xappversion,
                    "X-App-Name": xappname,
                    "Authorization": "Bearer " + config.vwatoken,
                    "Accept-charset": "UTF-8",
                    "Accept": accept,
                },
                followAllRedirects: true,
                gzip: true,
                json: true,
            },
            (err, resp, body) => {
                if (err || (resp && resp.statusCode >= 400)) {
                    if ((resp && resp.statusCode === 403) || (resp && resp.statusCode === 502) || (resp && resp.statusCode === 406) || (resp && resp.statusCode === 500)) {
                        body && console.log(JSON.stringify(body));
                        return;
                    } else {
                        err && node.error(err);
                        resp && node.error(resp.statusCode);
                        body && node.error(JSON.stringify(body));
                        console.log(err);
                        return;
                    }
                }
                try {
                    console.log(JSON.stringify(body));
                    if (resp) {
                        etags[url] = resp.headers.etag;
                        if (resp.statusCode === 304) {
                            console.log("304 No values updated");
                            return;
                        }
                    }


                    if (body === undefined || body === "" || body.error) {
                        if (body && body.error && body.error.description.indexOf("Token expired") !== -1) {
                            node.error("Error response try to refresh token " + path);
                            node.error(JSON.stringify(body));
                            refreshToken(node).catch(() => {
                                node.error("Refresh Token was not successful");
                            });
                        } else {
                            console.log("Not able to get " + path);
                        }
                        console.log(body);
                        console.log(err);
                        return;
                    }

                    resolve(body);


                } catch (error) {
                    node.error(error);
                    node.error(error.stack);
                    console.log(err);
                    node.status({ fill: "red", shape: "dot", text: "error" })
                }
            }
        );
    });
}
