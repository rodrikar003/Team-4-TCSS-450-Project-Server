//express is the framework we're going to use to handle requests
const express = require('express')

//Access the connection to Heroku Database
let pool = require('../utilities/utils').pool


var router = express.Router()

const bodyParser = require("body-parser")
//This allows parsing of the body of POST requests, that are encoded in JSON
router.use(bodyParser.json())

/**
 * @api {post} /add_user adds two contacts together
 * @apiName GetContacts
 * @apiGroup Contacts
 * 
 * @apiParam {String} MemberID_A first person's id
 * @apiParam {String} MemberID_B second person's id
 * 
 * @apiSuccess (Success 201) {boolean} success true when the MemberId is inserted
 * @apiSuccess (Success 201) {String} message the inserted MemberId
 * 
 * @apiError (400: Name exists) {String} message "Friend Already Exists"
 * 
 * @apiError (400: Missing Parameters) {String} message "Missing required information"
 * 
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * 
 * @apiUse JSONError
 */ 
router.post("/", (request, response, next) => {
    if (request.body.MemberID_A && request.body.MemberID_B) {
        let query = "SELECT * FROM Contacts WHERE MemberID_A = $1 AND MemberID_B = $2"
        let values = [request.body.MemberID_A, request.body.MemberID_B]

        pool.query(query, values)
            .then(result => {
                if (result.rowCount == 0) {
                    next()
                } else {
                    response.status(400).send({
                        success: true,
                        message: "Friend Already Exists"
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
}, (request, response, next) => {
    // Inserts into contacts table
    let query = "INSERT INTO Contacts(MemberID_A, MemberID_B) VALUES ($1, $2)"
    let values = [request.body.MemberID_A, request.body.MemberID_B]

    pool.query(query, values)
        .then(result => {
            next()
        })
        .catch(err => {
            //log the error
            console.log(err)
            response.status(400).send({
                message: err.detail
            })
        })
}, (request, response, next) => {
    // Get sender's email
    let query = 'SELECT Email FROM Members WHERE MemberId=$1'
    let values = [request.body.MemberID_A]

    pool.query(query, values)
        .then(result => {
            if (result.rowCount == 0) {
                response.status(404).send({
                    message: "Member not found"
                })
            } else {
                request.body.senderEmail = result.rows[0].email
                next()
            }
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
}, (request, response) => {
    let query = `SELECT token FROM Push_Token
                    WHERE MemberId=$1`
    let values = [request.body.MemberID_B]

    let sender = {
        sender: request.body.senderEmail
    }

    pool.query(query, values)
        .then(result => {
            console.log(chatRoom);
            pushy.addIndividualAsContact(result.rows[0].token, sender);
            response.send({
                success: true,
            })
        }).catch(err => {
            response.status(400).send({
                message: "SQL Error on select from push token",
                error: err
            })
        })
})

module.exports = router