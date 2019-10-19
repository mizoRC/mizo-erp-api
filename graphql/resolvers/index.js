const path = require('path');
const mergeGraphqlSchemas = require('merge-graphql-schemas');
const resolvers = mergeGraphqlSchemas.fileLoader(path.join(__dirname, '.'));

module.exports = mergeGraphqlSchemas.mergeResolvers(resolvers);