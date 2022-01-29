const request = require('request');
const rp = require('request-promise');
const crypto = require("crypto");
const { Crypto } = require("@peculiar/webcrypto");
const uuidv4 = require("uuid/v4");
const traverse = require("traverse");
const jsdom = require("jsdom");
const { Console } = require('console');
const { resolve } = require('path');
const { JSDOM } = jsdom;


class SkodaLibrary{
    constructor(node, config){
        this.node = node;
        this.config = config;
        this.jar = request.jar();

        this.type = "Skoda";
        this.country = "CZ";
        this.clientId = "f9a2359a-b776-46d9-bd0c-db1904343117@apps_vw-dilab_com";
        this.xclientId = "afb0473b-6d82-42b8-bfea-cead338c46ef";
        this.scope = "openid mbb profile";
        this.redirect = "skodaconnect://oidc.login/";
        this.xrequest = "cz.skodaauto.connect";
        this.responseType = "code%20id_token";
        this.xappversion = "3.2.6";
        this.xappname = "cz.skodaauto.connect";
        this.homeRegion = "https://msg.volkswagen.de";
       
        this.userAgent = "nodered";
        
        this.etags = {};
        
        this.relogin = false;
        this.currentEmail = "";
        this.currentPassword = "";
    }

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
    

    async connect(credentials){

        if(credentials.email != this.currentEmail || credentials.password != this.currentPassword || this.relogin){
            this.node.status({ fill: "yellow", shape: "ring", text: "logging in" });
            this.relogin = false;
            await this.login(credentials.email, credentials.password).then(async () => {
                this.currentEmail = credentials.email;
                this.currentPassword = credentials.password;
                
                await this.getPersonalData().then(async (value) => {
                    this.personalData = value;
                }).catch(([error,body]) => {
                    this.errorHandling(error, body);
                });

            }).catch(([error,body]) =>{
                this.errorHandling(error, body);
            });
        }

    }

    
    async errorHandling(error,  body){    

        if(body && this.IsJsonString(body)){
            body = JSON.parse(body);
        }
       //known token expired error. refresh token
        if(body && body.error && body.error.description.indexOf("expired") !== -1 ){
            this.node.log("Token is expired. try to get refresh token");
            this.node.log(body.error.description);
            
            this.refreshToken().then(()=>{
                this.node.log("Token refresh was successful");
            })
            .catch(() => {
                this.node.error("Refresh Token was not successful. Try to relogin");
                this.relogin = true;
            });
        }
        //unknown errors will be logged to node red debug output
        else{
            this.node.status({ fill: "red", shape: "dot", text: "error" })
            error &&  this.node.error(error) && console.log(error);
        
            error && error.stack && console.log(error.stack);
    
        }
       
    }
    IsJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
    
    login(email, pass) {
        return new Promise((resolve, reject) => {
    
    
            this.jar = request.jar();
            const nonce = this.getNonce();
            const state = uuidv4();
            const [code_verifier, codeChallenge] = this.getCodeChallenge();
    
            var method = "GET";
            var form = {};
            var url =
                "https://identity.vwgroup.io/oidc/v1/authorize?client_id=" +
                this.clientId +
                "&scope=" +
                this.scope +
                "&response_type=" +
                this.responseType +
                "&redirect_uri=" +
                this.redirect +
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
                        "x-requested-with": this.xrequest,
                        "upgrade-insecure-requests": 1,
                    },
                    jar: this.jar,
                    form: form,
                    followAllRedirects: true,
                },
                (err, resp, body) => {
                    if (err || (resp && resp.statusCode >= 400)) {
                        this.node.error("Failed in first login step ");
                        this.node.error(err);
                        resp && this.node.error(resp.statusCode);
                        body && this.node.error(JSON.stringify(body));

                        this.getTokens(getRequest, code_verifier, reject, resolve);
                        // reject();
                        // return;
                    }
    
                    try {
    
    
                        const dom = new JSDOM(body);
                        let form = {};
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
                            this.node.error("No Login Form found");
                            return;
                        }
                        request.post(
                            {
                                url: "https://identity.vwgroup.io/signin-service/v1/" + this.clientId + "/login/identifier",
                                headers: {
                                    "Content-Type": "application/x-www-form-urlencoded",
                                    "User-Agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/74.0.3729.185 Mobile Safari/537.36",
                                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
                                    "Accept-Language": "en-US,en;q=0.9",
                                    "Accept-Encoding": "gzip, deflate",
                                    "x-requested-with": this.xrequest,
                                },
                                form: form,
                                jar: this.jar,
                                gzip: true,
                                followAllRedirects: true,
                            },
                            (err, resp, body) => {
                                if (err || (resp && resp.statusCode >= 400)) {
                                    this.node.error("Failed to get login identifier");
                                    resp && this.node.error(resp.statusCode);
                                    body && this.node.error(JSON.stringify(body));
                                    reject([err, body]);
                                    return;
                                }
                                try {
                                    
                                    if (body.indexOf("emailPasswordForm") !== -1) {
                                        console.log("emailPasswordForm");

                                        form = {
                                            _csrf: body.split("csrf_token: '")[1].split("'")[0],
                                            email: email,
                                            password: pass,
                                            hmac: body.split('"hmac":"')[1].split('"')[0],
                                            relayState: body.split('"relayState":"')[1].split('"')[0],
                                        };
                                    } else {
                                        this.node.error("No Login Form found. Please check your E-Mail in the app.");
                                        //console.log(JSON.stringify(body));
                                        reject();
                                        return;
                                    }

                                    request.post(
                                        {
                                            url: "https://identity.vwgroup.io/signin-service/v1/" + this.clientId + "/login/authenticate",
                                            headers: {
                                                "Content-Type": "application/x-www-form-urlencoded",
                                                "User-Agent": this.userAgent,
                                                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
                                                "Accept-Language": "en-US,en;q=0.9",
                                                "Accept-Encoding": "gzip, deflate",
                                                "x-requested-with": this.xrequest,
                                            },
                                            form: form,
                                            jar: this.jar,
                                            gzip: true,
                                            followAllRedirects: false,
                                        },
                                        (err, resp, body) => {
                                            if (err || (resp && resp.statusCode >= 400)) {
                                                this.node.error("Failed to get login authenticate");
                                                resp && this.node.error(resp.statusCode);
                                                body && this.node.error(JSON.stringify(body));
                                                reject([err, body]);
                                                return;
                                            }
    
                                            try {
                                                // console.log(JSON.stringify(body));
                                                // console.log(JSON.stringify(resp.headers));
                                                if (resp.headers.location.split("&").length <= 1) {
                                                    this.node.error("No userId found, please check your account");
                                                    return;
                                                }
                                                this.config.userid = resp.headers.location.split("&")[2].split("=")[1];
                                                if (!this.stringIsAValidUrl(resp.headers.location)) {
                                                    if (resp.headers.location.indexOf("&error=") !== -1) {
                                                        const location = resp.headers.location;
                                                        this.node.error("Error: " + location.substring(location.indexOf("error="), location.length - 1));
                                                    } else {
                                                        this.node.error("No valid login url, please download the log and visit:");
                                                        this.node.error("http://" + resp.request.host + resp.headers.location);
                                                    }
                                                    reject();
                                                    return;
                                                }
                                                let getRequest = request.get(
                                                    {
                                                        url: resp.headers.location,
                                                        headers: {
                                                            "User-Agent": this.userAgent,
                                                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
                                                            "Accept-Language": "en-US,en;q=0.9",
                                                            "Accept-Encoding": "gzip, deflate",
                                                            "x-requested-with": this.xrequest,
                                                        },
                                                        jar: this.jar,
                                                        gzip: true,
                                                        followAllRedirects: true,
                                                    },
                                                    (err, resp, body) => {
                                                        if (err) {
                                                            console.log(err);
                                                            this.getTokens(getRequest, code_verifier, reject, resolve);
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
                                                                        "User-Agent": this.userAgent,
                                                                        "Accept":
                                                                            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
                                                                        "Accept-Language": "en-US,en;q=0.9",
                                                                        "Accept-Encoding": "gzip, deflate",
                                                                        "x-requested-with": this.xrequest,
                                                                        referer: getRequest.uri.href,
                                                                    },
                                                                    form: form,
                                                                    jar: this.jar,
                                                                    gzip: true,
                                                                    followAllRedirects: true,
                                                                },
                                                                (err, resp, body) => {
                                                                    if (err) {
                                                                        getTokens(getRequest, code_verifier, reject, resolve);
                                                                    } else {
                                                                        this.node.error("No Token received.");
                                                                        
                                                                    }
                                                                }
                                                            );
                                                        }
                                                    }
                                                );
                                            } catch (error) {
                                                this.node.error("Login was not successful, please check your login credentials and selected type");
                                                error.stack && this.node.error(error.stack);
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

    
    setClimater( msg){

        return new Promise(async (resolve, reject) => {

            var body = "";
            if (msg.payload == false) {
                body = '{action: {"type": "stopClimatisation"}}';
            }
            else if(msg.payload == true){
                body = '{action: {"type": "startClimatisation"}}';
            }
            else{
                this.errorHandling("Wrong payload '" + msg.payload + "'", null);
                return;
            }
        
            var url = "$homeregion/fs-car/bs/climatisation/v1/$type/$country/vehicles/$vin/climater/actions";
            var contentType = "application/vnd.vwg.mbb.ClimaterAction_v1_0_1+json";
        
            await this.getHomeRegion(msg.vin).then((value) => {
                this.setVehicleStatus(msg.vin,  url, body, contentType).then((value) =>  {
                    resolve(JSON.parse(value));
                    return;
                }).catch(([error,body]) =>{
                    reject([error, body]);
                    return;
                });
            }).catch(([error,body]) =>{
                reject([error, body]);
                return;
            });


        });

      
    }
    
    setClimaterTemperature( msg){

        return new Promise(async (resolve, reject) => {

            try {
                this.node.status({ fill: "green", shape: "dot", text: "sending data" });
                var body = "";
                var temperatureDeziKelvin = (msg.payload + 273) * 10;
            
                var  body = '{"action" : {"type": "setSettings","settings": {"targetTemperature": "'+temperatureDeziKelvin+'","climatisationWithoutHVpower": "true", "heaterSource": "electric" } } }'
                var contentType = "application/vnd.vwg.mbb.ClimaterAction_v1_0_1+json";
                var url = "$homeregion/fs-car/bs/climatisation/v1/$type/$country/vehicles/$vin/climater/actions";
                await this.getHomeRegion(msg.vin).then((value) => {
                    this.setVehicleStatus(msg.vin,  url, body, contentType).then((value) => {
                        resolve(JSON.parse(value));
                        return;
                    }).catch(([error,body]) =>{
                        reject([error, body]);
                        return;
                    });
                }).catch(([error,body]) =>{
                    reject([error, body]);
                    return;
                });
             }
             catch (e) {
                this.errorHandling(e);
                reject(e);
             }
        });
        
    }

    getAllCarsData(vins){
        return new Promise(async(resolve, reject) => {
            var carsdata;
            if(this.config.apiType == "enyaq"){
                await this.getEnyacData(vins).then((value) => {
                    carsdata = value;
                });
            }
            else{
                await this.getDefaultSkodaData(vins).then((value) => {
                    carsdata = value;
                });
               
            }         
            
            resolve(carsdata);
        });
        
    }
    
    getDefaultSkodaData(vins) {
    
        return new Promise(async (resolve, reject) => {
    
            var vehicles = [];
            for (var i = 0; i < vins.length; i++) {
    
                var vin = vins[i];
                var currentCar = new Object();
                currentCar.vin = vin;
                
                await this.getHomeRegion(vin).then(async () => {
                    await this.getVehicleData(vin).then(async (value) => {
                        var vehicleDataValue = value;
                        currentCar.vehicleData = vehicleDataValue;
    
                        await this.getVehicleStatus(vin,  "$homeregion/fs-car/bs/vsr/v1/$type/$country/vehicles/$vin/status").then((value) => {
                            var statusObject = value;
                            
                            var dataFields = [];
                            statusObject.StoredVehicleDataResponse.vehicleData.data.forEach(dataElement => {
                
                                dataElement["field"].forEach(dataField => {
                                    dataFields.push(dataField);
                                });
                
                                dataFields.push(dataElement)
                            });
                
                            var vehicleProperties = {};
                            Object.keys(this.vehiclePropertyMapping).forEach(stateId => {
                                var stateName = this.vehiclePropertyMapping[stateId]["statusName"];
                
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
    
                        }).then(async (value) => {
    
                            if(this.config.queryParking){
                                await this.getVehicleStatus(vin,  "$homeregion/fs-car/bs/cf/v1/$type/$country/vehicles/$vin/position").then((value) => {
    
                                    var positionObject = value;
                                    if (positionObject && positionObject.findCarResponse) {
                                        currentCar.parking = positionObject.findCarResponse;
                                    }
        
                                }).catch(([error,body]) =>{
        
                                    reject([error, body]);
                                    return;
                                });
                            }
                            
                            
                        }).then(async (value) => {
    
                            if(this.config.queryClimater){
                                await this.getVehicleStatus(vin,  "$homeregion/fs-car/bs/climatisation/v1/$type/$country/vehicles/$vin/climater").then((value) => {
    
                                    var climaterObject = value;
                                    if (climaterObject && climaterObject.climater) {
                                        currentCar.climater = climaterObject.climater;
                                    }
        
                                }).catch(([error,body]) =>{
        
                                    reject([error, body]);
                                    return;
                                });
                            }
                            
                            
                        }).then(async (value) => {
    
                            if(this.config.queryCharger){
                                await this.getVehicleStatus(vin,  "$homeregion/fs-car/bs/batterycharge/v1/$type/$country/vehicles/$vin/charger").then((value) => {
    
                                    var chargerObject = value;
                                    if (chargerObject && chargerObject.charger) {
                                        currentCar.charger = chargerObject.charger;
                                    }
        
                                }).catch(([error,body]) =>{
        
                                    reject([error, body]);
                                    return;
                                });
                            }
                            
                            
                        }).then(async (value) => {
    
                            if(this.config.queryTimer){
                                await this.getVehicleStatus(vin,  "$homeregion/fs-car/bs/departuretimer/v1/$type/$country/vehicles/$vin/timer").then((value) => {
    
                                    var timerObject = value;
                                    if (timerObject && timerObject.timer) {
                                        currentCar.timer = timerObject.timer;
                                    }
        
                                }).catch(([error,body]) =>{
        
                                    reject([error, body]);
                                    return;
                                });
                            }
                            
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

    getEnyacData(vins) {
        this.clientId = "7f045eee-7003-4379-9968-9355ed2adb06%40apps_vw-dilab_com";
        this.scope = "openid dealers profile email cars address";

        return new Promise(async (resolve, reject) => {
       
            

            var vehicles = [];
            const promiseArray = [];
            for (var i = 0; i < vins.length; i++) {
    
                var vin = vins[i];
                var currentCar = new Object();
                currentCar.vin = vin;

                await this.login(this.currentEmail,  this.currentPassword)
                .then(async (value) => {
                    await this.getVehicleStatus(vin,  "https://api.connect.skoda-auto.cz/api/v1/air-conditioning/$vin/status").then((value) => {
                     currentCar.airConditioningStatus = value;
                    }).catch(([error,body]) =>{

                        reject([error, body]);
                        return;
                    });

                }).then(async (value) => {
                    
                    await this.getVehicleStatus(vin,  "https://api.connect.skoda-auto.cz/api/v1/air-conditioning/$vin/settings").then((value) => {

                        currentCar.airConditioningSettings = value;

                    }).catch(([error,body]) =>{

                        reject([error, body]);
                        return;
                    });
                    
                }).then(async (value) => {
                    
                    await this.getVehicleStatus(vin,  "https://api.connect.skoda-auto.cz/api/v1/charging/$vin/status").then((value) => {

                        currentCar.chargingStatus = value;

                    }).catch(([error,body]) =>{

                        reject([error, body]);
                        return;
                    });
                    
                }).then(async (value) => {
                    
                    await this.getVehicleStatus(vin,  "https://api.connect.skoda-auto.cz/api/v1/charging/$vin/settings").then((value) => {

                        currentCar.chargingSettings = value;

                    }).catch(([error,body]) =>{

                        reject([error, body]);
                        return;
                    });
                    
                }).catch(([error,body]) =>{
    
                    reject([error, body]);
                    return;
                });

                vehicles.push(currentCar);
            }

            this.clientId = "f9a2359a-b776-46d9-bd0c-db1904343117@apps_vw-dilab_com";
            this.scope = "openid mbb profile";
            this.relogin = true;

           resolve(vehicles);
        });
    }

    
    getCodeChallenge() {
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
    
    replaceVarInUrl(url, vin) {
        return url
            .replace("/$vin/", "/" + vin + "/")
            .replace("$homeregion/", this.homeRegion + "/")
            .replace("/$type/", "/" + this.type + "/")
            .replace("/$country/", "/" + this.country + "/")
            .replace("/$tripType", "/" + this.config.tripType);
    }

    getTokens(getRequest, code_verifier, reject, resolve) {
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
                    // "user-agent": this.userAgent,
                    "X-App-version": this.xappversion,
                    "content-type": "application/x-www-form-urlencoded",
                    "x-app-name": this.xappname,
                    "accept": "application/json",
                },
                body: body,
                jar: this.jar,
                followAllRedirects: false,
            },
            (err, resp, body) => {
                if (err || (resp && resp.statusCode >= 400)) {
                    this.node.error("Failed to get token");
                   
                    resp && this.node.error(resp.statusCode);
                    body &&  this.node.error(JSON.stringify(body));
                    reject([err, body]);
                    return;
                }
                try {
                    const tokens = JSON.parse(body);
                    this.getVWToken(tokens, jwtid_token, reject, resolve);
                } catch (error) {
                    this.node.error(error);
                    this.node.status({ fill: "red", shape: "dot", text: "error" })
                }
            }
        );
    }
    getNonce() {
        const timestamp = Date.now();
        let hash = crypto.createHash("sha256").update(timestamp.toString()).digest("base64");
        hash = hash.slice(0, hash.length - 1);
        return hash;
    }
    
    getVWToken(tokens, jwtid_token, reject, resolve) {
        this.config.atoken = tokens.access_token;
        this.config.rtoken = tokens.refresh_token;
    
        if(this.config.apiType == "enyaq"){
            resolve();
            return;    
        }
        

        request.post(
            {
                url: "https://mbboauth-1d.prd.ece.vwg-connect.com/mbbcoauth/mobile/oauth2/v1/token",
                headers: {
                    "User-Agent": this.userAgent,
                    "X-App-Version": this.xappversion,
                    "X-App-Name": this.xappname,
                    "X-Client-Id": this.xclientId,
                    "Host": "mbboauth-1d.prd.ece.vwg-connect.com",
                },
                form: {
                    grant_type: "id_token",
                    token: jwtid_token,
                    scope: "sc2:fal",
                },
                jar: this.jar,
                followAllRedirects: true,
            },
            (err, resp, body) => {
                if (err || (resp && resp.statusCode >= 400)) {
                    resp && this.node.error(resp.statusCode);
                    reject([err, body]);
                }
                try {
                    const tokens = JSON.parse(body);
                    this.config.skodaAccessToken = tokens.access_token;
                    this.config.skodaRefreshToken = tokens.refresh_token;
                    resolve();
                } catch (error) {
                    reject([error, null]);
                }
            }
        );
    }
    refreshToken() {
    
        let form = "";
    
        let url = "https://mbboauth-1d.prd.ece.vwg-connect.com/mbbcoauth/mobile/oauth2/v1/token";
        let rtoken = this.config.skodaRefreshToken;
        let body = "grant_type=refresh_token&scope=sc2%3Afal&token=" + rtoken;
    
        return new Promise((resolve, reject) => {
            console.log("refreshToken");
            request.post(
                {
                    url: url,
                    headers: {
                        "user-agent": this.userAgent,
                        "content-type": "application/x-www-form-urlencoded",
                        "X-App-version": this.xappversion,
                        "X-App-name": this.xappname,
                        "X-Client-Id": this.xclientId,
                        "accept": "application/json",
                    },
                    body: body,
                    form: form,
                    gzip: true,
                    followAllRedirects: true,
                },
                (err, resp, body) => {
                    if (err || (resp && resp.statusCode >= 400)) {
                        this.node.error("Failing to refresh token.");
    
                        resp &&  this.node.error(resp.statusCode);
                        body && this.node.error(JSON.stringify(body));
                        reject([err, body]);
                        return;
                    }
                    try {
                        // console.log(body);
                        const tokens = JSON.parse(body);
                        if (tokens.error) {
                            this.node.error(JSON.stringify(body));
                            reject(tokens.error);
                            return;
                        }
    
                        this.config.skodaAccessToken = tokens.access_token;
                        if (tokens.refresh_token) {
                            this.config.skodaRefreshToken = tokens.refresh_token;
                        }
    
                        resolve();
                    } catch (error) {
                        this.node.error("Failing to parse refresh token. The instance will do restart and try a relogin.");
                        body && this.node.error(JSON.stringify(body));
                        resp && this.node.error(resp.statusCode);
                        error.stack && this.node.error(error.stack);         
                         
                        reject([error, null]);
                    }
                }
            );
        });
    }
    
    getPersonalData() {
        return new Promise((resolve, reject) => {
    
            console.log("getPersonalData");
            request.get(
                {
                    url: "https://customer-profile.apps.emea.vwapps.io/v1/customers/" + this.config.userid + "/personalData",
                    headers: {
                        "user-agent": this.userAgent,
                        "X-App-version": this.xappversion,
                        "X-App-name": this.xappname,
                        "authorization": "Bearer " + this.config.atoken,
                        "accept": "application/json",
                        "Host": "customer-profile.apps.emea.vwapps.io",
                    },
                    followAllRedirects: true,
                },
                (err, resp, body) => {
                    if (err || (resp && resp.statusCode >= 400)) {
                        resp &&  this.node.error(resp.statusCode);
                        body && this.node.error(JSON.stringify(body));
                        reject([err, body]);
                        return;
                    }
                    try {
                        if (body.error) {
                            this.node.error(JSON.stringify(body.error));

                            reject(body.error);
                        }

                        var personalData = JSON.parse(body);
                        resolve(personalData);
                    } catch (error) {
                       reject([error, null]);
                    }
                }
            );
        });
    }
    
    getVehicles() {
        return new Promise((resolve, reject) => {
            console.log("getVehicles");
            let url = this.replaceVarInUrl("https://msg.volkswagen.de/fs-car/usermanagement/users/v1/$type/$country/vehicles");
            let headers = {
                "User-Agent": this.userAgent,
                "X-App-Version": this.xappversion,
                "X-App-Name": this.xappname,
                "Authorization": "Bearer " + this.config.skodaAccessToken,
                "Accept": "application/json",
            };

            if(this.config.apiType == "enyaq"){
                url = "https://api.connect.skoda-auto.cz/api/v2/garage/vehicles";
                headers = {
                    accept: "application/json",
                    "content-type": "application/json;charset=utf-8",
                    "user-agent": this.userAgent,
                    "accept-language": "de-de",
                    authorization: "Bearer " + this.config.atoken,
                };
            }
            
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
                        resp && this.node.error(resp.statusCode);
                        body && this.node.error(JSON.stringify(body));
                        reject([err, body]);
                        return;
                    }
                    try {
                        if (body.errorCode) {
                            this.node.error("getVehicles failed");
                            this.node.error(JSON.stringify(body));
                            reject(body.errorCode);
                        }
                       
                        let vinArray = [];

                        if(this.config.apiType == "enyaq"){
                           

                            body.forEach((vehicle) => {
                                vinArray.push(vehicle.vin);
                                console.log(vehicle.vin);
                            });

                           
                            if(vinArray.length <= 0){
                                throw "Unable to find any vehicle VIN";
                            }
    
                        }
                        else{
                            // console.log(JSON.stringify(body));
                            if(body.userVehicles.vehicle == null){
                                throw "Unable to find any vehicle VIN";
                            }
                               
                            body.userVehicles.vehicle.forEach((vehicle) => {
                                vinArray.push(vehicle);
                            });
                        }


                       
                        resolve(vinArray);
                    } catch (error) {
                        reject([error, null]);
                    }
                }
            );
        });
    }
    
    getHomeRegion(vin) {
        return new Promise((resolve, reject) => {
    
            console.log("getHomeRegion");
            request.get(
                {
                    url: "https://mal-1a.prd.ece.vwg-connect.com/api/cs/vds/v1/vehicles/" + vin + "/homeRegion",
                    headers: {
                        "user-agent": this.userAgent,
                        "X-App-version": this.xappversion,
                        "X-App-name": this.xappname,
                        "authorization": "Bearer " + this.config.skodaAccessToken,
                        "accept": "application/json",
                    },
                    followAllRedirects: true,
                    gzip: true,
                    json: true,
                },
                (err, resp, body) => {
                    if (err || (resp && resp.statusCode >= 400)) {
                        resp && this.node.error(resp.statusCode);
                        this.node.error("getHomeRegion failed");
                        body && this.node.error(JSON.stringify(body));
                        reject([err, body]);  
                        return;            
                    }
                    try {
                        if (body.error) {
                            this.node.error(JSON.stringify(body.error));
                            reject(body.error);
                            return;
                        }
                        // console.log(body);
                        if (body.homeRegion && body.homeRegion.baseUri && body.homeRegion.baseUri.content) {
                            if (body.homeRegion.baseUri.content !== "https://mal-1a.prd.ece.vwg-connect.com/api") {
                                this.homeRegion = body.homeRegion.baseUri.content.split("/api")[0].replace("mal-", "fal-");
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
    
    
    getVehicleData(vin) {
        return new Promise((resolve, reject) => {
            console.log("getVehicleData");
            let url = this.replaceVarInUrl("https://msg.volkswagen.de/fs-car/promoter/portfolio/v1/$type/$country/vehicle/$vin/carportdata", vin);

            request.get(
                {
                    url: url,
                    headers: {
                        "User-Agent": this.userAgent,
                        "X-App-Version": this.xappversion,
                        "X-App-Name": this.xappname,
                        "X-Market": "de_DE",
                        "Authorization": "Bearer " + this.config.skodaAccessToken,
                        "If-None-Match": this.etags[url] || "",
                        "Accept": "application/json",
                    },
                    followAllRedirects: true,
                    gzip: true,
                    json: true,
                },
                (err, resp, body) => {
                    if (err || (resp && resp.statusCode >= 400)) {
                        this.node.error("getVehicleData failed");
                        console.log("getVehicleData failed");
                        resp &&  this.node.error(resp.statusCode);
                        body && this.node.error(JSON.stringify(body));
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
    
    getVehicleStatus(vin,  url) {
        return new Promise((resolve, reject) => {
            
            var urlParts = url.split('/');
            url = this.replaceVarInUrl(url, vin);
            
           
            let headers = {};
            
            if(this.config.apiType == "enyaq"){
                var statusType = urlParts[urlParts.length - 3];
                console.log("getVehicleStatus: " + statusType);
                headers = {
                    "api-key": "ok",
                    "Accept": "application/json",
                    "content-type": "application/json;charset=utf-8",
                    "user-agent": this.userAgent,
                    "accept-language": "de-de",
                    "If-None-Match": "",
                    authorization: "Bearer " + this.config.atoken,
                };
            }
            else{
                var statusType = urlParts[urlParts.length - 1];
                console.log("getVehicleStatus: " + statusType);
                headers = {
                    "User-Agent": this.userAgent,
                    "X-App-Version": this.xappversion,
                    "X-App-Name": this.xappname,
                    "Authorization": "Bearer " + this.config.skodaAccessToken,
                    "Accept": "application/json",
                };
            }

           
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
        
                        resp &&  this.node.error(resp.statusCode + ": " + resp.statusMessage);
                        body && this.node.error(JSON.stringify(body));
                        reject([err, body]);
                        return;                   
                    }
                    try {
                     
                        if (resp) {
                            this.etags[url] = resp.headers.etag;
                            if (resp.statusCode === 304) {
                                console.log("304 No values updated");
                                resolve();
                                return;
                            }
                        }
                        // console.log(JSON.stringify(body));
                        resolve(body);
    
                    } catch (error) {
                        this.node.error("error while reading getVehicleStatus result");
                        reject([error, null]);
                    }
                }
            );
        });
    }    


    getActionStatus(vin, actionId){
       
        return new Promise((resolve, reject) => {

            console.log("getActionStatus");
            var url = "$homeregion/fs-car/bs/climatisation/v1/$type/$country/vehicles/$vin/climater/actions/$actionId";
            url = this.replaceVarInUrl(url, vin);
            url = url.replace("/$actionId", "/" + actionId);

            request.get(
                {
                    url: url,
                    headers: {
                        "User-Agent": this.userAgent,
                        "X-Log-Tag": "RBC Climater action",
                        "X-App-Version": this.xappversion,
                        "X-App-Name": this.xappname,
                        "Authorization": "Bearer " + this.config.skodaAccessToken,
                        "Accept-charset": "UTF-8",
                        "Accept": "application/json",
                    },
                    followAllRedirects: true,
                    gzip: true,
                    json: true,
                },
                (err, resp, body) => {
                    if (err || (resp && resp.statusCode >= 400)) {
        
                        resp &&  this.node.error(resp.statusCode);
                        body && this.node.error(JSON.stringify(body));
                        reject([err, body]);
                        return;                   
                    }
                    try {
                        // console.log(JSON.stringify(body));
                        if (resp) {
                            this.etags[url] = resp.headers.etag;
                            if (resp.statusCode === 304) {
                                console.log("304 No values updated");
                                reject([resp.statusCode, null]);
                                return;
                            }
                        }
                        
                        resolve(body);
    
                    } catch (error) {
                        this.node.error("error while reading getVehicleStatus result");
                        reject([error, null]);
                    }
                }
            );

        });
    }
    
    setVehicleStatus(vin, url, body, contentType) {
        return new Promise((resolve, reject) => {
            url = this.replaceVarInUrl(url, vin);
            const headers = {
                "User-Agent": this.userAgent,
                "X-App-Version": this.xappversion,
                "X-App-Name": this.xappname,
                "Authorization": "Bearer " + this.config.skodaAccessToken,
                "Accept-charset": "UTF-8",
                "Content-Type": contentType,
                "Accept":
                "application/json, application/vnd.vwg.mbb.ChargerAction_v1_0_0+xml,application/vnd.vwg.mbb.ClimaterAction_v1_0_1+json,application/vnd.volkswagenag.com-error-v1+xml,application/vnd.vwg.mbb.genericError_v1_0_2+xml, application/vnd.vwg.mbb.RemoteStandheizung_v2_0_0+xml, application/vnd.vwg.mbb.genericError_v1_0_2+xml,application/vnd.vwg.mbb.RemoteLockUnlock_v1_0_0+xml,*/*",
            };
    
            request.post(
                {
                    url: url,
                    headers: headers,
                    body: body,
                    followAllRedirects: true,
                    gzip: true,
                },
                (err, resp, body) => {
                    if (err || (resp && resp.statusCode >= 400)) {
                        resp &&  this.node.error(resp.statusCode);
                        body && this.node.error(JSON.stringify(body));
                        reject([err, body]);
                        return;   
                    }
                    try {
                        // console.log(body);
                        if (body.indexOf("<error>") !== -1) {
                            reject([resp.statusCode, body]);
                            return;
                        }
                        resolve(body);
                    } catch (error) {
                        this.node.error("error while setting VehicleStatus");
                        reject([error, null]);
                    }
                }
            );
        });
    }

    stringIsAValidUrl(s) {
        try {
            new URL(s);
            return true;
        } catch (err) {
            return false;
        }
    }
        
}

module.exports = SkodaLibrary;

