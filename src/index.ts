import express, { Application } from "express";
import { createServer } from "http";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import { RegisterRoutes } from "./routes/routes";
import * as swaggerJson from "../public/swagger.json";
import "./config/redis";
import { initSocket } from "./config/socket";
import * as dotenv from "dotenv";
import { startBirthdayCron } from "./jobs/birthday.job";

dotenv.config();

const app: Application = express();
const server = createServer(app);

// Middlewares
app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJson));

/**
 * 🔥 IMPORTANT PART
 */
const apiRouter = express.Router();

// Register all routes into this router
RegisterRoutes(apiRouter);

// Mount router at /api
app.use("/api", apiRouter);

// Socket + Jobs
initSocket(server);
startBirthdayCron();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API base: http://localhost:${PORT}/api`);
  console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
});