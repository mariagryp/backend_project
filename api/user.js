const express = require("express");
const userRouter = express.Router();
const passport = require("passport");
const passportConfig = require("../passport");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// development env vars
require("dotenv").config();

// function that creates our json web token (cookie) which we use in "log in" endpoint
const signToken = (userId) => {
    return jwt.sign({
        iss: "MariaGR",
        sub: userId,
    },
        process.env.JWT_SECRET, {
        expiresIn: 60 * 60 * 24,
    });
};

/* ------- Endpoints ------- */

//endpoint to save/create/register new user to database
userRouter.post("/register",
    (req, res) => {
        const { username, password, role } = req.body;
        User.findOne({ username }, (err, user) => {
            if (err) {
                res.status(500).json({ msg: { msgBody: "Error", msgError: true } });
            }
            if (user) {
                res.status(400).json({ msg: { msgBody: "Username already taken", msgError: true } });
            } else {
                const newUser = new User({ username, password, role });
                newUser.save((err) => {
                    if (err) {
                        res.status(500).json({ msg: { msgBody: "Error", msgError: true } });
                    } else {
                        res.status(201).json({ msg: { msgBody: "User Successfully created", msgError: false } });
                    }
                });
            }
        });
    });

// endpoint to login a user
userRouter.post("/login",
    passport.authenticate("local", { session: false }),
    (req, res) => {
        if (req.isAuthenticated()) {
            const { _id, username, role } = req.user;
            const token = signToken(_id);
            res.cookie("access-token", token, { httpOnly: true, sameSite: true });
            res.status(200).json({
                isAuthenticated: true,
                user: { _id, username, role },
                msg: {
                    msgBody: "User successfully logged in",
                    msgError: false
                }
            });
        }
    });

// endpoint to check whether a user is logged in/authenticated
userRouter.get("/authenticated",
    passport.authenticate("user-rule", { session: false }),
    (req, res) => {
        const { _id, username, role, firstname, lastname, email, phone, street, zipCode, town, country } = req.user;
        res.status(200).json({
            isAuthenticated: true,
            user: { _id, username, role, firstname, lastname, email, phone, street, zipCode, town, country },
        });
    });

//endpoint to logout a user(first chekin' whether a user is logged with help of jwt)
userRouter.get("/logout",
    passport.authenticate("user-rule", { session: false }),
    (req, res) => {
        res.clearCookie("access-token");
        res.status(200)
            .json({ message: { msgBody: "A user successfully logged out", msgError: true } });
    });

// update user 
userRouter.put("/update/:id", passport.authenticate("user-rule", { session: false }),
    (req, res) => {
        const { firstname, lastname, email, phone, street, zipCode, town, country } = req.body;
        User.findByIdAndUpdate({ _id: req.params.id },
            { firstname, lastname, email, phone, street, zipCode, town, country },
            (err) => {
                if (err) {
                    res.status(500).json({
                        msg: {
                            msgBody: "An error occured while updating your account",
                            msgError: true
                        },
                    });
                } else {
                    res.status(200).json({
                        msg: {
                            msgBody: "Successfully updated account",
                            msgError: false
                        }
                    });
                }
            });
    });

// delete user (admin only)
userRouter.delete("/deleteuser/:id",
    passport.authenticate("admin-rule", { session: false }),
    (req, res) => {
        User.findByIdAndDelete({ _id: req.params.id },
            (err) => {
                if (err) {
                    res.status(500).json({
                        msg: {
                            msgBody: "An error occured while deleting a user",
                            msgError: true
                        }
                    });
                } else {
                    res.status(200).json({
                        msg: {
                            msgBody: "Successfully deleted user",
                            msgError: false
                        }
                    });
                }
            });
    }
);


// get order history
userRouter.get("/getorderhistory",
    passport.authenticate("user-rule", { session: false }),
    (req, res) => {
        User.findById({ _id: req.user._id })
            .populate("orderHistory")
            .exec((err, user) => {
                if (err) {
                    res.status(500).json({ msg: { msgBody: "An error occured retrieving history", msgError: true } });
                } else {
                    res.status(200).json({
                        orderHistory: user.orderHistory,
                        message: {
                            msgBody: "Successfully retrieved order history",
                            msgError: false,
                        },
                    });
                }
            });
    });

module.exports = userRouter;