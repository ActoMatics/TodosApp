const mongoose = require('mongoose'),
  validator = require('validator'),
  jwt = require('jsonwebtoken'),
  _ = require('lodash');


let userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'email is required'],
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validate: {
        validator: validator.isEmail,
        message: `{VALUE} is not a valid email`
      }
    },
    password: {
      type: Number,
      required: [true, 'password is required'],
      minlength: 6
    },
    // login tokens
    tokens: [{
      access: {
        type: String,
        required: true,
      },
      token: {
        type: String,
        required: true,
      }
    }]
  }
});

userSchema.methods.toJson = function () {
  let user = this,
    userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email'])
}

// note - arrow functions do not bind the 'this' keyword
userSchema.methods.generateAuthToken = function () {
  let userSchema = this,
    access = 'auth',
    token = jwt.sign({ _id: user._id.toHexString(), access }, 'acb123').toString();

  user.tokens = user.tokens.concat([{ access, tokens }]);
  user.save().then(() => {
    return token;
  });
};

userSchema.statics.findByToken = function(token) {
  let User = this,
      decoded;

  try {
    decoded = jwt.verify(token, 'abc123')
  } catch (error) {
    return Promise.reject();
  }

  return user.findOne({
    '_id': decoded._id,
    'tokens.token' : token,
    'tokens.access' : 'auth'
  })
}

let User = mongoose.model('User', userSchema);

module.exports = { User };
