const {SHA256} = require('crypto-js');

const jwt = require('jsonwebtoken');

let data = {
    id: 10
}

let token = jwt.sign(data, 'abc123')

// the verify func verified that the token was not changed
let decoded = jwt.verify(token, 'abc123')
// let badDecoded = jwt.verify(token + 1, 'abc123')

console.log(token);
console.log(decoded);
// shows invalid signature error since it was attempted to change
// console.log(badDecoded);



// let message = 'I am user number 3',
//     // hash can be used to save passwords in db's
//     hash = SHA256(message).toString();

// console.log(`Message ${message}`);
// console.log(`Hash: ${hash}`);    

// let data = {
//     id: 4
// }

// let token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }

// // if someone tried to change the hash to hack it
// // that's why we add secret key
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

// // called json web token (JWT)
// let resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if (resultHash == token.hash) {
//     console.log('Data was not changes');
// } else {
//     console.log('Data was changed do not trust!');
// }
