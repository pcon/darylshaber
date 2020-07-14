/**
 * Gets the user from the mentions in the message
 * @param {String} content The content to check
 * @return {String} The user identifier
 */
function getUserId(content) {
  const matcher = content.match(/<@!([0-9]+)>/);

  if (!matcher) {
    return undefined;
  }

  return matcher[1];
}

module.exports = {
  getUserId: getUserId
};