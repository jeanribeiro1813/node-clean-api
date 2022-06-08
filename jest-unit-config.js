const config = require('./jest.config')

//Pegando a configuração do jest e pegando tudo que tiver a extensão spec.ts
config.testMatch = ['**/*.spec.ts']

module.exports = config