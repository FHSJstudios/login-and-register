// # 验证令牌

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import prismaListening from "../lib/prismaListening.js";

dotenv.config();

/**
 * 验证 JWT 令牌的中间件
 * @param {import('express').Request} req - 请求对象
 * @param {import('express').Response} res - 响应对象
 * @param {import('express').NextFunction} next - 下一个中间件函数
 */
async function authToken(req, res, next) {
  try {
    // 从请求头获取 token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log("没有token，可能是首次登录，请先登录");
      return next();
    }

    // 提取 token（Bearer token）
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({
            message: "Token已过期",
            code: 6,
          });
        } else {
          return res.status(401).json({
            message: "无效的token",
            code: 2,
          });
        }
      }
      req.body.username = decoded.username;
      req.body.password = decoded.password;
      next();
    });
  } catch (error) {
    console.error("验证token失败", error);
    next(error);
  } finally {
    await prismaListening.$disconnect();
  }
}

export default authToken;
