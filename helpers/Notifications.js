var FCM = require("fcm-node");
var serverKey =
  "AAAARx_Pcgg:APA91bF5TRPD7p-icLmbGZiK5RL-Z3WVXZYfwK4wQ0L2fxUGjaDFY5_fSAieVrjQUv-o7v_403qIuHjD7fD7Yt54ML3SgU4N7e51dcvKfJV5JxGjaIbLd2NL1EFfBnVpUevrc8Y0JfkL";

var fcm = new FCM(serverKey);

exports.sendGlobalNotification = (title, body) => {
  var message = {
    to: "/topics/letsShare",
    collapse_key: "type_a",
    notification: {
      body: body,
      title: title,
    },
    data: {
      body: "Body of Your Notification in Data",
      title: "Title of Your Notification in Title",
      key_1: "Value for key_1",
      key_2: "Value for key_2",
    },
  };

  fcm.send(message, function (err, response) {
    if (err) {
      console.log("Something has gone wrong!");
    } else {
      console.log("Successfully sent with response: ", response);
    }
  });
};
