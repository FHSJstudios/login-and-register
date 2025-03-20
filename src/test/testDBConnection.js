import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const testConnection = async () => {
  try {
    // 1. 测试数据库连接
    await prisma.$connect();
    console.log("✅ 数据库连接成功！");

    // 2. 获取数据库基本信息
    const dbInfo =
      await prisma.$queryRaw`SELECT current_database(), current_user, version()`;
    console.log("\n📌 数据库信息：");
    console.log("   数据库名称:", dbInfo[0].current_database);
    console.log("   当前用户:", dbInfo[0].current_user);
    console.log("   数据库版本:", dbInfo[0].version);

    // 3. 获取所有可用的数据模型
    const models = Object.keys(prisma).filter(
      (key) => !key.startsWith("$") && !key.startsWith("_")
    );

    console.log("\n📊 数据模型统计：");
    if (models.length === 0) {
      console.log("   ⚠️ 暂无可用的数据模型");
    } else {
      for (const model of models) {
        try {
          const count = await prisma[model].count();
          console.log(`   ${model}: ${count} 条记录`);
        } catch (err) {
          console.log(`   ❌ ${model}: 无法获取记录数`);
        }
      }
    }
  } catch (error) {
    console.error("\n❌ 错误信息：");
    console.error("   类型:", error.name);
    console.error("   描述:", error.message);
    if (error.code) {
      console.error("   错误代码:", error.code);
    }
  } finally {
    await prisma.$disconnect();
    console.log("\n👋 数据库连接已关闭");
  }
};

// 执行测试并添加全局错误处理
testConnection().catch((error) => {
  console.error("\n💥 发生未预期的错误：", error);
  process.exit(1);
});
