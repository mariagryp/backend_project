// APi:er for products
const express = require("express");
const productRouter = express.Router();
const passport = require("passport");
const Product = require("../models/Product");
const passportConfig = require("../passport");

// add product(only for "admin"-role)
productRouter.post("/newproduct",
    passport.authenticate("admin-rule", { session: false }),
    (req, res) => {
        const { name, description, price } = req.body;
        console.log(req.body);
        const newProduct = new Product({
            name, description, price
        });
        newProduct.save((err) => {
            if (err) {
                res.status(500).json({
                    msg: {
                        msgBody: "An error occured", msgError: true
                    }
                });
            } else {
                res.status(201).json({ msg: { msgBody: "Successfully added product", msgError: false } });
            }
        });
    });

// collect/get products (for all roles )
productRouter.get("/allproducts", (req, res) => {
    Product.find({}, (err, products) => {
        if (err) {
            res.status(500).json({
                msg: {
                    msgBody: "An error occured",
                    msgError: true
                }
            });
        } else {
            res.status(200).json({
                products,
                msg: { msgBody: " Successfully retrieved products", msgError: false }
            });
        }
    });
});

// update products (for "admin" role)
productRouter.put("/updateproduct/:id", passport.authenticate("admin-rule", { session: false }),
    (req, res) => {
        const { name, description, price } = req.body;
        Product.findByIdAndUpdate({ _id: req.params.id }, { name, description, price }, (err) => {
            if (err) {
                res.status(500).json({
                    msg: { msgBody: "An error occured while updating a product", msgError: true }
                });
            } else {
                res.status(200).json({
                    msg: {
                        msgBody: "Successfully updated a product", msgError: false
                    }
                });
            }
        });
    });

// delete product (only for "admin" role)
productRouter.delete("/deleteproduct/:id", passport.authenticate("admin-rule", { session: false }),
    (req, res) => {
        Product.findByIdAndDelete({ _id: req.params.id }, (err) => {
            if (err) {
                res.status(500).json({
                    msg: {
                        msgBody: "An error occured", msgError: true
                    }
                });
            } else {
                res.status(200).json({
                    msg: {
                        msgBody: "Product was successfully deleted", msgError: false
                    }
                });
            }
        });
    });



module.exports = productRouter;
