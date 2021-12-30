const { sign, decode } = require('jsonwebtoken');
const { compareSync, hashSync } = require('bcrypt');
const { myChain } = require('../blockchain/blockchain.service');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
require('dotenv').config();

const User = require('../../models/user');
const { Transaction } = require('../blockchain/blockchain');

const minerWalletAddress = ec.genKeyPair().getPublic('hex');

module.exports = {
    createUser: async (req, res) => {
        // console.log(req.body);
        const { username, password, email } = req.body;

        if (!username || !password || !email)
            return res.status(400).json({
                error: true,
                msg: 'Username and password are both required!',
            });

        const key = ec.genKeyPair();
        const usersWalletAddress = key.getPublic('hex');
        const privateKey = key.getPrivate('hex');

        const tx = new Transaction('system', usersWalletAddress, 1500);

        try {
            myChain.addTransaction(tx);
            myChain.minePendingTransactions(minerWalletAddress);
        } catch (e) {
            return res.status(400).json({ err: true, message: e.message });
        }

        const hashedPassword = hashSync(password, 10);

        const user = new User({
            username,
            password,
            email,
            publicKey: usersWalletAddress,
            privateKey,
        });

        const token = sign({ ...user._doc }, process.env.JWT_SECRET, {
            expiresIn: '10h',
        });

        user.password = hashedPassword;

        try {
            await user.save();
            res.status(201).json({ user, token });
        } catch (e) {
            res.status(500).json({ error: true, msg: e.message });
        }
    },
    // register method for wsdl
    registerWsdl: async (args) => {
        const username = args.username;
        const password = args.password;
        const email = args.email;
        // console.log('wsdl service running');
        const userArgs = [username, password, email];

        const user = new User({ username, password, email });
        try {
            await user.save();
            return userArgs;
        } catch (error) {
            return error;
        }
    },
    logUserIn: async (req, res) => {
        // console.log(JSON.stringify(req.body));
        if (req.user)
            return res.status(400).json({
                error: true,
                message: 'There is already a logged in user!',
            });

        const { username, password } = req.body;

        if (!username || !password)
            return res
                .status(401)
                .json({ error: true, msg: 'Incorrect credentials!' });

        try {
            const user = await User.findOne({ username }).exec();

            if (!user)
                return res.status(401).json({
                    err: true,
                    msg: 'Your credentials are incorrect!',
                });

            const isPasswordMatch = compareSync(password, user.password);

            if (!isPasswordMatch)
                return res.status(400).json({
                    error: true,
                    message: 'Your credentials are incorrect!',
                });

            const token = sign({ ...user._doc }, process.env.JWT_SECRET, {
                expiresIn: '10h',
            });

            await user.save();
            res.status(200).json({ user, token });
        } catch (err) {
            res.status(500).json({ error: true, message: err.message });
        }
    },
    logUserOut: async (req, res) => {
        const decodedUser = decode(req.token);

        try {
            let user = await User.findById(decodedUser._doc._id).exec();

            if (!user)
                return res.status(400).json({
                    error: true,
                    message: 'There is no registered user with this username!',
                });

            req.user = null;
            res.status(200).json({ message: 'Succesfully logged out...!' });
        } catch (err) {
            res.status(500).json({ error: true, message: err.message });
        }
    },
};
