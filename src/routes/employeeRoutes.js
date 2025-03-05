const express = require("express");
const {
  createEmployee,
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
  filterEmployees,
} = require("../controllers/employeeController");
const { authenticate, authorize } = require("../middlewares/auth");

const router = express.Router();

// 🔹 Lấy danh sách nhân viên
router.get("/", authenticate, authorize(["admin", "manager"]), getAllEmployees);

// 🔹 Thêm nhân viên mới
router.post("/", authenticate, authorize(["admin"]), createEmployee);

// 🔹 Cập nhật thông tin nhân viên
router.put("/:id", authenticate, authorize(["admin"]), updateEmployee);

// 🔹 Xóa nhân viên
router.delete("/:id", authenticate, authorize(["admin"]), deleteEmployee);

// 🔹 Lọc nhân viên theo phòng ban hoặc trạng thái làm việc
router.get(
  "/filter",
  authenticate,
  authorize(["admin", "manager"]),
  filterEmployees
);

module.exports = router;
