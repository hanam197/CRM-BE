const Employee = require("../models/Employee");
const Department = require("../models/Department");

// ✅ Thêm nhân viên mới (Không liên kết User)
exports.createEmployee = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      position,
      departmentId,
      salary,
      startDate,
      status,
    } = req.body;

    const existingEmployee = await Employee.findOne({ where: { email } });
    if (existingEmployee)
      return res.status(400).json({ message: "Email already exists" });

    const newEmployee = await Employee.create({
      fullName,
      email,
      phone,
      position,
      departmentId,
      salary,
      startDate,
      status,
    });
    res.status(201).json({
      message: "Employee created successfully",
      employee: newEmployee,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Lấy danh sách nhân viên (kèm thông tin phòng ban)
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll(
      { include: [Department] },
      {
        model: Salary,
        attributes: ["overtimeSalary", "bonus", "totalSalary", "month", "year"],
        order: [
          ["year", "DESC"],
          ["month", "DESC"],
        ], // Lấy lương thực nhận mới nhất
        limit: 1,
      }
    );
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Cập nhật thông tin nhân viên
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, phone, position, departmentId, salary, status } =
      req.body;

    const employee = await Employee.findByPk(id);
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    employee.fullName = fullName || employee.fullName;
    employee.phone = phone || employee.phone;
    employee.position = position || employee.position;
    employee.departmentId = departmentId || employee.departmentId;
    employee.salary = salary || employee.salary;
    employee.status = status || employee.status;

    await employee.save();
    res
      .status(200)
      .json({ message: "Employee updated successfully", employee });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Xóa nhân viên
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findByPk(id);
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    await employee.destroy();
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Lọc nhân viên theo phòng ban hoặc trạng thái làm việc
exports.filterEmployees = async (req, res) => {
  try {
    const { departmentId, status } = req.query;
    const whereClause = {};

    if (departmentId) whereClause.departmentId = departmentId;
    if (status) whereClause.status = status;

    const employees = await Employee.findAll({
      where: whereClause,
      include: [Department],
    });
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
