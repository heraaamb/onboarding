import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import employeesRoutes from "./routes/employeesRoutes";
import tasksRoutes from "./routes/tasksRoutes";
import employeeQueriesRoute from "./routes/employeeQueriesRoute";
import usersRoute from "./routes/usersRoute"
import authloginRoute from "./routes/authLoginRoute"
import authChangePasswordRoute from "./routes/authChangePasswordRoute"
import documentUploadRoute from "./routes/DocumentUploadRoute"
import departmentsRoute from "./routes/DepartmentsRoute"
import pool from "./db/db";

dotenv.config();

const app = express();
const port: number = parseInt(process.env.PORT || "3001", 10);

const initializeDatabase = async () => {
  try {
    await pool.connect();
    console.log("==== Database Connected Successfully ======");
  } catch (err) {

    console.error("==== Error while connecting to database ======", err);
    process.exit(1);
  }
};

const configureMiddleware = () => {
  app.use(
    cors({
      origin: '*',
      // origin: 'http://localhost:4200',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
  );
  app.use(express.json());
};

const registerRoutes = () => {
  app.get("/", (req: Request, res: Response) => {
    res.send("It works");
  });

  app.get("/api", (req: Request, res: Response) => {
    res.send("API Working");
  });

  app.use("/api/employees", employeesRoutes);
  app.use("/api/tasks", tasksRoutes);
  app.use("/api/users", usersRoute);
  app.use("/api/employee-queries", employeeQueriesRoute);
  app.use("/api/auth-login", authloginRoute);
  app.use("/api/auth-change-password", authChangePasswordRoute);
  app.use("/api/help", authloginRoute);
  app.use("/api/document-upload", documentUploadRoute);
  app.use("/api/departments", departmentsRoute);
};

const handleErrors = () => {
  app.use((req: Request, res: Response) => { 
    res.status(404).send("Route not found");
  });
};

const startServer = () => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

const initializeApp = async () => {
  await initializeDatabase();
  configureMiddleware();
  registerRoutes();
  handleErrors();
  startServer();
};

initializeApp();

export default app;