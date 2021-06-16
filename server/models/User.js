const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, 'is invalid'],
      index: true
    },
    password: String,
    salt: String
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator, { message: 'is already taken' });

UserSchema.methods.validPassword = function (password) {
  return (
    this.password ===
    crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
  );
};

UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.password = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex');
};

UserSchema.methods.generateJWT = function () {
  const today = new Date();
  const expire = new Date(today);
  expire.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      id: this._id,
      username: this.email,
      expire: parseInt(expire.getTime() / 1000)
    },
    process.env.SECRET
  );
};

UserSchema.methods.toAuthJSON = function () {
  return {
    id: this._id,
    email: this.email,
    token: this.generateJWT()
  };
};

UserSchema.methods.toProfileJSONFor = function () {
  return {
    email: this.email,
    createdAt: this.createdAt
  };
};

mongoose.model('User', UserSchema);
