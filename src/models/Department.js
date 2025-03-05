const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Department = sequelize.define(
  "Department",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true }, // Tên phòng ban
    description: { type: DataTypes.TEXT, allowNull: true }, // Mô tả
  },
  { timestamps: true }
);

module.exports = Department;
