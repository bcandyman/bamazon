const mysql = require("mysql")
const inquirer = require("inquirer");


class InqUserPrompt {
    constructor(name, type, message, choices) {
        this.name = name;
        this.type = type;
        this.message = message;

        if (type === "list") {
            this.choices = choices;
        }

        if (type === "number") {
            this.validate = function (value) {
                if (value === "") {
                    return "Please enter the ID of the item you would like to purchase"
                }
                return true
            };
            this.filter = function (value) {
                if (isNaN(value)) {
                    return ""
                }
                return value
            }
        }
    }
}


const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "sqlPassword",
    database: "bamazon_db"
});





runSearch = () => {
    promptUser = (prompt) => {
        inquirer.prompt(prompt).then(function (answer) {
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

    const choices = ["View inventory", "Make a purchase", "exit"]
    const userPrompt = new InqUserPrompt("action", "list", "What would you like to do?", choices);
    promptUser({ ...userPrompt })

}





displayInventory = () => {
    connection.query("SELECT * FROM products INNER JOIN departments ON products.department_id = departments.department_id", (err, response) => {

        if (err) {
            throw err;
        };

        fixLen = (txt, len) => {
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




purchase = () => {
    promptUser = (prompt) => {
        inquirer.prompt(prompt).then(function (answer) {

            const qtySold = answer.qty

            connection.query("SELECT * FROM products WHERE item_id = " + answer.item, function (err, response) {

                if (err) {
                    console.log(err)
                }

                const item = response[0]
                currQty = response[0].stock_quantity

                if (item.stock_quantity - qtySold < 0) {
                    console.log("Sorry, we don't have that many " + item.product_name + "s");
                }

                else {
                    connection.query("UPDATE products SET stock_quantity = stock_quantity - " + qtySold + " WHERE item_id = 1", function (err, response) {

                        if (err) {
                            console.log(err)
                        }

                        console.log("You owe $" + item.price * qtySold + " plus tax!");
                        console.log("Thank you!!");
                    })
                }
                connection.end()
            });
        })
    };

    const userItemPrompt = new InqUserPrompt("item", "number", "What item would you like to purchase?");
    const userQtyPrompt = new InqUserPrompt("qty", "number", "How many?");
    const userPrompt = [{ ...userItemPrompt }, { ...userQtyPrompt }];

    promptUser(userPrompt)
}






runSearch()