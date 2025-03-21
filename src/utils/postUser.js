import prismaListening from "../lib/prismaListening.js";

/**
 * 创建新用户
 * @param {Object} user - 用户信息对象
 * @param {string} user.username - 用户名
 * @param {string} user.password - 已加密的密码
 * @returns {Promise<Object>} 创建的用户对象
 */
async function postUser(user) {
  try {
    const newUser = await prismaListening.user.create({
      data: {
        username: user.username,
        password: user.password, //加密后的密码
      },
    });
    return newUser;
  } catch (error) {
    console.error("创建用户失败:", error);
    throw new Error("创建用户失败");
  } finally {
    await prismaListening.$disconnect();
  }
}

export default postUser;
