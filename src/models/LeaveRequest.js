const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Employee = require("./Employee");

const LeaveRequest = sequelize.define(
  "LeaveRequest",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Employee, key: "id" },
    },
    leaveType: {
      type: DataTypes.ENUM("annual", "sick", "unpaid"),
      allowNull: false,
    }, // Loại nghỉ phép
    startDate: { type: DataTypes.DATEONLY, allowNull: false }, // Ngày bắt đầu nghỉ
    endDate: { type: DataTypes.DATEONLY, allowNull: false }, // Ngày kết thúc nghỉ
    totalDays: { type: DataTypes.INTEGER, allowNull: false }, // Tổng số ngày nghỉ
    reason: { type: DataTypes.TEXT, allowNull: true }, // Lý do nghỉ phép
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      allowNull: false,
      defaultValue: "pending",
    }, // Trạng thái nghỉ phép
  },
  { timestamps: true }
);

// Liên kết với bảng Employee
LeaveRequest.belongsTo(Employee, { foreignKey: "employeeId" });
Employee.hasMany(LeaveRequest, { foreignKey: "employeeId" });

module.exports = LeaveRequest;
