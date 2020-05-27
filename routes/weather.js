const API_KEY = process.env.WEATHER_API_KEY

//express is the framework we're going to use to handle requests
const express = require('express')

//request module is needed to make a request to a web service
const request = require('request')
// to change zipcode to lon and lat
var zipcodes = require('zipcodes');

var router = express.Router()

/**
 * @api {get} /weather/zipcode/ All in one call request for current, daily, and hourly weather from OpenWeatherMap
 * @apiName GetWeather
 * @apiGroup Weather
 * 
 * @apiHeader {String} authorization JWT provided from Auth get
 * @apiParam {String} zipcode for any location
 * 
 * @apiSuccess {String} weather weather information retrieved
 * @apiDescription This end point is a pass through to the OpenWeatherMap API. 
 * All parameters will pass on to api.openweathermap.org/data/2.5/onecall.
 * See the <a href="https://openweathermap.org/api/one-call-api">openweathermap.org documentation</a>
 * for a list of optional paramerters and expected results. You do not need a 
 * OWM api key with this endpoint. Enjoy!
 * 
 * @apiError (400: Invalid Zipcode) {String} message "Invalid Zipcode"
 * @apiUse JSONError
 */ 
router.get("/zipcode/", (req, res) => { 
//lookup will return an object like this:
        // { zip: '90210',
        //   latitude: 34.088808,
        //   longitude: -118.406125,
        //   city: 'Beverly Hills',
        //   state: 'CA',
        //   country: 'US' }   
var zipcode = req.query.zipcode  
var location      
location = zipcodes.lookup(zipcode);

if (typeof location === 'undefined') {
    res.status(400).send({
        message: "Invalid Zipcode"})
}
// parse result to float
var lat = parseFloat(location.latitude)
var lon = parseFloat(location.longitude)
    // openweathermap endpoint
    let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${API_KEY}&units=imperial` 
    //When this web service gets a request, make a request to the weather Web service
    request(url, function (error, response, body) {
        if (error) {
            res.send(error)
        } else {
            //send json respone,the city from the zipcode, and state from the zipcode
            res.send({
                success: true,
                weather: body,
                city: location.city,
                state: location.state,
                zip: location.zip
            })
        }
    })
})


g
/**
 * @api {get} /weather/coords/ All in one call request for current, daily, and hourly weather from OpenWeatherMap
 * @apiName GetWeather
 * @apiGroup Weather
 * 
 * @apiHeader {String} authorization JWT provided from Auth get
 * @apiParam {String} Latitude for any geographical location 
 * @apiParam {String} Longitute for any geographical location 
 * 
 * @apiSuccess {String} weather weather information retrieved
 * @apiDescription This end point is a pass through to the OpenWeatherMap API. 
 * All parameters will pass on to api.openweathermap.org/data/2.5/onecall.
 * See the <a href="https://openweathermap.org/api/one-call-api">openweathermap.org documentation</a>
 * for a list of optional paramerters and expected results. You do not need a 
 * OWM api key with this endpoint. Enjoy!
 * 
 * @apiError (400: Invalid Coordinates) {String} message "Invalid Latitude/Longitude"
 * @apiUse JSONError
 */ 
router.get("/coords/", (req, res) => {
    var location      
    location = zipcodes.lookupByCoords(req.query.lat,req.query.lon);
    if (typeof location === 'undefined') {
        res.status(400).send({
            message: "Invalid Latitude/Longitude location"})
    }
    console.log(location)
    // parse result to float
    var lat = parseFloat(location.latitude)
    var lon = parseFloat(location.longitude)
        // openweathermap endpoint
        let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${API_KEY}&units=imperial` 
        //When this web service gets a request, make a request to the weather Web service
        request(url, function (error, response, body) {
            if (error) {
                res.send(error)
            } else {
                //send json respone,the city from the zipcode, and state from the zipcode
                res.send({
                    success: true,
                    weather: body,
                    city: location.city,
                    state: location.state,
                    zip: location.zip
                })
            }
        })
    })

module.exports = router
