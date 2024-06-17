
const { ApolloServer } = require('@apollo/server');
const { ApolloGateway, IntrospectAndCompose, RemoteGraphQLDataSource} = require('@apollo/gateway');
const { expressMiddleware } = require('@apollo/server/express4');
const express = require('express');
const vilyaTypeDefs = require("@repo/vilya/schema");
const supergraphTypeDefs = require("./schema")
const { stitchSchemas } = require('@graphql-tools/stitch');
const { buildSubgraphSchema } = require('@apollo/subgraph');

(async () => {
    const gateway = new ApolloGateway({
        supergraphSdl: new IntrospectAndCompose({
            subgraphs: [
                // { name: 'users', url: 'http://localhost:4001/graphql' },
                // { name: 'posts', url: 'http://localhost:4002/graphql' },
                { name: 'products', url: 'http://localhost:4003/graphql' },
            ],
        }),
        buildService({ name, url }) {
            return new RemoteGraphQLDataSource({
                url,
                willSendRequest({ request, context}) {
                    if (context.headers) {
                        Object.entries(context.headers).forEach(([key, value]) => {
                            request.http.headers.set(key, value);
                        })
                    }
                },
            });
        },
    });
    const productsSchema = buildSubgraphSchema({typeDefs: vilyaTypeDefs})
    const supergraphSchema = stitchSchemas({
        subschemas: [
            { schema: productsSchema },
        ],
        typeDefs: supergraphTypeDefs,
    });

    const server = new ApolloServer({
        gateway,
        introspection: true,
        playground: true,
        schema: supergraphSchema
    });

    const app = express();

    await server.start();
    app.use('/graphql', express.json(), expressMiddleware(server, {
        context: async ({req}) => {
            req.user = {id: 1, name: "john", roles: ["user"]}
            return req
        }
    }));
    app.listen({port: process.env.PORT})
    console.log(`Apollo Gateway running at http://localhost:${process.env.PORT}`);

})();
