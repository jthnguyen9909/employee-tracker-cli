const { prompt } = require("inquirer");
require("dotenv").config();
const db = require("./db");
const logo = require("asciiart-logo");
require("console.table");

init();

function init() {
  const mainLogo = logo({ name: "Employee Tracker" }).render();

  console.log(mainLogo);

  loadMainPrompts();
}

function loadMainPrompts() {
  prompt([
    {
      type: "list",
      name: "choice",
      message: "What do you want to do?",
      choices: [
        {
          name: "View All Employees",
          value: "view_employees",
        },
        {
          name: "View All Employees By Department",
          value: "view_employees_by_department",
        },
        {
          name: "View All Employees By Manager",
          value: "view_employees_by_manager",
        },
        {
          name: "Add Employee",
          value: "add_employee",
        },
        {
          name: "Remove Employee",
          value: "remove_employees",
        },
        {
          name: "Update Employee Role",
          value: "update_employee_role",
        },
        {
          name: "Update Employee Manager",
          value: "update_employee_manager",
        },
        {
          name: "View all Roles",
          value: "view_roles",
        },
        {
          name: "Add Role",
          value: "add_role",
        },
        {
          name: "Remove Role",
          value: "remove_role",
        },
        {
          name: "View All Departments",
          value: "view_departments",
        },
        {
          name: "Add Department",
          value: "add_department",
        },
        {
          name: "Remove Department",
          value: "remove_department",
        },
        {
          name: "View Budget Utilized By Department",
          value: "view_budget_by_department",
        },
        {
          name: "Quit",
          value: "quit",
        },
      ],
    },
  ]).then((res) => {
    let choice = res.choice;
    switch (choice) {
      case "view_employees":
        viewEmployees();
        break;
      case "view_employees_by_department":
        viewEmployeesByDepartment();
        break;
      case "view_employees_by_manager":
        viewEmployeesByManager();
        break;
      case "add_employee":
        addEmployee();
        break;
      case "remove_employees":
        removeEmployee();
        break;
      case "update_employee_role":
        updateEmployeeRole();
        break;
      case "update_employee_manager":
        updateEmployeeManager();
        break;
      case "view_roles":
        viewRoles();
        break;
      case "add_role":
        addRole();
        break;
      case "remove_role":
        removeRole();
        break;
      case "view_departments":
        viewDepartments();
        break;
      case "add_department":
        addDepartment();
        break;
      case "remove_department":
        removeDepartment();
        break;
      case "view_budget_by_department":
        viewBudgetByDepartment();
        break;
      case "quit":
        quit();
        break;
    }
  });
}

function viewEmployees() {
  db.findAllEmployees()
    .then(([rows]) => {
      let employees = rows;
      console.log("\n");
      console.table(employees);
    })
    .then(() => loadMainPrompts());
}

function viewEmployeesByDepartment() {
  db.findAllDepartments().then(([rows]) => {
    let departments = rows;
    const departmentChoices = departments.map(({ id, name }) => ({
      name: name,
      value: id,
    }));

    prompt([
      {
        type: "list",
        name: "departmentId",
        message: "Which department would you like to see employees for?",
        choices: departmentChoices,
      },
    ])
      .then((res) => db.findEmployeesByDepartment(res.departmentId))
      .then(([rows]) => {
        let employees = rows;
        console.log("\n");
        console.table(employees);
      })
      .then(() => loadMainPrompts());
  });
}

function viewEmployeesByManager() {
  db.findAllEmployees().then(([rows]) => {
    let managers = rows;
    const managerChoices = managers.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));

    prompt([
      {
        type: "list",
        name: "managerId",
        message: "Which employee do you want to see direct reports for?",
        choices: managerChoices,
      },
    ])
      .then((res) => db.findEmployeesByManager(res.managerId))
      .then(([rows]) => {
        let employees = rows;
        console.log("\n");
        if (employees.length === 0) {
          console.log("The selected employee has no direct reports");
        } else {
          console.table(employees);
        }
      })
      .then(() => loadMainPrompts());
  });
}

function addEmployee() {
  prompt([
    {
      type: "input",
      name: "first_name",
      message: "What is the employee's first name?",
    },
    {
      type: "input",
      name: "last_name",
      message: "What is the employee's last name?",
    },
  ]).then((res) => {
    let firstName = res.first_name;
    let lastName = res.last_name;

    db.findAllRoles().then(([rows]) => {
      let roles = rows;
      const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id,
      }));

      prompt({
        type: "list",
        name: "roleId",
        message: "What is the employee's role?",
        choices: roleChoices,
      }).then((res) => {
        let roleId = res.roleId;

        db.findAllEmployees().then(([rows]) => {
          let employees = rows;
          const managerChoices = employees.map(
            ({ id, first_name, last_name }) => ({
              name: `${first_name} ${last_name}`,
              value: id,
            })
          );

          managerChoices.unshift({ name: "None", value: null });

          prompt({
            type: "list",
            name: "managerId",
            message: "Who is the employee's manager?",
            choices: managerChoices,
          })
            .then((res) => {
              let employee = {
                manager_id: res.managerId,
                role_id: roleId,
                first_name: firstName,
                last_name: lastName,
              };

              db.createEmployee(employee);
            })
            .then(() =>
              console.log(`Added ${firstName} ${lastName} to the database`)
            )
            .then(() => loadMainPrompts());
        });
      });
    });
  });
}

function removeEmployee() {
  db.findAllEmployees().then(([rows]) => {
    let employees = rows;
    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));

    prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Which employee do you want to remove?",
        choices: employeeChoices,
      },
    ])
      .then((res) => db.removeEmployee(res.employeeId))
      .then(() => console.log("Removed employee from the database"))
      .then(() => loadMainPrompts());
  });
}

function updateEmployeeRole() {
  db.findAllEmployees().then(([rows]) => {
    let employees = rows;
    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));

    prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Which employee's role do you want to update?",
        choices: employeeChoices,
      },
    ]).then((res) => {
      let employeeId = res.employeeId;
      db.findAllRoles().then(([rows]) => {
        let roles = rows;
        const roleChoices = roles.map(({ id, title }) => ({
          name: title,
          value: id,
        }));

        prompt([
          {
            type: "list",
            name: "roleId",
            message: "Which role do you want to assign the selected employee?",
            choices: roleChoices,
          },
        ])
          .then((res) => db.updateEmployeeRole(employeeId, res.roleId))
          .then(() => console.log("Updated employee's role"))
          .then(() => loadMainPrompts());
      });
    });
  });
}

function updateEmployeeManager() {
  db.findAllEmployees().then(([rows]) => {
    let employees = rows;
    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));

    prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Which employee's manager do you want to update?",
        choices: employeeChoices,
      },
    ]).then((res) => {
      let employeeId = res.employeeId;
      db.findAllPossibleManagers(employeeId).then(([rows]) => {
        let managers = rows;
        const managerChoices = managers.map(
          ({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id,
          })
        );

        prompt([
          {
            type: "list",
            name: "managerId",
            message:
              "Which employee do you want to set as manager for the selected employee?",
            choices: managerChoices,
          },
        ])
          .then((res) => db.updateEmployeeManager(employeeId, res.managerId))
          .then(() => console.log("Updated employee's manager"))
          .then(() => loadMainPrompts());
      });
    });
  });
}

function viewRoles() {
  db.findAllRoles()
    .then(([rows]) => {
      let roles = rows;
      console.log("\n");
      console.table(roles);
    })
    .then(() => loadMainPrompts());
}

function addRole() {
  db.findAllDepartments().then(([rows]) => {
    let departments = rows;
    const departmentChoices = departments.map(({ id, name }) => ({
      name: name,
      value: id,
    }));

    prompt([
      {
        name: "title",
        message: "What is the name of the role?",
      },
      {
        name: "salary",
        message: "What is the salary of the role?",
      },
      {
        type: "list",
        name: "department_id",
        message: "Which department does the role belong to?",
        choices: departmentChoices,
      },
    ]).then((role) => {
      db.createRole(role)
        .then(() => console.log(`Added ${role.title} to the database`))
        .then(() => loadMainPrompts());
    });
  });
}

function removeRole() {
  db.findAllRoles().then(([rows]) => {
    let roles = rows;
    const roleChoices = roles.map(({ id, title }) => ({
      name: title,
      value: id,
    }));

    prompt([
      {
        type: "list",
        name: "roleId",
        message:
          "Which role do you want to remove? (Warning: This will also remove employees)",
        choices: roleChoices,
      },
    ])
      .then((res) => db.removeRole(res.roleId))
      .then(() => console.log("Removed role from the database"))
      .then(() => loadMainPrompts());
  });
}

function viewDepartments() {
  db.findAllDepartments()
    .then(([rows]) => {
      let departments = rows;
      console.log("\n");
      console.table(departments);
    })
    .then(() => loadMainPrompts());
}

function addDepartment() {
  prompt([
    {
      name: "name",
      message: "What is the name of the department?",
    },
  ]).then((res) => {
    let name = res;
    db.createDepartment(name)
      .then(() => console.log(`Added ${name.name} to the database`))
      .then(() => loadMainPrompts());
  });
}

function removeDepartment() {
  db.findAllDepartments().then(([rows]) => {
    let departments = rows;
    const departmentChoices = departments.map(({ id, name }) => ({
      name: name,
      value: id,
    }));

    prompt({
      type: "list",
      name: "departmentId",
      message:
        "Which department would you like to remove? (Warning: This will also remove associated roles and employees)",
      choices: departmentChoices,
    })
      .then((res) => db.removeDepartment(res.departmentId))
      .then(() => console.log(`Removed department from the database`))
      .then(() => loadMainPrompts());
  });
}

function viewBudgetByDepartment() {
  db.findDepartmentBudgets()
    .then(([rows]) => {
      let departments = rows;
      console.log("\n");
      console.table(departments);
    })
    .then(() => loadMainPrompts());
}

function quit() {
  console.log("Goodbye!");
  process.exit();
}
