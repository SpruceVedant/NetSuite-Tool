const express = require('express');
const axios = require('axios');
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');

const app = express();
const port = 3000;

// NetSuite OAuth credentials
const consumerKey = 'a3352c15dae2741f320b87bedb078952c13064e28f854b4655df0cffcadb1c2c';
const consumerSecret = '5bb481b7b4b67c3bd1b00e92caaf0a7195f9a9410286ed614e59f71166af26ae';
const token = '1d947dcd9423f8fb2c1fca69fa30b3c84e41e7082d26bca3bc321fe2145a1d51';
const tokenSecret = 'bf38fe3351af4bdd3c314745c000761f2463957fb9187c1fd412d11b17e98f1d';

// NetSuite RESTlet URL
const restletUrl = 'https://td2929968.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=810&deploy=1';

// Initialize OAuth 1.0aAAAAAAAAAAAAAAAAA
const oauth = OAuth({
    consumer: { key: consumerKey, secret: consumerSecret },
    signature_method: 'HMAC-SHA256',
    hash_function(base_string, key) {
        return crypto.createHmac('sha256', key).update(base_string).digest('base64');
    }
});

const request_data = {
    url: restletUrl,
    method: 'GET'
};

const token_data = {
    key: token,
    secret: tokenSecret
};

app.get('/data', (req, res) => {
    const oauthHeaders = oauth.toHeader(oauth.authorize(request_data, token_data));

    axios({
        url: request_data.url,
        method: request_data.method,
        headers: {
            ...oauthHeaders,
            'Content-Type': 'application/json',
            'Authorization': `${oauthHeaders.Authorization}, realm="TD2929968"`
        }
    })
    .then(response => {
        res.json(response.data);
    })
    .catch(error => {
        console.error('Error fetching data:', error.response ? error.response.data : error.message);
        if (error.response) {
            res.status(error.response.status).send(`Error: ${error.response.status} - ${error.response.data}`);
        } else {
            res.status(500).send(`Error: ${error.message}`);
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
