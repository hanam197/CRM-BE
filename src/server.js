const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const salaryRoutes = require("./routes/salaryRoutes");
const leaveRoutes = require("./routes/leaveRoutes");

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/salaries", salaryRoutes);
app.use("/api/leaves", leaveRoutes);

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "localhost";

sequelize.sync({ force: false }).then(() => {
  console.log("Database synced");
  console.log(`🚀 Server running at: http://${HOST}:${PORT}`);
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
