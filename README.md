# snovio-api
Snov.io Api

## Install

```bash
$ yarn add snovio-api --save
```

## Get API User ID and API Secret

* Create account - https://app.snov.io/register
* API User ID and API Secret - https://app.snov.io/api-setting
* Docs - https://snov.io/api

## Usage

```js
import SnovIO from "snovio-api";

const snov = new SnovIO("apiUserID", "apiSecret");

//You can find out the number of email addresses from a certain domain
snov.getEmailCount("vigiadepreco.com.br").then((count) => {
    console.log(`Email Count: ${count}`);
}).catch((err) => {
    console.log(err);
});

snov.getDomainSearch({
    domain: "vigiadepreco.com.br",
    type: "all",
    limit: 1,
    offset: 0
}).then((res) => {
    console.log(`Email:`, res);
}).catch((err) => {
    console.log(err);
});
```
