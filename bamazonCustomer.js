const mysql = require("mysql")
const inquirer = require("inquirer");
const InqUserPrompt = require("./utilities/inquirerPrompt.js");
const utilities = require("./utilities/dispSqlData.js");
const displayInventory = utilities.displayInventory;
const querySql = utilities.querySql;

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
    displayInventory(connection);
})


//this function prompts user for available commands
runSearch = () => {
    promptUser = (prompt) => {
        inquirer.prompt(prompt).then(function (ans) {
            switch (ans.action) {
                case "Make a purchase":
                    purchase(connection);
                    break;
                case "exit":
                    connection.end()
                    return
            }
        });
    }
    //create display object for inquirer
    const choices = ["Make a purchase", "exit"]
    const userPrompt = new InqUserPrompt("action", "list", "What would you like to do?", choices);
    //call prompt user inquire
    promptUser({ ...userPrompt })
}



purchase = () => {

    exitMsgPause = () => {
        setTimeout(() => {
            displayInventory(connection)
        }, 5000);
    }

    completeTransaction = (item, qtySold) => {
        querySql(connection, "UPDATE products SET stock_quantity = stock_quantity - " + qtySold + " WHERE item_id = " + item.item_id).then(function (res) {

            //display order details
            console.log("You owe $" + item.price * qtySold + " plus tax!");
            console.log("Thank you!!");

            exitMsgPause()
        })
    }

    promptUser = (prompt) => {
        inquirer.prompt(prompt).then(function (ans) {

            let qtySold = ans.qty

            querySql(connection, "SELECT * FROM products WHERE item_id = " + ans.item).then(function (res) {

                const item = res[0]
                currQty = res[0].stock_quantity


                // if order cannot be fulfilled
                if (item.stock_quantity === 0) {
                    //display to user order of item cannot be fulfilled
                    console.log("Sorry, " + item.product_name + "s are out of stock.");
                    exitMsgPause()
                }
                else if (item.stock_quantity - qtySold < 0) {
                    //display to user order of item cannot be fulfilled
                    console.log("Sorry, we do not have that many " + item.product_name + "s");

                    //create prompt object to ask if user want to purchase available stock
                    const userPrompt = new InqUserPrompt("purchaseRemaining", "confirm", "We only have " + item.stock_quantity + ". Would you like to purchase our remaining items?");
                    //promput user
                    inquirer.prompt({ ...userPrompt }).then(function (resp) {
                        //if user wants to purchase remaining stock
                        if (resp.purchaseRemaining) {
                            //adjust requested quantity to available stock
                            qtySold = item.stock_quantity
                            //update sql database
                            completeTransaction(item, qtySold)
                        }

                        //if user doesn't want to purchase remaining stock
                        else {
                            displayInventory(connection)
                        }
                    })
                }

                //if order request can be fulfilled
                else {
                    //update sql database
                    completeTransaction(item, qtySold)
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
