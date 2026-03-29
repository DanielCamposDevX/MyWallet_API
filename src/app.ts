import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { AppDataSource } from "./database/data-source.js";
import router from "./router.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(router);

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
