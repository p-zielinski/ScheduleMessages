const User = require('../models/user');
const EmailValidation = require("../models/emailValidation");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sha256 = require('js-sha256');
const {createJWT} = require("../utils/auth");
const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

exports.signup = (req, res, next) => {
    let { email, password, password_confirmation } = req.body;
    let errors = [];
    if (!email) {
        errors.push({ email: "required" });
    }
    if (!emailRegexp.test(email)) {
        errors.push({ email: "invalid" });
    }
    if (!password) {
        errors.push({ password: "required" });
    }
    if (!password_confirmation) {
        errors.push({
            password_confirmation: "required",
        });
    }
    if (password != password_confirmation) {
        errors.push({ password: "mismatch" });
    }
    if (errors.length > 0) {
        return res.status(422).json({ errors: errors });
    }
    User.findOne({email: email})
        .then(user=>{
            if(user){
                return res.status(422).json({ errors: [{ user: "email already exists" }] });
            }else {
                const user = new User({
                    email: email,
                    password: password,
                });
                bcrypt.genSalt(process.env.SALT_ROUNDS, async function(err, salt) {
                    bcrypt.hash(await sha256.hmac(process.env.PRIVATE_PASSWORD_KEY, password), salt, function(err, hash) {
                        if (err) throw err;
                        user.password = hash;
                        user.save()
                            .then(response => {
                                new EmailValidation({ email:email }).save().then(() => {
                                    res.status(200).json({
                                        success: true,
                                        result: {
                                            email: response.email,
                                            status: response.status
                                        }
                                    })
                                }).catch(err =>
                                    res.status(500).json({
                                        errors: [{ error: err }]
                                    })
                                )
                            })
                            .catch(err => {
                                res.status(500).json({
                                    errors: [{ error: err }]
                                });
                            });
                    });
                });
            }
        }).catch(err =>
    {
        res.status(500).json({
            errors: [{ error: 'Something went wrong' }]
        });
    })
}

exports.signin = (req, res) => {
    let { email, password } = req.body;
    let errors = [];
    if (!email) {
        errors.push({ email: "required" });
    }
    if (!emailRegexp.test(email)) {
        errors.push({ email: "invalid email" });
    }
    if (!password) {
        errors.push({ password: "required" });
    }
    if (errors.length > 0) {
        return res.status(422).json({ errors: errors });
    }
    User.findOne({ email: email }).then(async user => {
        if (!user) {
            return res.status(404).json({
                errors: [{ user: "not found" }],
            });
        }
        else {
            bcrypt.compare(await sha256.hmac(process.env.PRIVATE_PASSWORD_KEY, password), user.password).then(isMatch => {
                if (!isMatch) {
                    return res.status(400).json({ errors: [{ password:
                                "incorrect" }]
                    });
                }
                if(isMatch && user.status==='pending'){
                    return res.status(422).json({ error: 'Please confirm your email adress' });
                }
                let access_token = createJWT(
                    user.email,
                    user._id,
                    3600
                );
                jwt.verify(access_token, process.env.TOKEN_SECRET, (err, decoded) => {
                    if (err) {
                        res.status(500).json({ erros: err });
                    }
                    if (decoded) {
                        return res.status(200).json({
                            success: true,
                            token: access_token,
                            // message: user
                        });
                    }
                });
            }).catch(err => {
                res.status(500).json({ erros: err });
            });
        }
    }).catch(err => {
        res.status(500).json({ erros: err });
    });
}

exports.confirm_email = (req, res) => {
    let activation_key, email
    if(req.query.activation_key) activation_key=req.query.activation_key
    else activation_key = req.body.activation_key;
    if(req.query.email) email=req.query.email
    else email = req.body.email;
    // let { activation_key, email } = req.body;
    let errors = [];
    if (!email) {
        errors.push({ email: "required" });
    }
    if (!emailRegexp.test(email)) {
        errors.push({ email: "invalid email" });
    }
    if (!activation_key) {
        errors.push({ activation_key: "required" });
    }
    if (errors.length > 0) {
        return res.status(422).json({ errors: errors });
    }
    EmailValidation.findOne({_id: activation_key, email: email})
        .then( result => {
            User.findOneAndUpdate({email: email}, {status: 'active'})
                .then(async user=>
                {
                    await EmailValidation.findOneAndDelete({_id: activation_key})
                        .then()
                        .catch(err => console.log(err))
                    let access_token = createJWT(
                        user.email,
                        user._id,
                        3600
                    );
                    jwt.verify(access_token, process.env.TOKEN_SECRET, (err, decoded) => {
                        if (err) {
                            res.status(500).json({ erros: err });
                        }
                        if (decoded) {
                            return res.status(200).json({
                                success: true,
                                token: access_token,
                                // message: user
                            });
                        }
                    });
                })
                .catch(err => console.log(err))
        })
        .catch(err => {
            res.status(500).json({ error: "Activation key doesn't match with this email address" });
        })
}