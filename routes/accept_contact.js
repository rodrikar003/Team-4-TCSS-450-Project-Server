//express is the framework we're going to use to handle requests
const express = require('express')

//Access the connection to Heroku Database
let pool = require('../utilities/utils').pool

let pushy = require('../utilities/utils').pushy

var router = express.Router()

const bodyParser = require("body-parser")
//This allows parsing of the body of POST requests, that are encoded in JSON
router.use(bodyParser.json())

/**
 * @api {post} delete_contact deletes an existing contact
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
router.post("/", (request, response, next) => {
    if (request.body.primaryKey && request.body.MemberID_A && request.body.MemberID_B) {
    
        const theQuery = "UPDATE Contacts SET Verified = 1 WHERE Primarykey = $1"
        const values = [request.body.primaryKey]
        pool.query(theQuery, values)
            .then(result => next())
            .catch(err => {
                //log the error
                console.log(err)
                    response.status(400).send({
                        message: err.detail
                    })
                }) 
    } else {
        response.status(400).send({
            message: "Missing required information"
        })
    }    
// }, (request, response, next) => {
//     let query = "INSERT INTO Contacts(MemberID_A, MemberID_B, Verified) VALUES ($1, $2, 1)"
//     let values = [request.body.MemberID_A, request.body.MemberID_B]

//     pool.query(query, values)
//         .then(result => {
//             next()
//         .catch(err => {
//             //log the error
//             response.status(400).send({
//                 message: err.detail
//             })
//         })
//     })

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

    let accepter = {
        accepter: request.body.senderEmail
    }

    pool.query(query, values)
        .then(result => {
            pushy.acceptIndividualAsContact(result.rows[0].token, accepter);
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