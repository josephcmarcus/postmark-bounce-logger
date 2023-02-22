const dotenv = require('dotenv').config();
const axios = require('axios');
const getYesterdayDate = require('../utils/getYesterdayDate');

module.exports = async function (context) {
  const { instanceId } = context.bindingData.args;
  const yesterday = getYesterdayDate();

  try {
    const response = await axios({
      method: 'get',
      url: `${process.env.POSTMARK_BASE_URL}`,
      params: {
        type: 'HardBounce',
        count: 500,
        inactive: 'true',
        offset: 0,
        fromdate: `${yesterday}T00:00:00`,
        todate: `${yesterday}T23:59:59`,
      },
      headers: {
        Accept: 'application/json',
        'X-Postmark-Server-Token': process.env.POSTMARK_SERVER_TOKEN,
      },
    });

    if (response.data.TotalCount === 0) {
        context.log(`getBounces succeeded for ID = '${instanceId}'. No bounces found.`);
      return null;
    }

    context.log(`getBounces succeeded for ID = '${instanceId}'. Bounces received: ${response.data.TotalCount}.`);

    return response.data.Bounces;
  } catch (err) {
    context.log(`getBounces failed for ID = '${instanceId}'. ${err}`);
    return null;
  }
};
