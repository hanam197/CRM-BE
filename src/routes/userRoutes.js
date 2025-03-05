const express = require("express");
const {
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
} = require("../controllers/userController");
const { authenticate, authorize } = require("../middlewares/auth");

const router = express.Router();

// 🔹 Lấy danh sách user (Chỉ Admin & Manager)
router.get("/", authenticate, authorize(["admin", "manager"]), getAllUsers);

// 🔹 Thêm user (Chỉ Admin)
router.post("/", authenticate, authorize(["admin"]), createUser);

// 🔹 Cập nhật user (Chỉ Admin)
router.put("/:id", authenticate, authorize(["admin"]), updateUser);

// 🔹 Xóa user (Chỉ Admin)
router.delete("/:id", authenticate, authorize(["admin"]), deleteUser);

module.exports = router;
