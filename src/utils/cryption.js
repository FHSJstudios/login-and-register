import bcrypt from "bcrypt";
import prismaListening from "../lib/prismaListening.js";

//加密密码
async function encryptPassword(password) {
  try {
    const bcryptConfig = await prismaListening.bcrypt.findFirst({
      where: {
        id: "1",
      },
    });
    //如果加密配置不存在，则使用默认的加密配置
    const saltRounds = bcryptConfig.saltRounds || 10;
    //加密密码
    const encryptedPassword = await bcrypt.hash(password, saltRounds);
    return encryptedPassword;
  } catch (error) {
    console.error("加密密码失败:", error);
    throw new Error("加密密码失败");
  } finally {
    await prismaListening.$disconnect();
  }
}

export default encryptPassword;
