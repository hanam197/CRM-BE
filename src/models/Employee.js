const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Department = require("./Department");

const Employee = sequelize.define("Employee", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fullName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  phone: { type: DataTypes.STRING, allowNull: false },
  position: { type: DataTypes.STRING, allowNull: false }, // Chức vụ
  startDate: { type: DataTypes.DATEONLY, allowNull: false }, // Ngày vào làm
  status: {
    type: DataTypes.ENUM("active", "inactive", "resigned"),
    allowNull: false,
    defaultValue: "active",
  }, // Trạng thái làm việc
});

// Liên kết với bảng `Departments`
Employee.belongsTo(Department, {
  foreignKey: "departmentId",
  allowNull: false,
});
Department.hasMany(Employee, { foreignKey: "departmentId" });

module.exports = Employee;
