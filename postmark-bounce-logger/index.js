const df = require("durable-functions");
const getYesterdayDate = require('../utils/getYesterdayDate');

module.exports = df.orchestrator(function* (context) {
    const activityPayload = {
        instanceId: context.df.instanceId,
        bounces: [],
    };

    const bounces = yield context.df.callActivity("getBounces", activityPayload);
    if (bounces === null) {
        context.log(`No bounces found for ${instanceId}. Exiting function.`)
    }

    activityPayload.bounces = bounces;

    return activityPayload;
});