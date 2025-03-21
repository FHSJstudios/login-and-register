import { Prisma } from "@prisma/client";

//prisma 错误处理工具函数

/**
 * Prisma 错误处理中间件
 * @param {Error} err - 错误对象
 * @param {import('express').Request} req - 请求对象
 * @param {import('express').Response} res - 响应对象
 * @param {import('express').NextFunction} next - 下一个中间件函数
 */
export function PrismaErrorMiddleware(err, req, res, next) {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // 处理已知的 Prisma 错误
    switch (err.code) {
      case "P2002": // 唯一约束违反
        return res.status(409).json({
          success: false,
          message: "数据已存在",
          field: err.meta?.target?.[0],
        });
      case "P2025": // 记录未找到
        return res.status(404).json({
          success: false,
          message: "未找到请求的资源",
        });
      case "P2003": // 外键约束失败
        return res.status(400).json({
          success: false,
          message: "关联数据不存在",
          field: err.meta?.field_name,
        });
      case "P2014": // 无效的ID或关系
        return res.status(400).json({
          success: false,
          message: "无效的ID或关系",
        });
      default:
        console.error("Prisma Error:", err);
        return res.status(500).json({
          success: false,
          message: "数据库操作失败",
        });
    }
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    // 处理验证错误
    return res.status(400).json({
      success: false,
      message: "数据验证失败",
      details: err.message,
    });
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    // 处理初始化错误
    console.error("Database Initialization Error:", err);
    return res.status(500).json({
      success: false,
      message: "数据库连接失败",
    });
  }

  // 处理其他错误
  console.error("Unhandled Error:", err);
  return res.status(500).json({
    success: false,
    message: "服务器内部错误",
  });
} 

export default PrismaErrorMiddleware;