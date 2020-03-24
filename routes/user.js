const router = require('express').Router();
const bcrypt = require('bcrypt');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
let User = require('../models/user.modal');
var Token = require('../models/token.modal');
require('../config');

router.route('/').get((req, res) => {
    User.find()
        .then(user => res.json(user))
        .catch(error => res.status(400).json('Error', error));
});
router.route('/register').post((req, res) => {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    const newUser = new User(
        {
            email,
            username,
            password
        });

    bcrypt.hash(password, 10).then((hash, err) => {
        if (err) {
            return res.status(400).json({ status: 'error', msg: err });
        } else {
            newUser.password = hash;
            //const transporter = 
            newUser.save()
                .then((user) => {
                    //res.json('User add!!')
                    const token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

                    token.save()
                        .then(tok => {
                            const sgMail = require('@sendgrid/mail');
                            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                            let link = `http://` + req.headers.host + '/user/confirmation/' + token.token;
                            let linkDel = `http://` + req.headers.host + '/user/confirmation/delete/' + token.token + '/' + token._userId;
                            const msg = {
                                to: user.email,
                                from: 'k.warayout@gmail.com',
                                subject: 'Account Verification Token',
                                text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/user/confirmation\/' + token.token + '.\n',
                                html: `<strong>Hello Please verify your account by clicking the link:</strong>
                            <a href="${link}">link</a>\n\n<strong>If not you, please click this link</strong> <a href="${linkDel}">link</a>\n
                            <strong>We are delete this account</strong>`,
                            };
                            sgMail.send(msg);
                            res.json({ status: 'success', msg: 'A verification email has been sent to ' + user.email + '.'});
                        })
                        .catch(error => res.status(400).json({ status: 'error', msg: 'generate token error !!'}))

                })
                .catch(error => res.status(400).json({ status: 'error', msg: error.errmsg }))
        }
    });

});

router.route('/confirmation/:token').get((req, res) => {
    Token.findOne({ token: req.params.token })
        .then(token => {
            User.findOne({ _id: token._userId })
                .then(user => {
                    user.isVerified = true;
                    user.save();
                    res.send('<h1 style="textAlign: center">Verification Success </h1>');
                })
                .catch(error => res.status(400).json({ status: 'error', msg: 'Dont have this user' }));
        })
        .catch(error => res.status(400).json({ status: 'error', msg: 'token is time out please send again.' }));
});
router.route('/confirmation/delete/:token/:uid').get((req, res) => {
    Token.find({ token: req.params.token, _userId: req.params.uid })
        .then(tok => {
            User.findByIdAndDelete(uid)
                .then(user => {
                    res.json({ status: 'success', msg: user });
                })
                .catch(err => res.status(400).json({ status: 'error', msg: err }))
        })
        .catch(error => res.status(400).json({ status: 'error', msg: 'token is time out please send again..' }));
});
module.exports = router;