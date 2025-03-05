const Salary = require("../models/Salary");
const Employee = require("../models/Employee");

// ✅ Thêm bảng lương cho nhân viên
exports.createSalaryRecord = async (req, res) => {
  try {
    const {
      employeeId,
      basicSalary,
      overtimeSalary,
      bonus,
      penalty,
      allowance,
      month,
      year,
    } = req.body;

    const employee = await Employee.findByPk(employeeId);
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    const totalSalary =
      basicSalary + overtimeSalary + bonus - penalty + allowance;

    const salaryRecord = await Salary.create({
      employeeId,
      basicSalary,
      overtimeSalary,
      bonus,
      penalty,
      allowance,
      totalSalary,
      month,
      year,
    });

    res
      .status(201)
      .json({ message: "Salary record created successfully", salaryRecord });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Lấy danh sách lương theo tháng/năm
exports.getSalaryRecords = async (req, res) => {
  try {
    const { month, year } = req.query;
    const whereClause = {};

    if (month) whereClause.month = month;
    if (year) whereClause.year = year;

    const salaryRecords = await Salary.findAll({
      where: whereClause,
      include: [
        {
          model: Employee,
          attributes: ["fullName", "position", "departmentId"],
        },
      ],
    });

    res.status(200).json(salaryRecords);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Cập nhật thông tin lương
exports.updateSalaryRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { basicSalary, overtimeSalary, bonus, penalty, allowance } = req.body;

    const salaryRecord = await Salary.findByPk(id);
    if (!salaryRecord)
      return res.status(404).json({ message: "Salary record not found" });

    const totalSalary =
      (basicSalary || salaryRecord.basicSalary) +
      (overtimeSalary || salaryRecord.overtimeSalary) +
      (bonus || salaryRecord.bonus) -
      (penalty || salaryRecord.penalty) +
      (allowance || salaryRecord.allowance);

    salaryRecord.basicSalary = basicSalary || salaryRecord.basicSalary;
    salaryRecord.overtimeSalary = overtimeSalary || salaryRecord.overtimeSalary;
    salaryRecord.bonus = bonus || salaryRecord.bonus;
    salaryRecord.penalty = penalty || salaryRecord.penalty;
    salaryRecord.allowance = allowance || salaryRecord.allowance;
    salaryRecord.totalSalary = totalSalary;

    await salaryRecord.save();
    res
      .status(200)
      .json({ message: "Salary record updated successfully", salaryRecord });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Xóa bảng lương
exports.deleteSalaryRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const salaryRecord = await Salary.findByPk(id);
    if (!salaryRecord)
      return res.status(404).json({ message: "Salary record not found" });

    await salaryRecord.destroy();
    res.status(200).json({ message: "Salary record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
