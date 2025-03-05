const express = require("express");
const {
  createDepartment,
  getAllDepartments,
  deleteDepartment,
} = require("../controllers/departmentController");
const { authenticate, authorize } = require("../middlewares/auth");

const router = express.Router();

router.get("/", authenticate, getAllDepartments);
router.post("/", authenticate, authorize(["admin"]), createDepartment);
router.delete("/:id", authenticate, authorize(["admin"]), deleteDepartment);

module.exports = router;
