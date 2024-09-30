const config = require("../../Config/config");
const request = require("request");

// Function to apply for a Fabric token
function applyFabricToken() {
  return new Promise((resolve, reject) => {
    const options = {
      method: "POST",
      url: `${config.baseUrl}/payment/v1/token`,
      headers: {
        "Content-Type": "application/json",
        "X-APP-Key": config.fabricAppId,
      },
      body: JSON.stringify({
        appSecret: config.appSecret,
      }),
      rejectUnauthorized: false, // Use only for self-signed certificates
      requestCert: false,
      agent: false,
    };

    request(options, (error, response) => {
      if (error) {
        console.error("Error during token request:", error);
        return reject(new Error("Failed to request fabric token"));
      }

      console.log("Token response status code:", response.statusCode);
      console.log("Token response headers:", response.headers);
      console.log("Token response body:", response.body);

      try {
        const result = JSON.parse(response.body);
        if (result.token) {
          resolve(result);
        } else {
          reject(new Error("Token not found in response"));
        }
      } catch (e) {
        reject(new Error("Failed to parse token response"));
      }
    });
  });
}

// Function to create a donation order
// Function to create a donation order
exports.createDonationOrder = async (req, res) => {
  try {
    const { donationTitle, donationAmount } = req.body;

    // Apply for a Fabric token
    const tokenResult = await applyFabricToken();
    const fabricToken = tokenResult.token;

    // Create order request object
    const orderRequest = {
      timestamp: new Date().getTime().toString(),
      nonce_str: Math.random().toString(36).substring(7),
      method: "payment.preorder",
      version: "1.0",
      biz_content: {
        notify_url: "https://your-server.com/payment/notify",
        appid: config.merchantAppId,
        merch_code: config.merchantCode,
        merch_order_id: new Date().getTime().toString(),
        trade_type: "Checkout",
        title: donationTitle,
        total_amount: donationAmount,
        trans_currency: "ETB",
        timeout_express: "120m",
        business_type: "BuyGoods",
        redirect_url: "https://google.com",
      },
    };

    // Options for creating the order
    const options = {
      method: "POST",
      url: `${config.baseUrl}/payment/v1/merchant/preOrder`,
      headers: {
        "Content-Type": "application/json",
        "X-APP-Key": config.fabricAppId,
        Authorization: `Bearer ${fabricToken}`,
        Accept: "application/json",
      },
      body: JSON.stringify(orderRequest),
    };

    // Send request to create order
    request(options, (error, response) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }

      try {
        const result = JSON.parse(response.body);

        if (result.result === "SUCCESS") {
          const prepayId = result.biz_content.prepay_id;
          const paymentUrl = `${
            config.webBaseUrl
          }?prepay_id=${encodeURIComponent(
            prepayId
          )}&version=1.0&trade_type=Checkout`;
          res.status(200).json({ paymentUrl });
        } else {
          res.status(400).json({ error: result.msg });
        }
      } catch (e) {
        res.status(500).json({ error: "Failed to parse order response" });
      }
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
