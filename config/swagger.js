import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const spec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'eCommerce API',
      version: '1.0.0',
      description:
        'REST API для интернет-магазина. JWT-аутентификация, роли user/admin, корзина через заказы и список желаемого.',
    },
    servers: [{ url: '/', description: 'Текущий хост' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    tags: [
      { name: 'Auth' },
      { name: 'Users' },
      { name: 'Categories' },
      { name: 'Products' },
      { name: 'Orders' },
    ],
  },
  apis: ['./routes/*.js'],
})

export function mountSwagger(app) {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(spec))
  app.get('/api/docs.json', (req, res) => res.json(spec))
}
