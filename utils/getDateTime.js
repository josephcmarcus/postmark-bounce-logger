module.exports = function getDateTime() {
  const date = new Date()
  .toISOString()
  .replace(/T/, ' ')
  .replace(/\..+/, '');
  return date;
};