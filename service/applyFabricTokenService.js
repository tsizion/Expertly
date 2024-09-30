// Function to create a donation order
const request = require("request");
const config = require("../Config/config");

function applyFabricToken() {
  return new Promise((resolve, reject) => {
    var options = {
      method: "POST",
      url: config.baseUrl + "/payment/v1/token",
      headers: {
        "Content-Type": "application/json",
        "X-APP-Key": config.fabricAppId,
      },
      body: JSON.stringify({ appSecret: config.appSecret }),
      rejectUnauthorized: false,
      requestCert: false,
      agent: false,
    };

    request(options, function (error, response) {
      if (error) reject(error);
      let result = JSON.parse(response.body);
      resolve(result);
    });
  });
}

module.exports = applyFabricToken;
