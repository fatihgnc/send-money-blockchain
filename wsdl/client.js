var soap = require('soap');
var url = 'http://localhost:8000/wsdl?wsdl';

soap.createClient(url, (err, client) => {
    if (err) {
        console.log(err);
        return err;
    }

    const args = {
        username: 'admin_fatih2',
        password: 'fatih123456!',
        email: 'fatihgenc@gmail.com',
    };

    client.register(args, function (err, res) {
        if (err) {
            console.log(err);
            throw err;
        }
        console.log(res);
    });
});
