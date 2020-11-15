const request = require('request');
const rp = require('request-promise');
const traverse = require("traverse");
const jsdom = require("jsdom");
const { Console } = require('console');
const { JSDOM } = jsdom;
const SkodaLibrary = require('../lib/skoda-library');
//import SkodaLibrary from '../lib/skoda-library';



module.exports = function (RED) {
    function SkodaConnectNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.skodaLib = new SkodaLibrary(node);
      

        node.status({ fill: "grey", shape: "dot", text: "not logged in" });
        node.on('input', async function (msg, send, done) {

            await node.skodaLib.connect(this.credentials);

            var skodaResultObject = new Object();

            skodaResultObject.personalData = node.skodaLib.personalData;
            node.status({ fill: "green", shape: "dot", text: "requesting data ..." });
               
            node.skodaLib.getVehicles().then(function (value) {
                vins = [];
                vins = value;

                node.skodaLib.getAllCarsData(vins).then(function (carsData) {
                    skodaResultObject.vehicles = carsData;
                    node.status({});
                    msg = { payload: skodaResultObject };
                    node.send(msg);
                }).catch(([error,body]) =>{
                    node.skodaLib.errorHandling(error, body);
                });

            }).catch(([error,body]) =>{
                node.skodaLib.errorHandling(error, body);
            });
         
           
            
        });
    }
    RED.nodes.registerType("skoda-get", SkodaConnectNode, {
        credentials: {
            email: { type: "text" },
            password: { type: "password" }
        }
    });
}


