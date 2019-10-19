
const path = require('path');
const mergeGraphqlSchemas = require('merge-graphql-schemas');
const types = mergeGraphqlSchemas.fileLoader(path.join(__dirname, './*.*'));

module.exports = mergeGraphqlSchemas.mergeTypes(types);