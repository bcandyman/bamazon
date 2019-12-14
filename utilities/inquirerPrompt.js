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

// Exporting the InqUserPrompt constructor which we will use for inquirer
module.exports = InqUserPrompt;