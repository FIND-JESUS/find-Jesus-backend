import express, { Application } from "express";
import { createServer } from "http";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import { RegisterRoutes } from "./routes/routes";
import * as swaggerJson from "../public/swagger.json";
import "./config/redis";
import { initSocket } from "./config/socket";

const app: Application = express();
const server = createServer(app); // wrap express with http server

// Middlewares
app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJson));

// Register TSOA auto generated routes
RegisterRoutes(app);

// Initialize Socket.io
initSocket(server);

const PORT = process.env.PORT || 5000;

// Use server.listen instead of app.listen
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
});