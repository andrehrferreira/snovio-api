import SnovIO from "./index.js";

const snov = new SnovIO("apiUserID", "apiSecret");

//You can find out the number of email addresses from a certain domain
snov.getEmailCount("saraiva.com.br").then((count) => {
    console.log(`Email Count: ${count}`);
}).catch((err) => {
    console.log(err);
});

//Return all the email addresses on the domain
snov.getDomainSearch({
    domain: "saraiva.com.br",
    type: "all",
    limit: 1,
    lastId: 0
}).then((res) => {
    console.log(`Email:`, res);
}).catch((err) => {
    console.log(err);
});

snov.getEmailVerifier(["andre@vigiadepreco.com.br"]).then((res) => {
    console.log(res);
}).catch((err) => {
    console.log(err);
});

snov.addEmailsForVerification(["andre@vigiadepreco.com.br"]).then((res) => {
    console.log(res);
}).catch((err) => {
    console.log(err);
});

snov.getEmailFinder("andre", "ferreira", "vigiadepreco.com.br").then((res) => {
    console.log(res);
}).catch((err) => {
    console.log(err);
});

snov.getAddNamesToFindEmails("andre", "ferreira", "vigiadepreco.com.br").then((res) => {
    console.log(res);
}).catch((err) => {
    console.log(err);
});

snov.getProfileByEmail("andre@vigiadepreco.com.br").then((res) => {
    console.log(res);
}).catch((err) => {
    console.log(err);
});

