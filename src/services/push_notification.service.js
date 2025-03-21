const OneSignal = require('onesignal-node');
const config = require('../config/config');

const client = new OneSignal.Client("d9bc3149-83f2-4ea3-b417-a4b10b409cc1", "ZjU0ZmViNTYtZTRjMC00MTRkLWJjYmYtMTg1ZTdiYzE2NWI1");


const sendPushNotification = async (title, heading, userId, data = {}) => {
  const notification = {
    headings: {
      en: title,
    },
    contents: {
      en: heading,
    },
    data,
    include_external_user_ids: userId,
  };
  try {
    const response = await client.createNotification(notification);
    return response.body;

  } catch (e) {

    if (e instanceof OneSignal.HTTPError) {
      console.log(e.statusCode);
      console.log(e.body);
    }

  }
}

module.exports = {
  sendPushNotification,
};