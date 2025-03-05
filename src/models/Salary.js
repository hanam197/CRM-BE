const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Employee = require("./Employee");

const Salary = sequelize.define(
  "Salary",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Employee, key: "id" },
    },
    basicSalary: { type: DataTypes.FLOAT, allowNull: false }, // Lương cơ bản
    overtimeSalary: { type: DataTypes.FLOAT, defaultValue: 0 }, // Lương tăng ca
    bonus: { type: DataTypes.FLOAT, defaultValue: 0 }, // Thưởng dự án hoặc KPI
    penalty: { type: DataTypes.FLOAT, defaultValue: 0 }, // Khoản phạt
    allowance: { type: DataTypes.FLOAT, defaultValue: 0 }, // Phụ cấp khác
    totalSalary: { type: DataTypes.FLOAT, allowNull: false }, // Tổng lương thực nhận
    month: { type: DataTypes.INTEGER, allowNull: false }, // Tháng
    year: { type: DataTypes.INTEGER, allowNull: false }, // Năm
  },
  { timestamps: true }
);

// Thiết lập quan hệ với Employee
Salary.belongsTo(Employee, { foreignKey: "employeeId" });
Employee.hasMany(Salary, { foreignKey: "employeeId" });

module.exports = Salary;
