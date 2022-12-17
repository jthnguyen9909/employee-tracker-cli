const Department = require("./Department");
const Employee = require("./Employee");
const Role = require("./Role");

Department.hasMany(Employee, {
  foreignKey: "departmentId",
  onDelete: "CASCADE",
});

Employee.hasMany(Role, {
  foreignKey: "employeeId",
  onDelete: "CASCADE",
});

Employee.belongsTo(Department, {
  foreignKey: "departmentId",
  onDelete: "CASCADE",
});

Role.belongsTo(Employee, {
  foreignKey: "employeeId",
  onDelete: "CASCADE",
});

module.exports = { Department, Employee, Role };
