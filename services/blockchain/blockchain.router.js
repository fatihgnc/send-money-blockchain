const router = require('express').Router();
const {
    getTransactionsOfUser,
    getTheBalanceOfTheUser,
    getAllTransactions,
    sendMoney,
    checkChainValidity,
    getBlockCount,
    getTransactionCount,
} = require('./blockchain.service');
const checkAuthToken = require('../../auth/auth');

router.get('/transactions', checkAuthToken, getTransactionsOfUser);
router.get('/allTransactions', checkAuthToken, getAllTransactions);
router.get('/getBalance', checkAuthToken, getTheBalanceOfTheUser);
router.get('/getChainValidity', checkAuthToken, checkChainValidity);
router.get('/getBlockCount', checkAuthToken, getBlockCount);
router.get('/getTransactionCount', checkAuthToken, getTransactionCount);
router.post('/sendMoney', checkAuthToken, sendMoney);

module.exports = router;
