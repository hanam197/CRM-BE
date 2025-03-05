const Department = require("../models/Department");

// ✅ Thêm phòng ban mới
exports.createDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newDepartment = await Department.create({ name, description });
    res
      .status(201)
      .json({
        message: "Department created successfully",
        department: newDepartment,
      });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Lấy danh sách phòng ban
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll();
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Xóa phòng ban
exports.deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    await Department.destroy({ where: { id } });
    res.status(200).json({ message: "Department deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
