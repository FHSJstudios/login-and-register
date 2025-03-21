// ### prisma 操作日志

import { PrismaClient } from "@prisma/client";

/**
 * Prisma 客户端实例
 * @type {PrismaClient}
 */
const prismaListening = new PrismaClient({
  log: ["query", "info", "warn", "error"],
  errorFormat: "pretty",
});

/**
 * 初始化 Prisma 事件监听器
 */
function initPrismaLogger() {
  try {
    // 监听信息
    prismaListening.$on("info", (e) => {
      console.info("Prisma 信息:", {
        timestamp: new Date().toISOString(),
        message: e.message,
      });
    });

    // 监听警告信息
    prismaListening.$on("warn", (e) => {
      console.warn("Prisma 警告:", {
        timestamp: new Date().toISOString(),
        message: e.message,
        target: e.target,
      });
    });

    // 监听错误信息
    prisma.$on("error", (e) => {
      console.error("Prisma 错误:", {
        timestamp: new Date().toISOString(),
        message: e.message,
        stack: e.stack,
      });
    });

    // 监听查询（开发环境使用）
    if (process.env.NODE_ENV === "development") {
      prismaListening.$on("query", (e) => {
        console.log("Prisma 查询:", {
          timestamp: new Date().toISOString(),
          query: e.query,
          params: e.params,
          duration: `${e.duration}ms`,
        });
      });
    }

    console.log("Prisma 事件监听器初始化成功");
  } catch (error) {
    console.error("Prisma 事件监听器初始化失败:", error);
    throw error;
  }
}

/**
 * 获取 Prisma 客户端实例
 * @returns {PrismaClient}
 */
function getPrismaClient() {
  return prismaListening;
}

/**
 * 关闭 Prisma 连接
 */
async function disconnectPrisma() {
  try {
    await prismaListening.$disconnect();
    console.log("Prisma 连接已关闭");
  } catch (error) {
    console.error("关闭 Prisma 连接失败:", error);
    throw error;
  }
}

export default prismaListening;
