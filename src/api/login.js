import getUser from "../utils/getUsers.js";
import bcrypt from "bcrypt";
import prismaListening from "../lib/prismaListening.js";
import generationToken from "../utils/generationToken.js";
import dotenv from "dotenv";

dotenv.config();

// 用户登录
async function login(req, res, next) {
  try {
    const { username, password } = req.body;

    // 普通登录流程

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "用户名和密码不能为空",
        field: !username ? "username" : "password",
      });
    }

    //检查用户是否存在
    const user = await getUser(username);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "用户名或密码错误",
      });
    }

    //检查密码是否正确
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "用户名或密码错误",
      });
    }

    //生成token
    const token = generationToken(
      { username, password },
      process.env.ACCESS_TOKEN_EXPIRES_IN || "24h"
    );

    //返回用户信息和token
    return res.status(200).json({
      success: true,
      message: "登录成功",
      user: {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    next(error);
  } finally {
    await prismaListening.$disconnect();
  }
}
export default login;
