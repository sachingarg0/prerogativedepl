function openJsCheckoutPopup(orderId, txnToken, amount) {
  console.log("Initializing Paytm CheckoutJS with:");
  console.log("Order ID:", orderId);
  console.log("Transaction Token:", txnToken);
  console.log("Amount:", amount);

  var config = {
    root: "",
    flow: "DEFAULT",
    data: {
      orderId: orderId,
      token: txnToken,
      tokenType: "TXN_TOKEN",
      amount: amount,
    },
    merchant: {
      redirect: true,
    },
    handler: {
      notifyMerchant: function (eventName, data) {
        console.log("notifyMerchant handler function called");
        console.log("eventName => ", eventName);
        console.log("data => ", data);
      },
    },
  };

  if (window.Paytm && window.Paytm.CheckoutJS) {
    console.log("Paytm CheckoutJS found, initializing...");
    window.Paytm.CheckoutJS.init(config)
      .then(function onSuccess() {
        console.log("Paytm CheckoutJS initialized successfully");
        // After successfully updating configuration, invoke checkoutjs
        window.Paytm.CheckoutJS.invoke();
      })
      .catch(function onError(error) {
        console.error("Error during Paytm CheckoutJS initialization:");
        console.error(error);
      });
  } else {
    console.error("Paytm CheckoutJS is not available on the window object");
  }
}
