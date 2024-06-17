// index.js
const { ApolloServer } = require('@apollo/server');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const express = require("express");
const {expressMiddleware} = require("@apollo/server/express4");


(async () => {

// Create an instance of ApolloServer

    let schema = buildSubgraphSchema({ typeDefs, resolvers })

    const server = new ApolloServer({schema});

    const app = express();

    await server.start();
    app.use('/graphql', express.json(), expressMiddleware(server));
    app.listen({port: process.env.PORT})
    console.log(`Apollo Gateway running at http://localhost:${process.env.PORT}`);
})()