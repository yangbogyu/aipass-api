const swaggerUi = require('swagger-ui-express');
const swaggereJsdoc = require('swagger-jsdoc');

//기본설정
const options = {
    swaggerDefinition: {
        info: {
            title: 'AiPass-2.0 API', 
            version: '0.1.0', 
            description: 'AiPass API with express',
        }, host: 'api.bogyu98.shop', 
        basePath: '/' 
    }, apis: ['./src/routes/*.js', './src/models/*'] 
};

const specs = swaggereJsdoc(options);

module.exports = { 
    swaggerUi,
    specs
};
