const LeaveRequest = require("../models/LeaveRequest");
const Employee = require("../models/Employee");
const { Op } = require("sequelize");

// ✅ Nhân viên gửi yêu cầu nghỉ phép bằng email (Không cần đăng nhập)
exports.requestLeave = async (req, res) => {
  try {
    const { email, leaveType, startDate, endDate, reason } = req.body;

    // Tìm nhân viên theo email
    const employee = await Employee.findOne({ where: { email } });
    if (!employee)
      return res
        .status(404)
        .json({ message: "Employee not found with this email" });

    // Tính tổng số ngày nghỉ
    const totalDays =
      Math.ceil(
        (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
      ) + 1;

    // Tạo yêu cầu nghỉ phép
    const leaveRequest = await LeaveRequest.create({
      employeeId: employee.id,
      leaveType,
      startDate,
      endDate,
      totalDays,
      reason,
    });

    res
      .status(201)
      .json({ message: "Leave request submitted successfully", leaveRequest });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
// ✅ Lấy danh sách nghỉ phép của nhân viên theo email (Không cần đăng nhập)
exports.getLeaveRequestsByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    // Tìm nhân viên theo email
    const employee = await Employee.findOne({ where: { email } });
    if (!employee)
      return res
        .status(404)
        .json({ message: "Employee not found with this email" });

    // Lấy danh sách nghỉ phép của nhân viên
    const leaveRequests = await LeaveRequest.findAll({
      where: { employeeId: employee.id },
      order: [["startDate", "DESC"]], // Sắp xếp theo ngày gần nhất
    });

    res
      .status(200)
      .json({
        employee: { id: employee.id, fullName: employee.fullName },
        leaveRequests,
      });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Quản lý duyệt hoặc từ chối nghỉ phép
exports.approveOrRejectLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "approved" hoặc "rejected"

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const leaveRequest = await LeaveRequest.findByPk(id);
    if (!leaveRequest)
      return res.status(404).json({ message: "Leave request not found" });

    leaveRequest.status = status;
    await leaveRequest.save();

    res
      .status(200)
      .json({ message: `Leave request ${status} successfully`, leaveRequest });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Lấy danh sách yêu cầu nghỉ phép (có thể lọc theo trạng thái)
exports.getLeaveRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const whereClause = {};

    if (status) whereClause.status = status;

    const leaveRequests = await LeaveRequest.findAll({
      where: whereClause,
      include: [
        {
          model: Employee,
          attributes: ["fullName", "position", "departmentId"],
        },
      ],
    });

    res.status(200).json(leaveRequests);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Theo dõi số ngày phép còn lại của nhân viên
exports.getRemainingLeaveDays = async (req, res) => {
  try {
    const { employeeId } = req.params;

    // Tổng số ngày phép năm được cấp (mặc định 12 ngày/năm)
    const totalAnnualLeave = 12;

    // Tính tổng số ngày phép đã dùng trong năm hiện tại
    const usedLeave = await LeaveRequest.sum("totalDays", {
      where: {
        employeeId,
        leaveType: "annual",
        status: "approved",
        startDate: { [Op.gte]: new Date(new Date().getFullYear(), 0, 1) }, // Chỉ tính nghỉ phép từ đầu năm
      },
    });

    const remainingLeave = totalAnnualLeave - (usedLeave || 0);

    res
      .status(200)
      .json({ employeeId, totalAnnualLeave, usedLeave, remainingLeave });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
