//contructor to create objects used for inquirer
const inqPrompt = (name, type, message, choices) => {
    const inqPrompt = {
        name: name,
        type: type,
        message: message,
    }
    switch (type) {
        case "list":
                inqPrompt.choices = choices
            break
        case "number":
                inqPrompt.validate = function (val) {
                if (val === "") {
                    return "Please enter the ID of the item you would like to purchase"
                }
                return true
            };
            inqPrompt.filter = function (val) {
                if ((isNaN(val)) || (val <= 0)) {
                    return ""
                }
                return val
            }
    }
    return inqPrompt
}

// Export the inqPrompt which will be used for inquirer
module.exports = inqPrompt;