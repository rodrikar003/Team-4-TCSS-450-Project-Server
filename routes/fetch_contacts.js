//express is the framework we're going to use to handle requests
const express = require('express')

//Access the connection to Heroku Database
let pool = require('../utilities/utils').pool


var router = express.Router()

const bodyParser = require("body-parser")
//This allows parsing of the body of POST requests, that are encoded in JSON
router.use(bodyParser.json())

/**
 * @api {get} /fetch_contact/ Request to get all of the user's contacts
 * @apiName GetUserContacts
 * @apiGroup Contacts
 * 
 * @apiParam {String} MemberId (Optional) the user's memberId to fetch of their contacts. If no memberId provided, nothing is returned.
 * 
 * @apiSuccess {boolean} success true when the contacts are found.
 * @apiSuccess {Object[]} a List of the user's contacts information.
 * 
 * @apiError (404: username Not Found) {String} message "No Contacts were found"

 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * 
 * @apiUse JSONError
 */ 
router.get("/", (request, response) => {

    const theQuery = 'SELECT FirstName, LastName, Username, MemberId, Contacts.primaryKey FROM Contacts RIGHT JOIN Members ON Contacts.MemberID_B = Members.MemberId WHERE MemberID_A = $1 WHERE Contacts.verified ORDER BY Contacts.primaryKey DESC'
    
    let values = [request.query.memberid]
    
    pool.query(theQuery, values)
        .then(result => {
            if (result.rowCount > 0) {
                response.send({
                    success: true,
                    results: result.rows
                })
            } else {
                response.status(404).send({
                    message: "No Contacts"
                })
            }
        })
        .catch(err => {
            response.status(400).send({
                message: err.detail
            })
        })
})

module.exports = router