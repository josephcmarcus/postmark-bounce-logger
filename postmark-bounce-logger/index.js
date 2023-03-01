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
    const message = `Could not get bounces for ID = '${activityPayload.instanceId}'. An error occurred in the getBounces function.`;
    context.log(message);
    return message;
  } else if (!bounces.length) {
    const message = `No bounces found for ${activityPayload.instanceId}. Exiting function.`;
    context.log(message);
    return message;
  }

  activityPayload.bounces = bounces;

  const results = yield context.df.callActivity('writeBounces', activityPayload);
  
  outputs.push(bounces, results);

  return outputs;
});
