const express = require("express");
const {
  requestLeave,
  approveOrRejectLeave,
  getLeaveRequests,
  getRemainingLeaveDays,
  getLeaveRequestsByEmail,
} = require("../controllers/leaveController");
const { authenticate, authorize } = require("../middlewares/auth");

const router = express.Router();

// 🔹 Nhân viên gửi yêu cầu nghỉ phép ( không cần đăng nhập)
router.post("/", requestLeave);

// 🔹 Lấy danh sách nghỉ phép theo email (Không cần đăng nhập)
router.get("/by-email/:email", getLeaveRequestsByEmail);

// 🔹 Duyệt hoặc từ chối yêu cầu nghỉ phép (chỉ Admin & Manager)
router.put(
  "/:id",
  authenticate,
  authorize(["admin", "manager"]),
  approveOrRejectLeave
);

// 🔹 Lấy danh sách yêu cầu nghỉ phép
router.get(
  "/",
  authenticate,
  authorize(["admin", "manager"]),
  getLeaveRequests
);

// 🔹 Theo dõi số ngày phép còn lại của nhân viên
router.get(
  "/:employeeId/remaining-leave",
  authenticate,
  authorize(["admin", "manager", "staff"]),
  getRemainingLeaveDays
);

module.exports = router;
