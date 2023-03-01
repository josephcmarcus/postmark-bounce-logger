const dotenv = require('dotenv').config();
const axios = require('axios');
const getYesterdayDate = require('../utils/getYesterdayDate');
const getDateTime = require('../utils/getDateTime');

module.exports = async function (context) {
  const { instanceId } = context.bindingData.args;
  const yesterday = getYesterdayDate();
  const currentDateTime = getDateTime();

  const servers = [
    process.env.POSTMARK_ORDERS_SERVER_TOKEN,
    process.env.POSTMARK_OTHER_SERVER_TOKEN,
    process.env.POSTMARK_IRSTAXRECEIPTS_SERVER_TOKEN,
  ];

  const bounces = [];

  for (server of servers) {
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
          'X-Postmark-Server-Token': server,
        },
      });

      if (response.data.TotalCount === 0) {
        context.log(
          `getBounces succeeded for server '${server}' and ID = '${instanceId}'. No bounces found.`
        );
      } else {
        context.log(
          `getBounces succeeded for server '${server} and ID = '${instanceId}'. Bounces received: ${response.data.TotalCount}.`
        );
        bounces.push(response.data.Bounces);
      }
    } catch (err) {
      context.log(
        `getBounces failed for server '${server}' and ID = '${instanceId}'. ${err}`
      );
    }
  }
  const mergedBounces = bounces.flat(1);

  for (bounce of mergedBounces) {
    bounce.InsertDate = currentDateTime;
  }

  return mergedBounces;
};
