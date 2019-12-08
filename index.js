const mysql = require("mysql")
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "sqlPassword",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;

    console.log("connected as id ", connection.threadId);

    runSearch()

})



function runSearch() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View inventory",
                "Make a purchase",
                "exit"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "Make a purchase":
                    purchase();
                    break;
                case "View inventory":
                    displayInventory();
                    break;
            }
        });
}


function displayInventory() {
    connection.query("SELECT * FROM products INNER JOIN departments ON products.department_id = departments.department_id", function (err, response) {

        if (err) {
            throw err;
        };

        function fixLen(txt, len) {
            const spcCount = len - txt.toString().length
            return txt + " ".repeat(spcCount)
        }

        console.log(fixLen("ID", 4) + "|" + fixLen("Product", 20) + "|" + fixLen("Department", 15) + "|" + fixLen("Price", 10) + "|" + fixLen("Qty", 6))

        for (let i = 0; i < response.length; i++) {
            let item = response[i]
            console.log(fixLen(item.item_id, 4) + "|" + fixLen(item.product_name, 20) + "|" + fixLen(item.department_name, 15) + "|" + fixLen(item.price, 10) + "|" + fixLen(item.stock_quantity, 6));
        }
        console.log("-----------------------------------");
    });
    connection.end();
}


function purchase() {
    connection.query("SELECT product_name FROM products ", function (err, response) {
        inquirer
            .prompt([{
                name: "item",
                type: "number",
                message: "What item would you like to purchase?",
                validate: function (value) {
                    if (value === "") {
                        return "Please enter the ID of the item you would like to purchase"
                    }
                    return true
                },
                filter: function (value) {
                    if (isNaN(value)) {
                        return ""
                    }
                    return value
                }
            },
            {
                name: "quantity",
                type: "number",
                message: "How many?",
                validate: function (value) {
                    if (value === "") {
                        return "Enter numbers only!"
                    }
                    return true
                },
                filter: function (value) {
                    if (isNaN(value)) {
                        return ""
                    }
                    return value
                }
            }])
            .then(function (answer) {
                console.log(answer)
            });
        connection.end()
    })
}