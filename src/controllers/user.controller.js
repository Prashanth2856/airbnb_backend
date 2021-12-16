const express = require("express");

const router = express.Router();
const { body, validationResult } = require("express-validator");

const User = require("../models/user.model");

// Creating a user

router.post(
    "/",
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email should be a valid email"),
    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/)
        .withMessage(
            "Invalid Password!"
        )
        .isLength({ min: 8, max: 20 })
        .withMessage("Password should be 8-20 characters long"),

    async (req, res) => {
        const errors = validationResult(req);

        let finalErrors = null;
        if (!errors.isEmpty()) {
            finalErrors = errors.array().map((error) => {
                return {
                    param: error.param,
                    msg: error.msg,
                };
            });
            return res.status(201).send({ errors: JSON.stringify(finalErrors) });
        }
        try {
            const user = await User.create(req.body);

            return res.status(201).json({ user });
        } catch (err) {
            res.status(400).send({ err: err.message });
        }
    }
);

router.get("/", async (req, res) => {
    console.log(Object.keys(req.headers));
    let users = await User.find().lean().exec();
    res.status(200).send({ users });
});

// Getting a user by id

router.get("/:id", async (req, res) => {
    let user = await User.findById(req.params.id).lean().exec();
    res.status(200).send({ user });
});

// Updating a user by id

router.patch("/:id", async (req, res) => {
    let user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });

    res.status(200).send({ user });
});

// Deleting a user by id

router.delete("/:id", async (req, res) => {
    let user = await User.findByIdAndDelete(req.params.id);
    res.status(200).send({ user });
});
module.exports = router;