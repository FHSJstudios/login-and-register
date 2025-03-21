import prismaListening from "../lib/prismaListening.js";
import getUser from "../utils/getUsers.js";
import encryptPassword from "../utils/cryption.js";
import postUser from "../utils/postUser.js";
//注册
async function register(req, res, next) {
  try {
    const { username, password } = req.body;

    // 参数验证
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "用户名和密码不能为空",
        field: !username ? "username" : "password",
      });
    }

    // 检查用户是否存在
    const existingUser = await getUser(username);
    if (existingUser) {
      return res.status(409).json({
        code: 1,
        success: false,
        message: "用户已存在",
        field: "username",
      });
    }

    // 从数据库获取加密配置
    const bcryptConfig = await encryptPassword(password);

    //加密密码并把加密后的密码和用户名传给postUser进行创建用户
    const newUser = await postUser({ username, password: bcryptConfig });

    return res.status(201).json({
      success: true,
      message: "注册成功",
      user: {
        code: 1,
        id: newUser.id,
        username: newUser.username,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    await prismaListening.$disconnect();
  }
}

export default register;
