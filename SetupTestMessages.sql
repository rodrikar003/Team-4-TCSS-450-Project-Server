--Remove all members from all chats
DELETE FROM ChatMembers;

--Remove all messages from all chats
DELETE FROM Messages;

--Remove all chats
DELETE FROM Chats;

-- --Remove the user test1
-- DELETE FROM Members 
-- WHERE Email='test1@test.com';

-- --Add the User test1  (password is: test12345)
-- INSERT INTO 
--     Members(FirstName, LastName, Username, Email, Password, Salt)
-- VALUES
--     ('test1First', 'test1Last', 'test1', 'test1@test.com', 'aafc93bbad0671a0531fa95168c4691be3a0d5e033c33a7b8be9941d2702e566', '5a3d1d9d0bda1e4855576fe486c3a188e14a3f1a381ea938cacdb8c799a3205f');

-- --Remove the user test2
-- DELETE FROM Members 
-- WHERE Email='test2@test.com';

-- --Add the User test2  (password is: test12345)
-- INSERT INTO 
--     Members(FirstName, LastName, Username, Email, Password, Salt)
-- VALUES
--     ('test2First', 'test2Last', 'test2', 'test2@test.com', 'aafc93bbad0671a0531fa95168c4691be3a0d5e033c33a7b8be9941d2702e566', '5a3d1d9d0bda1e4855576fe486c3a188e14a3f1a381ea938cacdb8c799a3205f');

-- --Remove the user test3
-- DELETE FROM Members 
-- WHERE Email='test3@test.com';

-- --Add the User test3 (password is: test12345)
-- INSERT INTO 
--     Members(FirstName, LastName, Username, Email, Password, Salt)
-- VALUES
--     ('test3First', 'test3Last', 'test3', 'test3@test.com', 'aafc93bbad0671a0531fa95168c4691be3a0d5e033c33a7b8be9941d2702e566', '5a3d1d9d0bda1e4855576fe486c3a188e14a3f1a381ea938cacdb8c799a3205f');

--Create Global Chat room, ChatId 1
INSERT INTO
    chats(ChatId, name, Email)
VALUES
    (1, 'Global Chat 1', 'test1@test.com')
RETURNING *;

--Add the three test users to Global Chat
INSERT INTO 
    ChatMembers(ChatId, MemberId)
SELECT 1, Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
    OR Members.Email='test2@test.com'
    OR Members.Email='test3@test.com'
RETURNING *;

--Add Multiple messages to create a conversation
INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'Hello Everyone!',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'hi',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'Hey Test1, how is it going?',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'Great, thanks for asking t3',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'Enough with the pleasantries',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'Lets get down to business',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'CHILL out t3 lol',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'OK ok. T2, what did you do since the last meeting?',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'Nothing.',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'Im completly blocked by t3',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'Get your act together and finish the messaging end points',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'Woah now. Im waiting on t1...',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'I had a mid-term. :-(',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;


INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'But lets keep this cordial please',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'So, t2, t3 is blocking you',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    '...and Im blocking t3',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'sounds like you get another day off.',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'Nope. Im just going to do all the work myself',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'No way am I going to fail because fo you two. ',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'Ok ok. No. Charles wont be happy with that.',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'My exam is over now. Ill get cracking on this thing',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'I can knoock it out tonight',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'If I get it by tmorrow AM',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'i can finish by the aftershock',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'aftershock',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'afternoon!!! stupid autocorrect',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'Sounds like a plan',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'lets do it',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'lets dooooooo it',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    '3 2 1 Break',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    1, 
    'l8r',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

--Create Global Chat room, ChatId 2
INSERT INTO
    chats(ChatId, name, Email)
VALUES
    (2, 'Global Chat 2', 'test2@test.com')
RETURNING *;

--Add the three test users to Global Chat
INSERT INTO 
    ChatMembers(ChatId, MemberId)
SELECT 2, Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
    OR Members.Email='test2@test.com'
    OR Members.Email='test3@test.com'
RETURNING *;

--Add Multiple messages to create a conversation
INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    2, 
    'Hello Everyone!',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    2, 
    'hi',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    2, 
    'Hey Test1, how is it going?',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    2, 
    'Great, thanks for asking t3',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    2, 
    'Enough with the pleasantries',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    2, 
    'Lets get down to business',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    2, 
    'CHILL out t3 lol',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    2, 
    'OK ok. T2, what did you do since the last meeting?',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    2, 
    'Nothing.',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    2, 
    'Im completly blocked by t3',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    2, 
    'Get your act together and finish the messaging end points',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    2, 
    'Woah now. Im waiting on t1...',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    2, 
    'I had a mid-term. :-(',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;


INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    2, 
    'But lets keep this cordial please',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    2, 
    'So, t2, t3 is blocking you',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    2, 
    '...and Im blocking t3',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    2, 
    'sounds like you get another day off.',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    2, 
    'Nope. Im just going to do all the work myself',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    2, 
    'No way am I going to fail because fo you two. ',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    2, 
    'Ok ok. No. Charles wont be happy with that.',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    2, 
    'My exam is over now. Ill get cracking on this thing',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    2, 
    'I can knoock it out tonight',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    2, 
    'If I get it by tmorrow AM',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    2, 
    'i can finish by the aftershock',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    2, 
    'aftershock',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    2, 
    'afternoon!!! stupid autocorrect',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    2, 
    'Sounds like a plan',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    2, 
    'lets do it',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    2, 
    'lets dooooooo it',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    2, 
    '3 2 2 Break',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    2, 
    'l8r',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

--Create Global Chat room, ChatId 3
INSERT INTO
    chats(ChatId, name, Email)
VALUES
    (3, 'Global Chat 3', 'test3@test.com')
RETURNING *;

--Add the three test users to Global Chat
INSERT INTO 
    ChatMembers(ChatId, MemberId)
SELECT 3, Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
    OR Members.Email='test2@test.com'
    OR Members.Email='test3@test.com'
RETURNING *;

--Add Multiple messages to create a conversation
INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    3, 
    'Hello Everyone!',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    3, 
    'hi',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    3, 
    'Hey Test1, how is it going?',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    3, 
    'Great, thanks for asking t3',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    3, 
    'Enough with the pleasantries',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    3, 
    'Lets get down to business',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    3, 
    'CHILL out t3 lol',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    3, 
    'OK ok. T2, what did you do since the last meeting?',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    3, 
    'Nothing.',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    3, 
    'Im completly blocked by t3',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    3, 
    'Get your act together and finish the messaging end points',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    3, 
    'Woah now. Im waiting on t1...',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    3, 
    'I had a mid-term. :-(',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;


INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    3, 
    'But lets keep this cordial please',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    3, 
    'So, t2, t3 is blocking you',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    3, 
    '...and Im blocking t3',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    3, 
    'sounds like you get another day off.',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    3, 
    'Nope. Im just going to do all the work myself',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    3, 
    'No way am I going to fail because fo you two. ',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    3, 
    'Ok ok. No. Charles wont be happy with that.',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    3, 
    'My exam is over now. Ill get cracking on this thing',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    3, 
    'I can knoock it out tonight',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    3, 
    'If I get it by tmorrow AM',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    3, 
    'i can finish by the aftershock',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    3, 
    'aftershock',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    3, 
    'afternoon!!! stupid autocorrect',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    3, 
    'Sounds like a plan',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    3, 
    'lets do it',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    3, 
    'lets dooooooo it',
    Members.MemberId
FROM Members
WHERE Members.Email='test1@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    3, 
    '3 2 3 Break',
    Members.MemberId
FROM Members
WHERE Members.Email='test3@test.com'
RETURNING *;

INSERT INTO 
    Messages(ChatId, Message, MemberId)
SELECT 
    3, 
    'l8r',
    Members.MemberId
FROM Members
WHERE Members.Email='test2@test.com'
