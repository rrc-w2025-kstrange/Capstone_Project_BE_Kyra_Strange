import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Music API Documentation",
      version: "1.0.0",
      description: "API documentation for the Music application",
    },

    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: [
    "./src/api/v1/routes/*.ts", 
    "./src/api/v1/models/*.ts", 
  ],
};

export const generateSwaggerSpec = (): object => {
    return swaggerJsdoc(swaggerOptions);
};