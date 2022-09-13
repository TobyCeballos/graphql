const parseArgs = require('minimist')

const options = {
    alias: {
        p: 'puerto'
    },
    default: {
        puerto: 8080
    }
}

const { puerto, _ } = parseArgs(process.argv.slice(2), options)

const datosArgs = { puerto, _}

module.exports = { datosArgs }

console.log({ puerto, otros: _})
