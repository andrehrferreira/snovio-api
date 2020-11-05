"use strict";

var _index = require("./index.js");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var snov = new _index2.default("apiUserID", "apiSecret");

//You can find out the number of email addresses from a certain domain
snov.getEmailCount("saraiva.com.br").then(function (count) {
    console.log("Email Count: " + count);
}).catch(function (err) {
    console.log(err);
});

//Return all the email addresses on the domain
snov.getDomainSearch({
    domain: "saraiva.com.br",
    type: "all",
    limit: 1,
    lastId: 0
}).then(function (res) {
    console.log("Email:", res);
}).catch(function (err) {
    console.log(err);
});

snov.getEmailVerifier(["andre@vigiadepreco.com.br"]).then(function (res) {
    console.log(res);
}).catch(function (err) {
    console.log(err);
});

snov.addEmailsForVerification(["andre@vigiadepreco.com.br"]).then(function (res) {
    console.log(res);
}).catch(function (err) {
    console.log(err);
});

snov.getEmailFinder("andre", "ferreira", "vigiadepreco.com.br").then(function (res) {
    console.log(res);
}).catch(function (err) {
    console.log(err);
});

snov.getAddNamesToFindEmails("andre", "ferreira", "vigiadepreco.com.br").then(function (res) {
    console.log(res);
}).catch(function (err) {
    console.log(err);
});

snov.getProfileByEmail("andre@vigiadepreco.com.br").then(function (res) {
    console.log(res);
}).catch(function (err) {
    console.log(err);
});
//# sourceMappingURL=sample.js.map