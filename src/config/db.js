const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false,
  }
);
// const sequelize = new Sequelize(process.env.DATABASE_URL);
sequelize
  .authenticate()
  .then(() => console.log("✅ Database connected successfully."))
  .catch((err) => console.error("❌ Database connection error:", err));

module.exports = sequelize;
