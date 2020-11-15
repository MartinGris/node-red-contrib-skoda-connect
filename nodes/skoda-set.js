const request = require('request');
const rp = require('request-promise');
const traverse = require("traverse");
const jsdom = require("jsdom");
const { Console } = require('console');
const { JSDOM } = jsdom;
const SkodaLibrary = require('../lib/skoda-library');
//import SkodaLibrary from '../lib/skoda-library';

module.exports = function (RED) {
    function SkodaConnectNodeSet(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.skodaLib = new SkodaLibrary(node);
        node.command = config.command;

        node.on('input', async function (msg, send, done) {

            await node.skodaLib.connect(this.credentials);

            if(!msg.vin || msg.vin == ""){
                node.error("VIN is not defined");
                this.node.status({ fill: "red", shape: "dot", text: "error" })
                return;
            }

            switch (node.command) {
                case "temperature":
                    node.skodaLib.setClimaterTemperature(msg).then(function (resultBody) {
                        node.status({});
                        var msg = { payload: resultBody };
                        node.send(msg);
                    }).catch(([error,body]) =>{
                        node.skodaLib.errorHandling(error, body);
                    });
                    break;
                case "climater":
                    node.skodaLib.setClimater(msg).then(function (resultBody) {
                        node.status({});
                        var msg = { payload: resultBody };
                        node.send(msg);
                    }).catch(([error,body]) =>{
                        node.skodaLib.errorHandling(error, body);
                    });
                    break;
                default:
                    node.skodaLib.errorHandling("unknown command");
              }



            

        });
    }
    RED.nodes.registerType("skoda-set", SkodaConnectNodeSet, {
        credentials: {
            email: { type: "text" },
            password: { type: "password" }
        }
    });
}


