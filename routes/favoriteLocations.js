//express is the framework we're going to use to handle requests
const express = require('express')

//Access the connection to Heroku Database
let pool = require('../utilities/utils').pool


var router = express.Router()

const bodyParser = require("body-parser")
//This allows parsing of the body of POST requests, that are encoded in JSON
router.use(bodyParser.json())

/**
 * @api {get} /favorites Request to get all saved favorite locations for the user
 * @apiName GetFavorites
 * @apiGroup Favorites 
 * 
 * @apiParam {String} MemberID for the application user
 * 
 * @apiSuccess {boolean} success true when the list of favorites returns
 * @apiSuccess {Object[]} favorites a List of the user's weather location favorites
 * 
 * @apiError (404: favorites Not Found) {String} message "no locations not found"

 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * 
 * @apiUse JSONError
 */ 
router.get("/", (request, response) => {
    
    const theQuery = 'SELECT lat, Long, zip, city, state FROM Locations WHERE memberid = $1'
    let values = [request.query.username]
    console.log(request.decode)
    pool.query(theQuery, values)
        .then(result => {
            if (result.rowCount > 0) {
                response.send({
                    success: true,
                    locations: result.rows,
                    type: "favorites"
                })
            } else {
                response.status(404).send({
                    message: "Locations Not Found!"
                })
            }
        })
        .catch(err => {
            //log the error
            // console.log(err.details)
            response.status(400).send({
                message: err.detail
            })
        })
})


/**
 * @api {post} /favorites/delete Request to get all saved favorite locations for the user
 * @apiName DeleteFavorites
 * @apiGroup Favorites 
 * 
 * @apiParam {String} Member_Id for the users favorite list
 * @apiParam {String} zipcode for the users favorite list item
 * 
 * @apiSuccess (Success 201) {boolean} success true when the location is deleted
 * 
 * @apiError (400: Name exists) {String} message error details
 * 
 * @apiError (400: Missing Parameters) {String} message "Missing required information"
 * 
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * 
 * @apiUse JSONError
 */ 
router.post("/delete/", (request, response) => {

    if (request.body.memberid && request.body.zipcode) {
    
        const theQuery = "DELETE FROM Locations WHERE memberid = $1 and zip = $2"
        const values = [request.body.memberid, request.body.zipcode]

        pool.query(theQuery, values)
            .then(result => {
                response.status(201).send({
                    success: true,
                    message: "Deleted: " + result.rows,
                    type: "delete"
                })
            })
            .catch(err => {
                //log the error
                    response.status(400).send({
                        message: err.detail
                    })
                
            }) 
            
    } else {
        response.status(400).send({
            message: "Missing required information"
        })
    }    
})

/**
 * @api {post} /favorites/add adds a location to the users favorites list
 * @apiName PostFavorites
 * @apiGroup Favorites
 * 
 * @apiParam {String} MemberID_A users id
 * @apiParam {String} Zipcode of the favorite location
 * @apiParam {String} Latitude of the favorite location
 * @apiParam {String} Longitude of the favorite location
 * @apiParam {String} City of the favorite location
 * @apiParam {String} State of the favorite location
 * 
 * @apiSuccess (Success 201) {boolean} success true when the location is inserted
 * @apiSuccess (Success 201) {String} message the inserted location
 * 
 * @apiError (400: Name exists) {String} message "Location Already Exists"
 * 
 * @apiError (400: Missing Parameters) {String} message "Missing required information"
 * 
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * 
 * @apiUse JSONError
 */ 
router.post("/add/", (request, response) => {

    if (request.body.MemberID_A && request.body.MemberID_B) {
        const theQueryCheck = "SELECT * FROM Locations WHERE memberid = $1 AND zip = $2"


        const theQuery = "INSERT INTO Locations(memberid, zip, lat, long, city, state) VALUES ($1, $2, $3, $4, $5, $6)"
        const values = [request.body.memberid, request.body.zipcode, request.body.latitude,
                        request.body.longitude, request.body.city,request.body.state]

        pool.query(theQueryCheck, values)
            .then(result => {
                if (result.rowCount == 0) {
                    pool.query(theQuery, values)
                    .then(result => {
                    response.status(201).send({
                    success: true,
                    type: "add",
                    message: result.rows[0]
                })
            })
            .catch(err => {
                //log the error
                console.log(err)
                    response.status(400).send({
                        message: err.detail
                    })
            }) 
                } else {
                    response.status(400).send({
                        success: true,
                        message: "Location Already Exists"
                    })
                }
                
            })
            .catch(err => {
                //log the error
                console.log(err)
                
                    response.status(400).send({
                        message: err.detail
                    })
                
            })

        
            
    } else {
        response.status(400).send({
            message: "Missing required information!"
        })
    }    
})
module.exports = router