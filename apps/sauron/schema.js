// schema.js
const { gql } = require('graphql-tag');

const typeDefs = gql`
    directive @role(requires: [String]) on OBJECT | FIELD_DEFINITION

    type Query {
        product: Product @role(requires: ["admin"])
    }
`;

module.exports = typeDefs;
