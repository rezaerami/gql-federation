// schema.js
const { gql } = require('graphql-tag');

const typeDefs = gql`
    extend schema @link(url: "https://specs.apollo.dev/federation/v2.7", import: ["@key"])
    
    type Product {
        id: ID!
        name: String!
        price: Float!
        description: String
    }
    type Seller {
        id: ID!
        name: String!
    }

    type Query {
        product: Product
        seller: Seller
    }
`;

module.exports = typeDefs;
