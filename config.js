var path = require('path'),
    os = require('os')
module.exports = {
    locations: [ path.resolve(os.homedir(), 'chemicals') ]
}
