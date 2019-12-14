//this function displays available items within the sql database
displayInventory = (connection, mode) => {

    let sqlCall = ""
    if (mode === "LowInventory") {
        sqlCall = "SELECT * FROM products INNER JOIN departments ON products.department_id = departments.department_id WHERE stock_quantity < 5"
        console.log("Low Inv Mode")
        console.log(sqlCall)
    }
    else {
        sqlCall = "SELECT * FROM products INNER JOIN departments ON products.department_id = departments.department_id"
    }

    //get items from sql database
    querySql(connection, sqlCall).then(function (res) {

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
    })
};


querySql = (connection, sqlCall) => {
    return new Promise(function (resolve, reject) {
        connection.query(sqlCall, (err, res) => {
            if (err) {
                reject(err);
            };
            resolve(res)
        })
    });
}

module.exports.querySql = querySql;
module.exports.displayInventory = displayInventory;