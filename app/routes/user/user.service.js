const User = require('../../database/index').models.user;
const UserDAL = require('../../models/user');
const {generateChatConversationMembersHash} = require('../../utils/helpers');

module.exports = {
  updateUserStatus: async (userId, status) => {
    return UserDAL.updateUserStatus(userId, status);
  },
  GetAllUserStatus : async () => {
    try {

      const query = User.find({});
      query.select('user_id status updated_at');
      const userList = await query.exec();
      if(userList.length === 0)  throw new Error('RESOURCE_NOT_FOUND');
      return userList;
    }
    catch(error){
      throw new Error('RESOURCE_NOT_FOUND');
    }
  },
  GetUserStatus : async (userId) => {
    try {

      const query = User.find({user_id: userId});
      query.select('user_id status updated_at');
      const userList = await query.exec();
      if(userList.length === 0)  throw new Error('RESOURCE_NOT_FOUND');
      return userList[0];
    }
    catch(error){
      throw new Error('RESOURCE_NOT_FOUND');
    }
  },
};