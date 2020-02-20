"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _request = require("request");

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SnovIO = function () {
    function SnovIO(apiUserID, apiSecret) {
        _classCallCheck(this, SnovIO);

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


    _createClass(SnovIO, [{
        key: "buildQuery",
        value: function buildQuery(formdata, numericPrefix, argSeparator, encType) {
            var encodeFunc;

            switch (encType) {
                case 'PHP_QUERY_RFC3986':
                    encodeFunc = require('../url/rawurlencode');
                    break;

                case 'PHP_QUERY_RFC1738':
                default:
                    encodeFunc = function encodeFunc(str) {
                        str = str + '';

                        return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/~/g, '%7E').replace(/%20/g, '+');
                    };
                    break;
            }

            var value;
            var key;
            var tmp = [];

            var _httpBuildQueryHelper = function _httpBuildQueryHelper(key, val, argSeparator) {
                var k;
                var tmp = [];
                if (val === true) {
                    val = '1';
                } else if (val === false) {
                    val = '0';
                }
                if (val !== null) {
                    if ((typeof val === "undefined" ? "undefined" : _typeof(val)) === 'object') {
                        for (k in val) {
                            if (val[k] !== null) {
                                tmp.push(_httpBuildQueryHelper(key + '[' + k + ']', val[k], argSeparator));
                            }
                        }
                        return tmp.join(argSeparator);
                    } else if (typeof val !== 'function') {
                        return encodeFunc(key) + '=' + encodeFunc(val);
                    } else {
                        throw new Error('There was an error processing for http_build_query().');
                    }
                } else {
                    return '';
                }
            };

            if (!argSeparator) {
                argSeparator = '&';
            }
            for (key in formdata) {
                value = formdata[key];
                if (numericPrefix && !isNaN(key)) {
                    key = String(numericPrefix) + key;
                }
                var query = _httpBuildQueryHelper(key, value, argSeparator);
                if (query !== '') {
                    tmp.push(query);
                }
            }

            return tmp.join(argSeparator);
        }

        /**
         * You need to generate an access token to authenticate future requests. 
         * When making a request, please specify this access token in the Authorization field.
         *
         * @see https://snov.io/api#Authentification
         */

    }, {
        key: "getAccessToken",
        value: function getAccessToken() {
            var _this = this;

            return new Promise(function (resolve, reject) {
                if (_this.accessToken) resolve(_this.accessToken);else {
                    _request2.default.post({
                        url: 'https://app.snov.io/oauth/access_token',
                        json: {
                            grant_type: 'client_credentials',
                            client_id: _this.apiUserID,
                            client_secret: _this.apiSecret
                        }
                    }, function (err, res, body) {
                        if (err) reject(err);else if (body.access_token) {
                            _this.accessToken = body.access_token;
                            resolve(body.access_token);
                        } else reject("Couln't validate the API User ID and/or API Secret.");
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

    }, {
        key: "getEmailCount",
        value: function getEmailCount(domain) {
            var _this2 = this;

            return new Promise(function () {
                var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(resolve, reject) {
                    var token;
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    _context.prev = 0;
                                    _context.next = 3;
                                    return _this2.getAccessToken();

                                case 3:
                                    token = _context.sent;


                                    _request2.default.post({
                                        url: 'https://app.snov.io/restapi/get-domain-emails-count',
                                        json: {
                                            access_token: token,
                                            domain: domain
                                        }
                                    }, function (err, res, body) {
                                        if (err) reject(err);else if (res && res.statusCode === 200) resolve(body.result);else reject("Error to call getEmailCount");
                                    });
                                    _context.next = 10;
                                    break;

                                case 7:
                                    _context.prev = 7;
                                    _context.t0 = _context["catch"](0);

                                    reject(_context.t0);

                                case 10:
                                case "end":
                                    return _context.stop();
                            }
                        }
                    }, _callee, _this2, [[0, 7]]);
                }));

                return function (_x, _x2) {
                    return _ref.apply(this, arguments);
                };
            }());
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

    }, {
        key: "getDomainSearch",
        value: function getDomainSearch(params) {
            var _this3 = this;

            return new Promise(function () {
                var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(resolve, reject) {
                    var token;
                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                        while (1) {
                            switch (_context2.prev = _context2.next) {
                                case 0:
                                    _context2.prev = 0;
                                    _context2.next = 3;
                                    return _this3.getAccessToken();

                                case 3:
                                    token = _context2.sent;

                                    params["access_token"] = token;

                                    _request2.default.post({
                                        url: 'https://app.snov.io/restapi/get-domain-emails-with-info',
                                        json: params
                                    }, function (err, res, body) {
                                        if (err) reject(err);else if (res && res.statusCode === 200) resolve(body.emails);else reject("Error to call getDomainSearch");
                                    });
                                    _context2.next = 11;
                                    break;

                                case 8:
                                    _context2.prev = 8;
                                    _context2.t0 = _context2["catch"](0);

                                    reject(_context2.t0);

                                case 11:
                                case "end":
                                    return _context2.stop();
                            }
                        }
                    }, _callee2, _this3, [[0, 8]]);
                }));

                return function (_x3, _x4) {
                    return _ref2.apply(this, arguments);
                };
            }());
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

    }, {
        key: "getEmailVerifier",
        value: function getEmailVerifier(emails) {
            var _this4 = this;

            return new Promise(function () {
                var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(resolve, reject) {
                    var token, query;
                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                        while (1) {
                            switch (_context3.prev = _context3.next) {
                                case 0:
                                    _context3.prev = 0;
                                    _context3.next = 3;
                                    return _this4.getAccessToken();

                                case 3:
                                    token = _context3.sent;
                                    query = { "emails": emails };


                                    _request2.default.post({
                                        url: "https://app.snov.io/restapi/get-emails-verification-status?" + _this4.buildQuery(query),
                                        json: { access_token: token }
                                    }, function (err, res, body) {
                                        if (err) reject(err);else if (res && res.statusCode === 200) resolve(body);else reject("Error to call getEmailVerifier");
                                    });
                                    _context3.next = 11;
                                    break;

                                case 8:
                                    _context3.prev = 8;
                                    _context3.t0 = _context3["catch"](0);

                                    reject(_context3.t0);

                                case 11:
                                case "end":
                                    return _context3.stop();
                            }
                        }
                    }, _callee3, _this4, [[0, 8]]);
                }));

                return function (_x5, _x6) {
                    return _ref3.apply(this, arguments);
                };
            }());
        }

        /**
         * If you've never verified a certain email address before, you should push it for verification using 
         * this API method. After performing this action, you can receive the verification results using the 
         * Email Verifier.
         *
         * @see https://snov.io/api#AddEmailsforVerification
         * @param array emails 
         */

    }, {
        key: "addEmailsForVerification",
        value: function addEmailsForVerification(emails) {
            var _this5 = this;

            return new Promise(function () {
                var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(resolve, reject) {
                    var token, query;
                    return regeneratorRuntime.wrap(function _callee4$(_context4) {
                        while (1) {
                            switch (_context4.prev = _context4.next) {
                                case 0:
                                    _context4.prev = 0;
                                    _context4.next = 3;
                                    return _this5.getAccessToken();

                                case 3:
                                    token = _context4.sent;
                                    query = { "emails": emails };


                                    _request2.default.post({
                                        url: "https://app.snov.io/restapi/add-emails-to-verification?" + _this5.buildQuery(query),
                                        json: { access_token: token }
                                    }, function (err, res, body) {
                                        if (err) reject(err);else if (res && res.statusCode === 200) resolve(body);else reject("Error to call addEmailsForVerification");
                                    });
                                    _context4.next = 11;
                                    break;

                                case 8:
                                    _context4.prev = 8;
                                    _context4.t0 = _context4["catch"](0);

                                    reject(_context4.t0);

                                case 11:
                                case "end":
                                    return _context4.stop();
                            }
                        }
                    }, _callee4, _this5, [[0, 8]]);
                }));

                return function (_x7, _x8) {
                    return _ref4.apply(this, arguments);
                };
            }());
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

    }, {
        key: "getEmailFinder",
        value: function getEmailFinder(firstName, lastName, domain) {
            var _this6 = this;

            return new Promise(function () {
                var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(resolve, reject) {
                    var token;
                    return regeneratorRuntime.wrap(function _callee5$(_context5) {
                        while (1) {
                            switch (_context5.prev = _context5.next) {
                                case 0:
                                    _context5.prev = 0;
                                    _context5.next = 3;
                                    return _this6.getAccessToken();

                                case 3:
                                    token = _context5.sent;


                                    _request2.default.post({
                                        url: 'https://app.snov.io/restapi/get-emails-from-names',
                                        json: {
                                            access_token: token,
                                            domain: domain,
                                            firstName: firstName,
                                            lastName: lastName
                                        }
                                    }, function (err, res, body) {
                                        if (err) reject(err);else if (res && res.statusCode === 200) resolve(body);else reject("Error to call getEmailFinder");
                                    });
                                    _context5.next = 10;
                                    break;

                                case 7:
                                    _context5.prev = 7;
                                    _context5.t0 = _context5["catch"](0);

                                    reject(_context5.t0);

                                case 10:
                                case "end":
                                    return _context5.stop();
                            }
                        }
                    }, _callee5, _this6, [[0, 7]]);
                }));

                return function (_x9, _x10) {
                    return _ref5.apply(this, arguments);
                };
            }());
        }

        /**
         * If Snov.io does not have the emails you are looking for in its database and can't provide these email 
         * addresses via the Email Finder, you can try to push the request for email search using this method. 
         * If an email is found, you can collect it by using the free Email Finder request again.
         *
         * @see https://snov.io/api#AddNamestoFindEmails
         * @param string domain 
         */

    }, {
        key: "getAddNamesToFindEmails",
        value: function getAddNamesToFindEmails(firstName, lastName, domain) {
            var _this7 = this;

            return new Promise(function () {
                var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(resolve, reject) {
                    var token;
                    return regeneratorRuntime.wrap(function _callee6$(_context6) {
                        while (1) {
                            switch (_context6.prev = _context6.next) {
                                case 0:
                                    _context6.prev = 0;
                                    _context6.next = 3;
                                    return _this7.getAccessToken();

                                case 3:
                                    token = _context6.sent;


                                    _request2.default.post({
                                        url: 'https://app.snov.io/restapi/add-names-to-find-emails',
                                        json: {
                                            access_token: token,
                                            domain: domain,
                                            firstName: firstName,
                                            lastName: lastName
                                        }
                                    }, function (err, res, body) {
                                        if (err) reject(err);else if (res && res.statusCode === 200) resolve(body);else reject("Error to call getAddNamesToFindEmails");
                                    });
                                    _context6.next = 10;
                                    break;

                                case 7:
                                    _context6.prev = 7;
                                    _context6.t0 = _context6["catch"](0);

                                    reject(_context6.t0);

                                case 10:
                                case "end":
                                    return _context6.stop();
                            }
                        }
                    }, _callee6, _this7, [[0, 7]]);
                }));

                return function (_x11, _x12) {
                    return _ref6.apply(this, arguments);
                };
            }());
        }

        /**
         * Provide an email address and Snov.io will return all the profile information connected to the provided 
         * email address owner from the database. If we find no information about the email owner in our database, 
         * you will not be charged for the request.
         *
         * @see https://snov.io/api#GetProfileByEmail
         * @param string email 
         */

    }, {
        key: "getProfileByEmail",
        value: function getProfileByEmail(email) {
            var _this8 = this;

            return new Promise(function () {
                var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(resolve, reject) {
                    var token;
                    return regeneratorRuntime.wrap(function _callee7$(_context7) {
                        while (1) {
                            switch (_context7.prev = _context7.next) {
                                case 0:
                                    _context7.prev = 0;
                                    _context7.next = 3;
                                    return _this8.getAccessToken();

                                case 3:
                                    token = _context7.sent;


                                    _request2.default.post({
                                        url: 'https://app.snov.io/restapi/get-profile-by-email',
                                        json: {
                                            access_token: token,
                                            email: email
                                        }
                                    }, function (err, res, body) {
                                        if (err) reject(err);else if (res && res.statusCode === 200) resolve(body);else reject("Error to call getProfileByEmail");
                                    });
                                    _context7.next = 10;
                                    break;

                                case 7:
                                    _context7.prev = 7;
                                    _context7.t0 = _context7["catch"](0);

                                    reject(_context7.t0);

                                case 10:
                                case "end":
                                    return _context7.stop();
                            }
                        }
                    }, _callee7, _this8, [[0, 7]]);
                }));

                return function (_x13, _x14) {
                    return _ref7.apply(this, arguments);
                };
            }());
        }
    }]);

    return SnovIO;
}();

exports.default = SnovIO;
//# sourceMappingURL=index.js.map