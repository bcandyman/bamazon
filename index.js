const mysql = require("mysql")
const inquirer = require("inquirer");



//contructor to create objects used for inquirer
class InqUserPrompt {
    constructor(name, type, message, choices) {
        this.name = name;
        this.type = type;
        this.message = message;

        if (type === "list") {
            this.choices = choices;
        }

        if (type === "number") {
            this.validate = function (val) {
                if (val === "") {
                    return "Please enter the ID of the item you would like to purchase"
                }
                return true
            };
            this.filter = function (val) {
                if ((isNaN(val)) || (val <= 0)) {
                    return ""
                }
                return val
            }
        }
    }
}


//add parameters for sql database
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "sqlPassword",
    database: "bamazon_db"
});


//connect to sql database
connection.connect(function (err) {
    if (err) {
        throw err
    };

    //display available inventory
    displayInventory();
})


//this function prompts user for available commands
runSearch = () => {
    promptUser = (prompt) => {
        inquirer.prompt(prompt).then(function (ans) {
            switch (ans.action) {
                case "Make a purchase":
                    purchase();
                    break;
                case "View inventory":
                    displayInventory();
                    break;
                case "exit":
                    connection.end()
                    return
            }
        });
    }
    //create display object for inquirer
    const choices = ["View inventory", "Make a purchase", "exit"]
    const userPrompt = new InqUserPrompt("action", "list", "What would you like to do?", choices);
    //call prompt user inquire
    promptUser({ ...userPrompt })
}




//this function displays available items within the sql database
function displayInventory() {
    //get all items from sql database
    connection.query("SELECT * FROM products INNER JOIN departments ON products.department_id = departments.department_id", (err, res) => {
        if (err) {
            reject(err);
        };

        //this method created consistent string length and is used to ensure proper inventory display
        //txt = desired text to return
        //len = desired length of return string
        fixLen = (txt, len) => {
            const spcCount = len - txt.toString().length
            return txt + " ".repeat(spcCount)
        }

        //display table header for inventory table
        console.log(fixLen("ID", 4) + "|" + fixLen("Product", 20) + "|" + fixLen("Department", 15) + "|" + fixLen("Price", 10) + "|" + fixLen("Qty", 6))
        
        //loop through each item in the database
        for (let i = 0; i < res.length; i++) {
            let item = res[i]
            //display item and contents
            console.log(fixLen(item.item_id, 4) + "|" + fixLen(item.product_name, 20) + "|" + fixLen(item.department_name, 15) + "|" + fixLen(item.price, 10) + "|" + fixLen(item.stock_quantity, 6));
        }
        console.log("-----------------------------------");

        //display user commands
        runSearch()
    });
}





purchase = () => {
    promptUser = (prompt) => {
        inquirer.prompt(prompt).then(function (ans) {

            let qtySold = ans.qty

            connection.query("SELECT * FROM products WHERE item_id = " + ans.item, function (err, res) {

                if (err) {
                    console.log(err)
                }

                const item = res[0]
                currQty = res[0].stock_quantity


                // if order cannot be fulfilled
                if (item.stock_quantity - qtySold < 0) {
                    //display to user order of item cannot be fulfilled
                    console.log("Sorry, we don't have that many " + item.product_name + "s");


                    //create prompt object to ask if user want to purchase available stock
                    const userPrompt = new InqUserPrompt("purchaseRemaining", "confirm", "We only have " + item.stock_quantity + ". Would you like to purchase our remaining items?");
                    //promput user
                    inquirer.prompt({ ...userPrompt }).then(function (resp) {
                        //if user wants to purchase remaining stock
                        if (resp.purchaseRemaining) {
                            //adjust requested quantity to available stock
                            qtySold = item.stock_quantity
                            //update sql database
                            connection.query("UPDATE products SET stock_quantity = stock_quantity - " + qtySold + " WHERE item_id = " + ans.item, function (err, res) {
                                displayInventory()
                            })
                        }

                        //if user doesn't want to purchase ramaining stock
                        else {
                            displayInventory()
                        }
                    })
                }

                //if order request can be fulfilled
                else {
                    //update sql database
                    connection.query("UPDATE products SET stock_quantity = stock_quantity - " + qtySold + " WHERE item_id = " + ans.item, function (err, res) {

                        if (err) {
                            console.log(err)
                        }

                        //display order details
                        console.log("You owe $" + item.price * qtySold + " plus tax!");
                        console.log("Thank you!!");

                        //keep order details focused before displaying inventory
                        setTimeout(() => {
                            displayInventory()
                        }, 5000);
                    })
                }
            });
        })
    };

    //create user prompt object
    const userItemPrompt = new InqUserPrompt("item", "number", "What item would you like to purchase?");
    const userQtyPrompt = new InqUserPrompt("qty", "number", "How many?");
    const userPrompt = [{ ...userItemPrompt }, { ...userQtyPrompt }];
    //prompt user
    promptUser(userPrompt)
}
