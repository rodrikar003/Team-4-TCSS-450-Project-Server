//express is the framework we're going to use to handle requests
const express = require('express')

//Access the connection to Heroku Database
let pool = require('../utilities/utils').pool

var router = express.Router()

//This allows parsing of the body of POST requests, that are encoded in JSON
router.use(require("body-parser").json())

let pushy = require('../utilities/utils').pushy

/**
 * @apiDefine JSONError
 * @apiError (400: JSON Error) {String} message "malformed JSON in parameters"
 */ 

/**
 * @api {post} /chats/ Request to add a chat
 * @apiName PostChats
 * @apiGroup Chats
 * 
 * @apiHeader {String} authorization Valid JSON Web Token JWT
 * @apiParam {String} name the name for the chat
 * 
 * @apiSuccess (Success 201) {boolean} success true when the name is inserted
 * @apiSuccess (Success 201) {Number} chatId the generated chatId
 * 
 * @apiError (400: Unknown user) {String} message "unknown email address"
 * 
 * @apiError (400: Missing Parameters) {String} message "Missing required information"
 * 
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * 
 * @apiError (400: Unknow Chat ID) {String} message "invalid chat id"
 * 
 * @apiUse JSONError
 */ 
router.post("/", (request, response, next) => {
    if (!request.body.name) {
        response.status(400).send({
            message: "Missing required information"
        })
    } else {
        next()
    }
}, (request, response, next) => {
    //convert jwt to email
    let insert = `SELECT Email FROM Members WHERE MemberId=$1`
    let values = [request.decoded.memberid]
    pool.query(insert, values)
        .then(result => {
            request.params.email = result.rows[0].email
            next()
        }).catch(err => {
            response.status(400).send({
                message: "SQL Error",
                error: err
            })
        })
}, (request, response, next) => {
    // insert new chat room
    let insert = `INSERT INTO Chats(Name, Email)
                  VALUES ($1, $2)
                  RETURNING ChatId`
    let values = [request.body.name, request.params.email]
    pool.query(insert, values)
        .then(result => {
            request.body.chatid = result.rows[0].chatid
            next()
        }).catch(err => {
            response.status(400).send({
                message: "SQL Error",
                error: err
            })
        })
}, (request, response) => {
    //Insert the memberId into the chat
    let insert = `INSERT INTO ChatMembers(ChatId, MemberId)
                  VALUES ($1, $2)
                  RETURNING *`
    let values = [request.body.chatid, request.decoded.memberid]
    pool.query(insert, values)
        .then(result => {
            response.send({
                success: true, 
                chatID: request.body.chatid
            })
        }).catch(err => {
            response.status(400).send({
                message: "SQL Error",
                error: err
            })
        })
})

/**
 * @api {put} /chats/ Request add a user to a chat
 * @apiName PutChats
 * @apiGroup Chats
 * 
 * @apiDescription Adds the user associated with the email in the body. 
 * 
 * @apiHeader {String} authorization Valid JSON Web Token JWT
 * 
 * @apiParam {Number} chatId the chat to add the user to
 * @apiParam {String} email the email of the user to add
 * 
 * @apiSuccess {boolean} success true when the name is inserted
 * 
 * @apiError (404: Chat Not Found) {String} message "chatID not found"
 * @apiError (404: Email Not Found) {String} message "email not found"
 * @apiError (400: Invalid Parameter) {String} message "Malformed parameter. chatId must be a number" 
 * @apiError (400: Duplicate Email) {String} message "user already joined"
 * @apiError (400: Missing Parameters) {String} message "Missing required information"
 * 
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * 
 * @apiUse JSONError
 */ 
router.put("/", (request, response, next) => {
    if (!request.body.chatId || !request.body.email) {
        response.status(400).send({
            message: "Missing required information"
        })
    } else {
        next()
    }
}, (request, response, next) => {
    //validate chat id exists
    let query = 'SELECT Name FROM CHATS WHERE ChatId=$1'
    let values = [request.body.chatId]

    pool.query(query, values)
        .then(result => {
            if (result.rowCount == 0) {
                response.status(404).send({
                    message: "Chat ID not found"
                })
            } else {
                request.body.chatName = result.rows[0].name
                next()
            }
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
}, (request, response, next) => {
    //validate jwt matches owner of chatroom
    let query =  `SELECT Email FROM Chats
                    WHERE ChatId=$1`
    let values = [request.body.chatId]

    pool.query(query, values)
        .then(result => {
            if (result.rowCount == 0) {
                response.status(404).send({
                    message: "Chat ID not found"
                })
            } else {
                if (result.rows[0].email != request.decoded.email) {
                    response.status(404).send({
                        message: "User is not owner of chat room"
                    })
                } else {
                    next()
                }
            }
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
}, (request, response, next) => {
    //validate email exists 
    let query = 'SELECT MemberId FROM Members WHERE Email=$1'
    let values = [request.body.email]

    pool.query(query, values)
        .then(result => {
            if (result.rowCount == 0) {
                response.status(404).send({
                    message: "email not found"
                })
            } else {
                request.body.memberid = result.rows[0].memberid
                next()
            }
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
}, (request, response, next) => {
    //validate email does not already exist in the chat
    let query = 'SELECT * FROM ChatMembers WHERE ChatId=$1 AND MemberId=$2'
    let values = [request.body.chatId, request.body.memberid]

    pool.query(query, values)
        .then(result => {
            if (result.rowCount > 0) {
                response.status(400).send({
                    message: "user already joined"
                })
            } else {
                next()
            }
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })

}, (request, response, next) => {
    //Insert the memberId into the chat
    let insert = `INSERT INTO ChatMembers(ChatId, MemberId)
                  VALUES ($1, $2)`
    let values = [request.body.chatId, request.body.memberid]
    pool.query(insert, values)
        .then(result => {
            next()
        }).catch(err => {
            response.status(400).send({
                message: "SQL Error",
                error: err
            })
        })
}, (request, response) => {
    let query = `SELECT token FROM Push_Token
                    WHERE MemberId=$1`
    let values = [request.body.memberid]

    let chatroom = {
        chatId: request.body.chatId,
        chatName: request.body.chatName,
        owner: request.decoded.email
    }

    pool.query(query, values)
        .then(result => {
            console.log(chatroom);
            pushy.addIndividualToChatRoom(result.rows[0].token, chatroom);
            response.send({
                success: true
            })
        }).catch(err => {
            response.status(400).send({
                message: "SQL Error on select from push token",
                error: err
            })
        })
})

/**
 * @api {get} /chats/:chatId? Request to get the emails of all users in a chat
 * @apiName GetChats
 * @apiGroup Chats
 * 
 * @apiHeader {String} authorization Valid JSON Web Token JWT
 * 
 * @apiParam {Number} chatId the chat to look up. 
 * 
 * @apiSuccess {Number} rowCount the number of messages returned
 * @apiSuccess {Object[]} members List of members in the chat
 * @apiSuccess {String} messages.email The email for the member in the chat
 * 
 * @apiError (404: ChatId Not Found) {String} message "Chat ID Not Found"
 * @apiError (400: Invalid Parameter) {String} message "Malformed parameter. chatId must be a number" 
 * @apiError (400: Missing Parameters) {String} message "Missing required information"
 * 
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * 
 * @apiUse JSONError
 */ 
router.get("/:chatId", (request, response, next) => {
    //validate on missing or invalid (type) parameters
    if (!request.params.chatId) {
        response.status(400).send({
            message: "Missing required information"
        })
    } else if (isNaN(request.params.chatId)) {
        response.status(400).send({
            message: "Malformed parameter. chatId must be a number"
        })
    } else {
        next()
    }
},  (request, response, next) => {
    //validate chat id exists
    let query = 'SELECT * FROM CHATS WHERE ChatId=$1'
    let values = [request.params.chatId]

    pool.query(query, values)
        .then(result => {
            if (result.rowCount == 0) {
                response.status(404).send({
                    message: "Chat ID not found"
                })
            } else {
                next()
            }
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
}, (request, response) => {
        //REtrive the members
        let query = `SELECT Members.Email 
                    FROM ChatMembers
                    INNER JOIN Members ON ChatMembers.MemberId=Members.MemberId
                    WHERE ChatId=$1`
        let values = [request.params.chatId]
        pool.query(query, values)
            .then(result => {
                response.send({
                    rowCount : result.rowCount,
                    rows: result.rows
                })
            }).catch(err => {
                response.status(400).send({
                    message: "SQL Error",
                    error: err
                })
            })
});

/**
 * @api {get} /chats Request to get the chats a specific user is a part of
 * @apiName GetChats
 * @apiGroup Chats
 * 
 * @apiDescription Returns the chatids of every chat the user associated with the required JWT is a part of
 * 
 * @apiHeader {String} authorization Valid JSON Web Token JWT
 *  
 * @apiSuccess {Number} rowCount the number of chat rooms returned
 * @apiSuccess {Object[]} chatRooms List of chatIds of chat rooms user is in
 * @apiSuccess {String} messages.chatId The chatid for the chat room
 * 
 * @apiError (404: Member Not Found) {String} message "Member Not Found"
 * @apiError (400: Invalid Parameter) {String} message "Malformed parameter. chatId must be a number" 
 * @apiError (400: Missing Parameters) {String} message "Missing required information"
 * 
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * 
 * @apiUse JSONError
 */ 
router.get("/", (request, response, next) => {
    //validate user exists 
    let query = 'SELECT * FROM Members WHERE MemberId=$1'
    let values = [request.decoded.memberid]

    pool.query(query, values)
        .then(result => {
            if (result.rowCount == 0) {
                response.status(404).send({
                    message: "Member Not Found"
                })
            } else {
                //user found
                next()
            }
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
}, (request, response) => {
    //Retrive the chats
    let query =  `SELECT * FROM Chats
                WHERE chatid IN (
                    SELECT DISTINCT chatid 
                    FROM ChatMembers
                    WHERE memberid=$1
                )
                GROUP BY chatid`
    let values = [request.decoded.memberid]
    pool.query(query, values)
        .then(result => {
            response.send({
                rowCount : result.rowCount,
                rows: result.rows
            })
        }).catch(err => {
            response.status(400).send({
                message: "SQL Error",
                error: err
            })
        })
});



/**
 * @api {delete} /chats/:chatId/:email Request delete a user from a chat
 * @apiName DeleteChats
 * @apiGroup Chats
 * 
 * @apiDescription Does not delete the user associated with the required JWT but 
 * instead deletes the user based on the email parameter.  
 * 
 * @apiParam {Number} chatId the chat to delete the user from
 * @apiParam {String} email the email of the user to delete
 * 
 * @apiSuccess {boolean} success true when the name is deleted
 * 
 * @apiError (404: Chat Not Found) {String} message "chatID not found"
 * @apiError (404: Email Not Found) {String} message "email not found"
 * @apiError (400: Invalid Parameter) {String} message "Malformed parameter. chatId must be a number" 
 * @apiError (400: Duplicate Email) {String} message "user not in chat"
 * @apiError (400: Missing Parameters) {String} message "Missing required information"
 * 
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * 
 * @apiUse JSONError
 */ 
router.delete("/:chatId/:email", (request, response, next) => {
    //validate on empty parameters
    if (!request.params.chatId || !request.params.email) {
        response.status(400).send({
            message: "Missing required information"
        })
    } else if (isNaN(request.params.chatId)) {
        response.status(400).send({
            message: "Malformed parameter. chatId must be a number"
        })
    } else {
        next()
    }
}, (request, response, next) => {
    //validate chat id exists
    let query = 'SELECT * FROM CHATS WHERE ChatId=$1'
    let values = [request.params.chatId]

    pool.query(query, values)
        .then(result => {
            if (result.rowCount == 0) {
                response.status(404).send({
                    message: "Chat ID not found"
                })
            } else {
                next()
            }
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
}, (request, response, next) => {
    //validate email exists AND convert it to the associated memberId
    let query = 'SELECT MemberID FROM Members WHERE Email=$1'
    let values = [request.params.email]

    pool.query(query, values)
        .then(result => {
            if (result.rowCount == 0) {
                response.status(404).send({
                    message: "email not found"
                })
            } else {
                request.params.memberid = result.rows[0].memberid
                next()
            }
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
}, (request, response, next) => {
    //validate email exists in the chat
    let query = 'SELECT * FROM ChatMembers WHERE ChatId=$1 AND MemberId=$2'
    let values = [request.params.chatId, request.params.memberid]

    pool.query(query, values)
        .then(result => {
            if (result.rowCount > 0) {
                next()
            } else {
                response.status(400).send({
                    message: "user not in chat"
                })
            }
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })

}, (request, response, next) => {
    //validate jwt matches owner of chatroom or member being deleted
    let query =  `SELECT Email FROM Chats
                    WHERE ChatId=$1`
    let values = [request.params.chatId]

    pool.query(query, values)
        .then(result => {
            if (result.rowCount == 0) {
                response.status(404).send({
                    message: "Chat ID not found"
                })
            } else {
                if (result.rows[0].email != request.decoded.email
                    && request.params.email != request.decoded.email) {
                    response.status(404).send({
                        message: "User is not owner of chat room"
                    })
                } else {
                    next()
                }
            }
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
}, (request, response) => {
    //Delete the memberId from the chat
    let insert = `DELETE FROM ChatMembers
                  WHERE ChatId=$1
                  AND MemberId=$2
                  RETURNING *`
    let values = [request.params.chatId, request.params.memberid]
    pool.query(insert, values)
        .then(result => {
            response.send({
                success: true
            })
        }).catch(err => {
            response.status(400).send({
                message: "SQL Error",
                error: err
            })
        })
    }
)

/**
 * @api {delete} /chats/:chatId Requests to delete a chat room
 * @apiName DeleteChatRoom
 * @apiGroup Chats
 * 
 * @apiDescription Removes all traces of the chat from database  
 * 
 * @apiParam {Number} chatId the chat room to delete
 * 
 * @apiSuccess {boolean} success true when the chat room is deleted
 * 
 * @apiError (404: Chat Not Found) {String} message "chatID not found"
 * @apiError (400: Invalid Parameter) {String} message "Malformed parameter. chatId must be a number" 
 * @apiError (400: Missing Parameters) {String} message "Missing required information"
 * 
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * 
 * @apiUse JSONError
 */ 
router.delete("/:chatId", (request, response, next) => {
    //validate on empty parameters
    if (!request.params.chatId) {
        response.status(400).send({
            message: "Missing required information"
        })
    } else if (isNaN(request.params.chatId)) {
        response.status(400).send({
            message: "Malformed parameter. chatId must be a number"
        })
    } else {
        next()
    }
}, (request, response, next) => {
    //validate chat id exists
    let query = 'SELECT * FROM CHATS WHERE ChatId=$1'
    let values = [request.params.chatId]

    pool.query(query, values)
        .then(result => {
            if (result.rowCount == 0) {
                response.status(404).send({
                    message: "Chat ID not found"
                })
            } else {
                next()
            }
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
}, (request, response, next) => {
    //validate jwt matches owner of chatroom
    let query =  `SELECT Email FROM Chats
                    WHERE ChatId=$1`
    let values = [request.body.chatId]

    pool.query(query, values)
        .then(result => {
            if (result.rowCount == 0) {
                response.status(404).send({
                    message: "Chat ID not found"
                })
            } else {
                if (result.rows[0].email != request.decoded.email) {
                    response.status(404).send({
                        message: "User is not owner of chat room"
                    })
                } else {
                    next()
                }
            }
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
}, (request, response, next) => {
    //Delete the respective rows from chatmembers
    let insert = `DELETE FROM ChatMembers where chatid=$1`
    let values = [request.params.chatId]
    pool.query(insert, values)
        .then(result => {
            next()
        }).catch(err => {
            response.status(400).send({
                message: "SQL Error",
                error: err
            })
        })
}, (request, response, next) => {
    //Delete the respective rows from messages
    let insert = `DELETE FROM Messages where chatid=$1`
    let values = [request.params.chatId]
    pool.query(insert, values)
        .then(result => {
            next()
        }).catch(err => {
            response.status(400).send({
                message: "SQL Error",
                error: err
            })
        })
}, (request, response) => {
    //Delete the respective rows from chats
    let insert = `DELETE FROM Chats where chatid=$1`
    let values = [request.params.chatId]
    pool.query(insert, values)
        .then(result => {
            response.send({
                success: true
            })
        }).catch(err => {
            response.status(400).send({
                message: "SQL Error",
                error: err
            })
        })
})

module.exports = router