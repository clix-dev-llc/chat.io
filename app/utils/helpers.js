
String.prototype.hashCode = function () { // eslint-disable-line
  let hash = 0;
  let i = 0;
  const len = this.length;
  while (i < len) {
    hash = ((hash << 5) - hash + this.charCodeAt(i++)) << 0; // eslint-disable-line
  }
  return hash.toString();
};

module.exports = {
  generateChatConversationMembersHash : (membersArray) => {
    const membersArrayForHash = membersArray.slice();
    membersArrayForHash.sort();
    return membersArrayForHash.toString().hashCode();
  }
};
