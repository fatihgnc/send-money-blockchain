const { Blockchain, Transaction } = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myChain = new Blockchain();

const minerWalletAddress = ec.genKeyPair().getPublic('hex');

module.exports = {
    myChain,
    getTransactionsOfUser: (req, res) => {
        const { publicKey: walletAddress } = req.user;

        const transactions = myChain.getAllTransactionsForWallet(walletAddress);

        if (!transactions) {
            return res
                .status(200)
                .json({ message: 'you dont have any transactions' });
        }

        res.status(200).json({ transactions });
    },
    sendMoney: (req, res) => {
        const { publicKey: walletAddress, privateKey } = req.user;
        const { amount, toAddress } = req.body;

        const signingKey = ec.keyFromPrivate(privateKey);

        const tx = new Transaction(walletAddress, toAddress, amount);

        try {
            tx.signTransaction(signingKey);
            myChain.addTransaction(tx);
            myChain.minePendingTransactions(minerWalletAddress);
            res.status(201).json({
                message: 'Transaction successfully added!',
            });
        } catch (e) {
            res.status(400).json({ err: true, message: e.message });
        }
    },
    getTheBalanceOfTheUser: (req, res) => {
        console.log(req.user);
        const { publicKey: walletAddress } = req.user;

        const balance = myChain.getBalanceOfAddress(walletAddress);

        res.json({ balance });
    },
    getAllTransactions: (req, res) => {
        const transactions = [];

        for (const block of myChain.chain) {
            for (const tx of block.transactions) {
                transactions.push(tx);
            }
        }

        res.status(200).json({ transactions });
    },
    checkChainValidity: (req, res) => {
        const validity = myChain.isChainValid();
        res.status(200).json({ isValid: validity });
    },
    getBlockCount: (req, res) => {
        const blockCount = myChain.chain.length;
        res.status(200).json({ blockCount });
    },
    getTransactionCount: (req, res) => {
        let transactionCount = 0;

        for (const block of myChain.chain) {
            transactionCount += block.transactions.length;
        }

        res.status(200).json({ transactionCount });
    },
};
