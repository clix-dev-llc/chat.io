const userService = require('./user.service');

module.exports = {
  GetAllUserStatus: async (request, response, next) => {
    try {
      const userList = await userService.GetAllUserStatus();
      response.send(userList).status(200);
    }
    catch (error){
      next(error);
    }
  },

  GetUserStatus: async (request, response, next) => {
    try {
      const userList = await userService.GetUserStatus(request.params.userId);
      response.send(userList).status(200);
    }
    catch (error){
      next(error);
    }
  }
};
