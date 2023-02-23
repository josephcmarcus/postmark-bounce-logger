const df = require('durable-functions');

module.exports = df.orchestrator(function* (context) {
  const activityPayload = {
    instanceId: context.df.instanceId,
    bounces: [],
    results: [],
  };
  const outputs = [];

  const bounces = yield context.df.callActivity('getBounces', activityPayload);
  if (bounces === null) {
    context.log(`No bounces found for ${instanceId}. Exiting function.`);
  }

  activityPayload.bounces = bounces;

  const results = yield context.df.callActivity('writeBounces', activityPayload);
  outputs.push(bounces, results);

  return outputs;
});
