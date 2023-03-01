const database = require('../database');

module.exports = async function (context) {
  const { bounces, instanceId } = context.bindingData.args;
  const bounceValues = [];
  const table = process.env.DB_TABLE;
  const columns = 'RecordType, ID, Type, TypeCode, Name, Tag, MessageID, ServerID, MessageStream ,' +
  'Description, Details, ToEmail, FromEmail, BouncedAt, DumpAvailable, Inactive, CanActivate, Subject, InsertDate';
  let response;

  for (bounce of bounces) {
    bounce.BouncedAt = bounce.BouncedAt.replace('T', ' ').replace('Z', '');
    bounceValues.push(Object.values(bounce));
  };

  try {
    response = await database.writeBounces(table, columns, bounceValues);
    context.log(`writeBounces succeeded to update database for instance = '${instanceId}'.`);
    return response;
  } catch (err) {
    context.log(`writeBounces failed to update database for instance = '${instanceId}'. ${err}`);
    return null;
  }
};
