const mongoose = require('mongoose'),
  validator = require('validator'),
  jwt = require('jsonwebtoken'),
  _ = require('lodash'),
  bcrypt = require('bcryptjs');


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

userSchema.statics.findByToken = function (token) {
  let User = this,
    decoded;

  try {
    decoded = jwt.verify(token, 'abc123')
  } catch (error) {
    return Promise.reject();
  }

  return user.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  })
}

userSchema.statics.findByCredentials = function (email, password) {
  let User = this;
  
  return User.findOne({email})
  .then(user => {
    if(!user){
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if(res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
}

userSchema.pre('save', function (next) {
  let user = this;

  if (user.isModified('password')) {

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });

  } else {
    next();
  }
});

let User = mongoose.model('User', userSchema);

module.exports = { User };
