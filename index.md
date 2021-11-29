
# node-red-contrib-skoda-connect

[![NPM version](http://img.shields.io/npm/v/node-red-contrib-skoda-connect.svg)](https://www.npmjs.com/package/node-red-contrib-skoda-connect)
[![Downloads](https://img.shields.io/npm/dm/node-red-contrib-skoda-connect.svg)](https://www.npmjs.com/package/node-red-contrib-skoda-connect)
[![Dependency Status](https://img.shields.io/david/MartinGris/node-red-contrib-skoda-connect.svg)](https://david-dm.org/MartinGris/node-red-contrib-skoda-connect)

[![NPM](https://nodei.co/npm/node-red-contrib-skoda-connect.png?compact=true)](https://nodei.co/npm/node-red-contrib-skoda-connect/)

## skoda-connect node for node-red

simple nodes for getting car information from skoda connect platform and call functions you know from the skoda connect app


## Usage skoda-get node

You need a Skoda connect account. In the node enter mail and password. any input triggers the api call. Ouput is a json object with information of each car.
There are some optional APIs which can be called depending on the configuration of your car. Select it only if available for your car.

## Usage skoda-set node

You need a Skoda connect account. In the node enter mail and password. Currently two functions can be selected in the dropdown. Each function needs a different payload.
For setting the target temperature of the climater pass the value as double in the payload field. For switching the climater on or off pass a boolean in the payload field. Both functions need a VIN number (string).
```js
	{
	"payload": <TEMPERATURE>,
	"vin": "<VIN>"
	}
```
or

```js
	{
	"payload": <true/false>,
	"vin": "<VIN>"
	}
```

The second output of the skoda-set node is used for the ActionState query. It can be configured to query the state of the currently sent action a couple of times in a defined period.

## ActionState Explanation

  -   queued
  -   fetched
  -   delayed
  -   unfetched
  -   cancelled
  -   succeeded
  -   failed
  -   error
  -   succeededDelayed
  -   failedDelayed

## Status fields Explanation

Door and window states:

-   open: 1
-   locked: 2
-   closed: 3

## Credits
Thanks to [TA2k](https://github.com/TA2k) for [ioBroker.vw-connect](https://github.com/TA2k/ioBroker.vw-connect) and [DBa2016](https://github.com/DBa2016) for [sc2mqtt](https://github.com/DBa2016/sc2mqtt).
My code based heavily on there scripts

## Buy me a beer
Find it useful? Please consider buying me or other contributors a beer.

<a href="https://www.buymeacoffee.com/MartinGrisard" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Beer" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>


