import express, { Application } from "express";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "./routes/routes";
import * as swaggerJson from "../public/swagger.json";

const app: Application = express();

app.use(express.json());

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJson));

// Register TSOA auto generated routes
RegisterRoutes(app);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
});