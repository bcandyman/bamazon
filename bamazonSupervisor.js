const mysql = require("mysql")
const inquirer = require("inquirer");
const InqUserPrompt = require("./utilities/inquirerPrompt.js");
const utilities = require("./utilities/dispSqlData")
const displayInventory = utilities.displayInventory
const querySql = utilities.querySql


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

    //display supervisor menu
    runSearch();
})


//this function prompts user for available commands
runSearch = () => {
    promptUser = (prompt) => {
        inquirer.prompt(prompt).then(function (ans) {
            switch (ans.action) {
                case "View Products for Sale":
                    displayInventory(connection)
                    // displayInventory()//("_", "runSearch")
                    break;

                case "View Low Inventory":
                    displayInventory(connection, "LowInventory")//, "runSearch")
                    break;

                case "Add to Inventory":
                    addToInventory()//("_", "addToInventory");
                    break;

                case "Add New Product":
                    addNewProduct()
                    break;

                case "exit":
                    connection.end()
                    return
            }
        });
    }
    //create display object for inquirer
    const choices = ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "exit"]
    const userPrompt = new InqUserPrompt("action", "list", "What would you like to do?", choices);
    //call prompt user inquire
    promptUser({ ...userPrompt })
}


addToInventory = () => {
    promptUser = (prompt) => {
        inquirer.prompt(prompt).then(function (ans) {

            let qtyToAdd = ans.qty

            querySql(connection, "SELECT * FROM products WHERE item_id = " + ans.item).then(function (res) {

                const item = res[0]

                //update sql database
                querySql(connection, "UPDATE products SET stock_quantity = stock_quantity + " + qtyToAdd + " WHERE item_id = " + ans.item).then(function (res) {

                    //display order details
                    console.log(qtyToAdd + " " + item.product_name + " added to the inventory");

                    //keep order details focused before displaying inventory
                    setTimeout(() => {
                        displayInventory(connection)
                    }, 5000);
                })
            });
        })
    };

    //create user prompt object
    const userItemPrompt = new InqUserPrompt("item", "number", "What item would you like to replenish?");
    const userQtyPrompt = new InqUserPrompt("qty", "number", "How many?");
    const userPrompt = [{ ...userItemPrompt }, { ...userQtyPrompt }];
    //prompt user
    promptUser(userPrompt)
}




addNewProduct = () => {

    promptUser = (prompt) => {
        inquirer.prompt(prompt).then(function (ans) {

            const itemName = ans.name
            const itemDept = ans.dept
            const itemPrice = ans.price
            const itemQty = ans.qty

            //get department id from departments table
            querySql(connection, "SELECT * FROM bamazon_db.departments WHERE department_name = '" + itemDept + "'").then(function (res) {
                const deptId = res[0].department_id

                //add new item to products table
                querySql(connection, "INSERT INTO products (`product_name`, `department_id`, `price`,`stock_quantity`) VALUES ('" + itemName + "'," + deptId + "," + itemPrice + "," + itemQty +")").then(function (res){

                        console.log(res.affectedRows + " product inserted!\n");

                        //keep details focused before displaying inventory
                        setTimeout(() => {
                            displayInventory(connection)
                        }, 5000);
                    })
            })
        });
    }

    //get departments from departments table to display in inquirer
    querySql(connection, "SELECT * FROM departments").then(function (res) {

        var depts = []

        for (row of res) {
            depts.push(row.department_name)
        }

        //create user prompt object
        const productNamePrompt = new InqUserPrompt("name", "input", "Input the item name");
        const productDeptPrompt = new InqUserPrompt("dept", "list", "Input the department in which the item belongs", depts);
        const productPricePrompt = new InqUserPrompt("price", "number", "Input the item price");
        const productQtyPrompt = new InqUserPrompt("qty", "number", "Input the item quantity to add to inventory");
        const userPrompt = [{ ...productNamePrompt }, { ...productDeptPrompt }, { ...productPricePrompt }, { ...productQtyPrompt }];

        promptUser(userPrompt)
    })
}
