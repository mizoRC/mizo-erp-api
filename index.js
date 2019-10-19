// Imports
require("@babel/register")({
    presets: [ 
        ["@babel/preset-env", {
            "targets": {
            "node": "current"
            }
        }], 
        "@babel/preset-react" ]
});;
require('./server');