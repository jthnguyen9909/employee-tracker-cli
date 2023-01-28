require("dotenv").config();

const sequelize = require("../config");
const { Department, Employee, Role } = require("../models");

const departmentSeed = require("./departments.json");
const employeeSeed = require("./employees.json");
const roleSeed = require("./roles.json");

const seedDB = async () => {
  await sequelize.sync({ force: true });
  await Department.bulkCreate(departmentSeed);
  await Employee.bulkCreate(employeeSeed);
  await Role.bulkCreate(roleSeed);

  process.exit();
};

seedDB();
