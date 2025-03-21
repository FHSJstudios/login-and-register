import prismaListening from "../lib/prismaListening.js";

//获取单个用户
async function getUser(username) {
  try {
    const user = await prismaListening.user.findUnique({
      where: {
        username: username,
      },
    });
    return user;
  } catch (error) {
    console.error("获取用户失败:", error);
    throw error;
  } finally {
    await prismaListening.$disconnect();
  }
}

export default getUser;
