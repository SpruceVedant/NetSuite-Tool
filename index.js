const axios = require('axios');
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');

// NetSuite OAuth credentials
const consumerKey = '';
const consumerSecret = '';
const token = '';
const tokenSecret = '';

// NetSuite RESTlet URL
const restletUrl = 'https://td2929968.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=810&deploy=1';

// Initialize OAuth 1.0a
const oauth = OAuth({
    consumer: { key: consumerKey, secret: consumerSecret },
    signature_method: 'HMAC-SHA256',
    hash_function(base_string, key) {
        return crypto.createHmac('sha256', key).update(base_string).digest('base64');
    }
});

// OAuth request data
const request_data = {
    url: restletUrl,
    method: 'GET'
};

// OAuth token
const token_data = {
    key: token,
    secret: tokenSecret
};

// Generate OAuth headers
const oauthHeaders = oauth.toHeader(oauth.authorize(request_data, token_data));

// Make the request
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
    console.log('Data fetched successfully:', response.data);
})
.catch(error => {
    console.error('Error fetching data:', error.response ? error.response.data : error.message);
});
