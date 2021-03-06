// User's schema
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        required: true,
    },
    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    street: {
        type: String,
    },
    zipCode: {
        type: String,
    },
    town: {
        type: String,
    },
    country: {
        type: String,
    },
    orderHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
        },
    ],
});

// middleware/ new user only
UserSchema.pre("save", function (next) {
    if (!this.isModified("password")) next();
    bcrypt.hash(this.password, 10, (err, passwordHashed) => {
        if (err) return next(err);
        this.password = passwordHashed;
        next();
    });
});

// compare password, if the password exists in the db
UserSchema.methods.comparePassword = function (password, cb) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if (err) {
            return cb(err);
        } else {
            if (!isMatch) return cb(null, isMatch);
            return cb(null, this);
        }
    });
};

module.exports = mongoose.model("User", UserSchema); 
