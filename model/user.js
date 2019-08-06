var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
    email: {
        type: String

    },
    secretKey: {
        type: String,
        required: true,
        default: "visitorSolution"
    },
    baseDomain: {
        type: String,
        unique: true,
    },
    paths: [{
        path: {
            type: String
        },
        totalVisitorCount: {
            type: Number,
            default: 0
        },
        visitors: {}
    }]
});
module.exports = mongoose.model('User', userSchema);
/*
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
    email: {
        type: String

    },
    secretKey: {
        type: String,
        required: true,
        unique: true
    },
    domains: [{
        baseDomain: {
            type: String
        },
        totalVisitorCount: {
            type: Number,
            default: 0
        },
        visitors: []
    }]
});



module.exports = mongoose.model('User', userSchema);
*/