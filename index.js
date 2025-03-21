import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { PrismaErrorMiddleware } from "./src/lib/PrismaError.js";
import register from "./src/api/register.js";
import login from "./src/api/login.js";
import authToken from "./src/utils/authToken.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

//跨域
app.use(cors());
//解析json
app.use(bodyParser.json());
//prisma 错误中间件处理
app.use(PrismaErrorMiddleware);

//项目后端测试
app.get("/health", (req, res) => {
  res.status(200).json({
    message: "OK",
  });
});

//用户注册
app.post("/api/register", register);

//用户登录
app.post("/api/login", authToken, login);

app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});
