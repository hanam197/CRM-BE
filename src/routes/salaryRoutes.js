const express = require("express");
const {
  createSalaryRecord,
  getSalaryRecords,
  updateSalaryRecord,
  deleteSalaryRecord,
} = require("../controllers/salaryController");
const { authenticate, authorize } = require("../middlewares/auth");

const router = express.Router();

// 🔹 Thêm lương nhân viên
router.post("/", authenticate, authorize(["admin"]), createSalaryRecord);

// 🔹 Lấy danh sách lương theo tháng/năm
router.get(
  "/",
  authenticate,
  authorize(["admin", "manager"]),
  getSalaryRecords
);

// 🔹 Cập nhật lương nhân viên
router.put("/:id", authenticate, authorize(["admin"]), updateSalaryRecord);

// 🔹 Xóa bảng lương
router.delete("/:id", authenticate, authorize(["admin"]), deleteSalaryRecord);

module.exports = router;
