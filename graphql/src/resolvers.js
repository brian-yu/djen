module.exports = {
  Query: {
  },
  Mutation: {
    login: async (_, { code }, { dataSources }) => {
      const user = await dataSources.userAPI.authenticateUser({ code });
      if (user) return Buffer.from(user.github).toString('base64');
    },
  },
};
