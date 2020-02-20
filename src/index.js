import request from "request";

class SnovIO{
    constructor(apiUserID, apiSecret){
        this.apiUserID = apiUserID;
        this.apiSecret = apiSecret;
        this.accessToken = "";
    }

     /**
     * hp's http_build_query() in javascript
     *
     * @see https://locutus.io/php/url/http_build_query/
     * @param string domain 
     */
    buildQuery(formdata, numericPrefix, argSeparator, encType){
        var encodeFunc

        switch (encType) {
            case 'PHP_QUERY_RFC3986':
            encodeFunc = require('../url/rawurlencode')
            break

            case 'PHP_QUERY_RFC1738':
            default:
            encodeFunc = function(str){
                str = (str + '')

                return encodeURIComponent(str)
                    .replace(/!/g, '%21')
                    .replace(/'/g, '%27')
                    .replace(/\(/g, '%28')
                    .replace(/\)/g, '%29')
                    .replace(/\*/g, '%2A')
                    .replace(/~/g, '%7E')
                    .replace(/%20/g, '+')
            }
            break
        }

        var value
        var key
        var tmp = []

        var _httpBuildQueryHelper = function (key, val, argSeparator) {
            var k
            var tmp = []
            if (val === true) {
            val = '1'
            } else if (val === false) {
            val = '0'
            }
            if (val !== null) {
            if (typeof val === 'object') {
                for (k in val) {
                if (val[k] !== null) {
                    tmp.push(_httpBuildQueryHelper(key + '[' + k + ']', val[k], argSeparator))
                }
                }
                return tmp.join(argSeparator)
            } else if (typeof val !== 'function') {
                return encodeFunc(key) + '=' + encodeFunc(val)
            } else {
                throw new Error('There was an error processing for http_build_query().')
            }
            } else {
            return ''
            }
        }

        if (!argSeparator) {
            argSeparator = '&'
        }
        for (key in formdata) {
            value = formdata[key]
            if (numericPrefix && !isNaN(key)) {
            key = String(numericPrefix) + key
            }
            var query = _httpBuildQueryHelper(key, value, argSeparator)
            if (query !== '') {
            tmp.push(query)
            }
        }

        return tmp.join(argSeparator)
    }

    /**
     * You need to generate an access token to authenticate future requests. 
     * When making a request, please specify this access token in the Authorization field.
     *
     * @see https://snov.io/api#Authentification
     */
    getAccessToken(){
        return new Promise((resolve, reject) => {
            if(this.accessToken) resolve(this.accessToken)
            else{
                request.post({
                    url: 'https://app.snov.io/oauth/access_token',
                    json: {
                        grant_type: 'client_credentials',
                        client_id: this.apiUserID,
                        client_secret: this.apiSecret,
                    }
                }, (err, res, body) => {
                    if(err) reject(err);
                    else if(body.access_token){
                        this.accessToken = body.access_token;
                        resolve(body.access_token);
                    } 
                    else reject("Couln't validate the API User ID and/or API Secret.");
                });
            }            
        });
    }

    /**
     * With this API method, you can find out the number of email addresses from a certain domain in our database. 
     * It`s completely free, so you don`t need credits to use it!
     *
     * @see https://snov.io/api#EmailCount
     * @param string domain 
     */
    getEmailCount(domain){
        return new Promise(async (resolve, reject) => {
            try{
                const token = await this.getAccessToken();

                request.post({
                    url: 'https://app.snov.io/restapi/get-domain-emails-count',
                    json: {
                        access_token: token,
                        domain: domain
                    }
                }, (err, res, body) => {
                    if(err) reject(err);
                    else if (res && res.statusCode === 200) resolve(body.result);
                    else reject("Error to call getEmailCount");
                });
            }
            catch(err){
                reject(err);
            }
        });             
    }

    /**
     * Enter a domain name and Snov.io will return all the email addresses on the domain. If there is any 
     * additional information about the email owner available in the database, we will add it as well. Each 
     * response returns up to 100 emails. If it does not return at least one email, you will not be charged 
     * for the request.
     *
     * @see https://snov.io/api#DomainSearch
     * @param array emails 
     */
    getDomainSearch(params){
        return new Promise(async (resolve, reject) => {
            try{
                const token = await this.getAccessToken();
                params["access_token"] = token;

                request.post({
                    url: 'https://app.snov.io/restapi/get-domain-emails-with-info',
                    json: params
                }, (err, res, body) => {
                    if(err) reject(err);
                    else if (res && res.statusCode === 200) resolve(body.emails);
                    else reject("Error to call getDomainSearch");
                });
            }
            catch(err){
                reject(err);
            }
        });
    }

    /**
     * Check if the provided email addresses are valid and deliverable. API endpoint will return the email verification results. 
     * If we haven’t verified a certain email address before, the results will not be returned to you. In this case, 
     * the API will return a “not_verified” identifier and you will not be charged credits for this email. You should use 
     * the Add Emails for Verification method to push this email address for verification, after which you will be 
     * able to get the email verification results using this endpoint.
     *
     * @see https://snov.io/api#EmailVerifier
     * @param array emails 
     */
    getEmailVerifier(emails){
        return new Promise(async (resolve, reject) => {
            try{
                const token = await this.getAccessToken();
                let query = { "emails": emails };

                request.post({
                    url: `https://app.snov.io/restapi/get-emails-verification-status?${this.buildQuery(query)}`,
                    json: { access_token: token }
                }, (err, res, body) => {
                    if(err) reject(err);
                    else if (res && res.statusCode === 200) resolve(body);
                    else reject("Error to call getEmailVerifier");
                });
            }
            catch(err){
                reject(err);
            }
        });
    }

    /**
     * If you've never verified a certain email address before, you should push it for verification using 
     * this API method. After performing this action, you can receive the verification results using the 
     * Email Verifier.
     *
     * @see https://snov.io/api#AddEmailsforVerification
     * @param array emails 
     */
    addEmailsForVerification(emails){
        return new Promise(async (resolve, reject) => {
            try{
                const token = await this.getAccessToken();
                let query = { "emails": emails };

                request.post({
                    url: `https://app.snov.io/restapi/add-emails-to-verification?${this.buildQuery(query)}`,
                    json: { access_token: token }
                }, (err, res, body) => {
                    if(err) reject(err);
                    else if (res && res.statusCode === 200) resolve(body);
                    else reject("Error to call addEmailsForVerification");
                });
            }
            catch(err){
                reject(err);
            }
        });
    }

    /**
     * This API method finds email addresses using the person`s first and last name, and a domain name. 
     * If we don`t have this email address in our database, we won`t be able to provide the results to 
     * you right away. To speed up the process, you can use the Add Names To Find Emails method to push 
     * this email address for search. After that, try the Email Finder method again.
     *
     * @see https://snov.io/api#EmailFinder
     * @param string domain 
     */
    getEmailFinder(firstName, lastName, domain){
        return new Promise(async (resolve, reject) => {
            try{
                const token = await this.getAccessToken();

                request.post({
                    url: 'https://app.snov.io/restapi/get-emails-from-names',
                    json: {
                        access_token: token,
                        domain: domain,
                        firstName: firstName,
                        lastName: lastName
                    }
                }, (err, res, body) => {
                    if(err) reject(err);
                    else if (res && res.statusCode === 200) resolve(body);
                    else reject("Error to call getEmailFinder");
                });
            }
            catch(err){
                reject(err);
            }
        });             
    }

    /**
     * If Snov.io does not have the emails you are looking for in its database and can't provide these email 
     * addresses via the Email Finder, you can try to push the request for email search using this method. 
     * If an email is found, you can collect it by using the free Email Finder request again.
     *
     * @see https://snov.io/api#AddNamestoFindEmails
     * @param string domain 
     */
    getAddNamesToFindEmails(firstName, lastName, domain){
        return new Promise(async (resolve, reject) => {
            try{
                const token = await this.getAccessToken();

                request.post({
                    url: 'https://app.snov.io/restapi/add-names-to-find-emails',
                    json: {
                        access_token: token,
                        domain: domain,
                        firstName: firstName,
                        lastName: lastName
                    }
                }, (err, res, body) => {
                    if(err) reject(err);
                    else if (res && res.statusCode === 200) resolve(body);
                    else reject("Error to call getAddNamesToFindEmails");
                });
            }
            catch(err){
                reject(err);
            }
        });             
    }

    /**
     * Provide an email address and Snov.io will return all the profile information connected to the provided 
     * email address owner from the database. If we find no information about the email owner in our database, 
     * you will not be charged for the request.
     *
     * @see https://snov.io/api#GetProfileByEmail
     * @param string email 
     */
    getProfileByEmail(email){
        return new Promise(async (resolve, reject) => {
            try{
                const token = await this.getAccessToken();

                request.post({
                    url: 'https://app.snov.io/restapi/get-profile-by-email',
                    json: {
                        access_token: token,
                        email: email
                    }
                }, (err, res, body) => {
                    if(err) reject(err);
                    else if (res && res.statusCode === 200) resolve(body);
                    else reject("Error to call getProfileByEmail");
                });
            }
            catch(err){
                reject(err);
            }
        });             
    }
}

export default SnovIO;