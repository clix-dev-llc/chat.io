const User = require('../../database/index').models.user;
const UserDAL = require('../../models/user');
const {generateChatConversationMembersHash} = require('../../utils/helpers');

module.exports = {
  updateUserStatus: async (userId, status) => {
    return UserDAL.updateUserStatus(userId, status);
  },
};