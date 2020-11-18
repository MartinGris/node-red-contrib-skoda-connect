const request = require('request');
const rp = require('request-promise');
const traverse = require("traverse");
const jsdom = require("jsdom");
const { Console } = require('console');
const { JSDOM } = jsdom;
const SkodaLibrary = require('../lib/skoda-library');

module.exports = function (RED) {
    function SkodaConnectNodeSet(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.command = config.command;

        node.on('input', async function (msg, send, done) {
            if(!node._flow.skodaLib){
                node._flow.skodaLib = new SkodaLibrary(node, config);
            }
            await node._flow.skodaLib.connect(this.credentials);

            if(!msg.vin || msg.vin == ""){
                node.error("VIN is not defined");
                this.node.status({ fill: "red", shape: "dot", text: "error" })
                return;
            }

            function queryActionResult(actionId){
                if(config.queryActionResult == false || !actionId){
                    return;
                }
                for(var i = 0; i < config.queryCount; i++){
                    setTimeout(function() {
    
                        node._flow.skodaLib.getActionStatus(msg.vin, actionId).then(function (resultBody) {
                            node.status({});
                            var msg = { payload: resultBody };
                            node.send([null, msg]);
                        }).catch(([error,body]) =>{
                            node._flow.skodaLib.errorHandling(error, body);
                        });
        
        
                      },config.refreshPeriod * (i + 1));
                }
            }

            switch (config.command) {
                case "temperature":
                    node._flow.skodaLib.setClimaterTemperature(msg).then(function (resultBody) {
                        node.status({});
                        var msg = { payload: resultBody };
                        node.send([msg, null]);
                        queryActionResult(resultBody.action.actionId);
                    }).catch(([error,body]) =>{
                        node._flow.skodaLib.errorHandling(error, body);
                    });
                    break;
                case "climater":
                    node._flow.skodaLib.setClimater(msg).then(function (resultBody) {
                        node.status({});
                        var msg = { payload: resultBody };
                        node.send([msg, null]);
                        queryActionResult(resultBody.action.actionId);
                    }).catch(([error,body]) =>{
                        node._flow.skodaLib.errorHandling(error, body);
                    });
                    break;
                default:
                    node._flow.skodaLib.errorHandling("unknown command");
                    return;
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


