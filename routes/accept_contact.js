//express is the framework we're going to use to handle requests
const express = require('express')

//Access the connection to Heroku Database
let pool = require('../utilities/utils').pool


var router = express.Router()

const bodyParser = require("body-parser")
//This allows parsing of the body of POST requests, that are encoded in JSON
router.use(bodyParser.json())

/**
 * @api {post} /delete_contact deletes an existing contact
 * @apiName GetDeleteContacts
 * @apiGroup Contacts
 * 
 * @apiParam {String} Contacts's primary key
 * 
 * @apiSuccess (Success 201) {boolean} success true when the contact is deleted
 * 
 * @apiError (400: Name exists) {String} message error details
 * 
 * @apiError (400: Missing Parameters) {String} message "Missing required information"
 * 
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * 
 * @apiUse JSONError
 */ 
router.post("/", (request, response) => {

    if (request.body.primaryKey) {
    
        const theQuery = "UPDATE Contacts SET Verified = 1 WHERE Primarykey = $1"
        const values = [request.body.primaryKey]

        pool.query(theQuery, values)
            .then(result => {
                response.status(201).send({
                    success: true,
                    message: "Added: " + result.rows
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

module.exports = router