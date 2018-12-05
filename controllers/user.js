const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res, next) => {
    try {
        let hash = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            email: req.body.email,
            password: hash,
        });
        let result = await user.save();
        res.status(201).json({
            message: 'User created',
            result: result
        })
    } catch (e) {
        res.status(500).json({
            message: `Invalid authentication credentials! ${e}`
        })
    }
};

exports.userLogin = async (req, res, next) => {
    try {
        let fetchedUser;
        let user = await User.findOne({email: req.body.email});
        if (!user) {
            return res.status(401).json({
                message: 'Auth failed'
            })
        }
        fetchedUser = user;
        let result = await bcrypt.compare(req.body.password, user.password);
        if (!result) {
            return res.status(401).json({
                message: 'Auth failed'
            })
        }
        const token = jwt.sign({
                email: fetchedUser.email,
                userId: fetchedUser._id
            }, process.env.JWT_KEY,
            {expiresIn: "1h"}
        );
        res.status(200).json({
            token: token,
            expiresIn: 3600,
            userId: fetchedUser._id
        });
    } catch (e) {
        return res.status(401).json({
            message: `Invalid authentication credentials! ${e}`
        })
    }
};
