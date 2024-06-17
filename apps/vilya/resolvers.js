// resolvers.js
const resolvers = {
    Query: {
        product: () => ({
                id: "1",
                name: "Mock Product",
                price: 19.99,
                description: "This is a mock product description."
        }),
        seller: () => ({
            id: "1",
            name: "John"
        })
    },
};

module.exports = resolvers;
