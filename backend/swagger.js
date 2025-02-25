import swaggerAutogen from "swagger-autogen";

// Define Swagger options
const doc = {
    info: {
    title: "Threads Clone API",
    description: "Auto-generated API documentation",
    version: "1.0.0",
    },
    servers: [{ url: "http://localhost:5000" }],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
    },
  security: [{ bearerAuth: [] }], // Apply Bearer Auth globally
};

const outputFile = "./swagger-output.json"; // JSON file for Swagger
const endpointsFiles = ["./server.js", "./routes/userRoutes.js", "./routes/postRoutes.js"]; // Files to scan

// Auto-generate Swagger documentation
swaggerAutogen()(outputFile, endpointsFiles).then(() => {
    console.log("Swagger documentation generated.");
});
