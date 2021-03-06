const express = require("express");
const orderRouter = express.Router();
const passport = require("passport");
const passportConfig = require("../passport");
const Order = require("../models/Order");
const User = require("../models/User");
const { orderConfirmed } = require("../services/emailService");

// add new order
orderRouter.post("/neworder", (req, res) => {
    console.log(req.body);
    const newOrder = new Order(req.body);
    newOrder.save((err) => {
        if (err) {
            res.status(500).json({
                message: {
                    msgBody: "An error occurred while adding order",
                    msgError: true
                }
            });
        } else {
            if (req.body.userId) {
                User.findById({ _id: req.body.userId }, (err, user) => {
                    if (err) {
                        res.status(500).json({
                            message: {
                                msgBody: "An error occurred while retrieving user",
                                msgError: true
                            }
                        });
                    } else {
                        user.orderHistory.push(newOrder);
                        user.save((err) => {
                            if (err) {
                                res.status(500).json({
                                    message: {
                                        msgBody: "An error occurred while adding order to your order history",
                                        msgError: true,
                                    }
                                });
                            } else {
                                res.status(201).json({
                                    message:
                                    {
                                        msgBody: "Successfully created order and put it in your order history",
                                        msgError: false
                                    }
                                });
                                orderConfirmed(req.body);
                            }
                        });
                    }
                });
            } else {
                res.status(201).json({
                    message:
                    {
                        msgBody: "Successfully created order",
                        msgError: false
                    }
                });
                orderConfirmed(req.body);
            }
        }
    });
});

// get all orders (for admin only)
orderRouter.get("/getorders", passport.authenticate("admin-rule", { session: false }), (req, res) => {
    Order.find({}, (err, orders) => {
        if (err) {
            res.status(500).json({
                message: {
                    msgBody: "An error occured while retrieving orders",
                    msgError: true
                }
            });
        } else {
            res.status(200).json({
                orders,
                message: {
                    msgBody: "Successfully retrieved orders",
                    msgError: false
                }
            });
        }
    });
});

// update specific order/handle(for admin only)
orderRouter.put("/handleorder/:id",
    passport.authenticate("admin-rule", { session: false }),
    (req, res) => {
        Order.findByIdAndUpdate({ _id: req.params.id }, { handled: req.body.handled }, (err) => {
            if (err) {
                res.status(500).json({
                    msg: {
                        msgBody: "An error occured while handling order",
                        msgError: true
                    }
                });
            } else {
                res.status(200).json({
                    msg: {
                        msgBody: "Successfully handled order",
                        msgError: false
                    }
                });
            }
        });
    });

// delete order only admin
orderRouter.delete("/deleteorder/:id",
    passport.authenticate("admin-rule", { session: false }),
    (req, res) => {
        Order.findByIdAndDelete({ _id: req.params.id },
            (err) => {
                if (err) {
                    res.status(500).json({
                        msg: {
                            msgBody: "An error occured while deleting order",
                            msgError: true
                        }
                    });
                } else {
                    res.status(200).json({
                        msg: {
                            msgBody: "Successfully deleted order",
                            msgError: false
                        }
                    });
                }
            });
    });

module.exports = orderRouter;