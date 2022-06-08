const config = require('./jest.config')

//Pegando a configuração do jest e pegando tudo que tiver a extensão .ts
config.testMatch = ['**/*.test.ts']

module.exports = config