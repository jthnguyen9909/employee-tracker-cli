const Department = require("./Department");
const Employee = require("./Employee");
const Role = require("./Role");

Department.hasMany(Employee, {
  foreignKey: "departmentId",
  onDelete: "CASCADE",
});

Employee.belongsTo(Department, {
  foreignKey: "departmentId",
  onDelete: "CASCADE",
});

Employee.hasMany(Role, {
  foreignKey: "role_id",
  onDelete: "CASCADE",
});

Role.belongsTo(Employee, {
  foreignKey: "role_id",
  onDelete: "CASCADE",
});

module.exports = { Department, Employee, Role };
