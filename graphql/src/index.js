"use strict";
// Load env vars.
require('dotenv').config();
const { ApolloServer, gql } = require("apollo-server");
const typeDefs = require("./schema");
const { createStore } = require("./utils");
const resolvers = require("./resolvers");

const UserAPI = require("./datasources/user");

const store = createStore();

// const context = async ({ req }) => {
//   // simple auth check on every request
//   const auth = (req.headers && req.headers.authorization) || "";
//   const github = Buffer.from(auth, "base64").toString("ascii");
//   if (!isEmail.validate(email)) return { user: null };
//   // find a user by their email
//   const users = await store.users.findOrCreate({ where: { email } });
//   const user = (users && users[0]) || null;

//   return { user: { ...user.dataValues } };
// }

const PORT = process.env.PORT || 8080;

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    userAPI: new UserAPI({ store }),
  })
});

// The `listen` method launches a web server.
server.listen(PORT).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});