const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Multi-Tenant Helpdesk API',
            version: '1.0.0',
            description: 'Backend API for a multi-tenant B2B SaaS helpdesk system'
        },
        servers: [
            { url: 'http://localhost:3000/api' }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;