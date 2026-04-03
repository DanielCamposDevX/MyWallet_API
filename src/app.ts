import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import "express-async-errors";
import "reflect-metadata";
import "./shared/container/index.js";
import { errorMiddleware } from "./shared/infra/http/middlewares/ErrorMiddleware.js";
import router from "./shared/infra/http/router.js";
import { AppDataSource } from "./shared/infra/typeorm/data-source.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(router);
app.use(errorMiddleware);

const port = Number(process.env.PORT ?? 5000);

AppDataSource.initialize()
  .then(() => {
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  })
  .catch((error) => {
    console.error("Erro ao conectar no MySQL:", error);
    process.exit(1);
  });
