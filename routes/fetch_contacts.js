//express is the framework we're going to use to handle requests
const express = require('express')

//Access the connection to Heroku Database
let pool = require('../utilities/utils').pool


var router = express.Router()

const bodyParser = require("body-parser")
//This allows parsing of the body of POST requests, that are encoded in JSON
router.use(bodyParser.json())

/**
 * @api {get} /lookup_user/ Request to get all users with the given username/nickname
 * @apiName GetContacts
 * @apiGroup Contacts
 * 
 * @apiParam {String} Username (Optional) the name to look up. If no name provided, nothing is returned.
 * 
 * @apiSuccess {boolean} success true when the usernames are found.
 * @apiSuccess {Object[]} userinfo a List of the user's info in the contacts DB
 * @apiSuccess {String} userinfo.firstName The first name
 * @apiSuccess {String} userinfo.lastname The last name
 * @apiSuccess {String} userinfo.username The username associated with the account
 * 
 * @apiError (404: username Not Found) {String} message "username not found"

 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * 
 * @apiUse JSONError
 */ 
router.get("/", (request, response) => {

    //const theQuery = 'SELECT MemberID_B FROM Contacts WHERE MemberID_A = $1'
    const theQuery = 'SELECT FirstName, LastName, Username, MemberId, Contacts.primaryKey FROM Contacts RIGHT JOIN Members ON Contacts.MemberID_B = Members.MemberId WHERE MemberID_A = $1'
    
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
                    message: "Username Not Found!"
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

module.exports = router