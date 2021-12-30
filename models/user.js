const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: (input) => {
            if (
                !/^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/.test(
                    input
                )
            ) {
                return 'Invalid username!';
            }
        },
    },
    password: {
        type: String,
        trim: true,
        required: true,
        validate: (input) => {
            if (
                !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,40}$/.test(
                    input
                )
            ) {
                return 'Password should include at least one letter, one number, one special character(symbol) and should be 8-40 characters long';
            }
        },
    },
    email: {
        type: String,
        trim: true,
        required: true,
        validate: (input) => {
            if (!/^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/.test(input)) {
                return 'Invalid e-mail!';
            }
        },
    },
    privateKey: String,
    publicKey: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
