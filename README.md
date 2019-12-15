# bamazon


### About bamazon


Bamazon is a node application that displays how inventory might be tracked by a retail
business. Inventory stock and prices will be relayed to both the customer and the supervisor.
Bamazon utilizes an SQL database to track inventory and is required for operation. Two tables
are used for these applications. The products table contains products that are included in the
inventory. The departments table contains all departments along with an ID of the department.
The ID is used when defining the department the item belongs to from the products table. 

The two applications within the bamazon suite are:

    - bamazonCustomer:
        This application displays inventory to the customer and creates a menu which allows the
        customer to select a product and the quantity of that product to purchase. Upon
        confirmation of the transaction, the total debt the customer must pay will be
        displayed. Once the transaction is complete the database will be updated to reflect the
        inventory after the sale has been made.

    - bamazonSupervisor:
        This application displays inventory to the supervisor as well as giving the options to
        update stock quantities and add new stock items. Two views of the inventory are
        selectable: the full inventory view and an inventory view that will only display items
        that are defined as "low inventory", which are items with an in-stock value less than
        or equal to 5 units. 



### Demonstration



### Requirements


    Below are the mandatory applications that are needed for bamazon to operate:

    -   SQL Database - Used to track product inventory.
    -   CLI (command line interface) - Used to start and interact with the bamazon applications.



### How to install bamazon

    1.  Fork bamazon to your github account and clone to a local folder. 
        Click below on the link for documentation on how to fork and clone from git. You will
        need a github account to complete this step.
        https://help.github.com/en/github/getting-started-with-github/fork-a-repo

    2.  If using a mac computer, open the terminal and navigate to the folder in which you
        cloned bamazon.

    3.  Once you are in the cloned folder within the terminal from the previous step, input the
        command 'npm install'. This will install all of the node packages needed by the
        application.

        Node packages that will be installed are:
        a.  Inquirer - https://www.npmjs.com/package/inquirer
        b.  mySQL - https://www.npmjs.com/package/mysql

    4.  Create the initial database and tables in mySQL. The scripts to create these items are
        included in this repository and are documented below.

        a.  filename:   bamazon_departments.sql
            *   This file will create the departments table with initial departments

        b.  filename: bamazon_products.sql
            *   This file will create the products table with initial products



### How to use bamazon as a customer

    1.  If using a mac computer, open the terminal and navigate to the folder in which you
        cloned bamazon.

    2.  Start the application with the 'bamazonCustomer.js' command.

    3.  Upon startup, the current inventory within the database will be displayed along with a
        customer menu asking what you would like to do. The results from the customer menu are
        list below:
        
        -   Make a purchase:  This option will display a menu with the below selections:

            -   What would you like to purchase?:  In this field, you must input the item ID of
                the product you would like to purchase. This ID will be shown in the inventory
                table.
            
            -   How many?:  Enter the quantity of the item you would like to purchase.

        -   exit: Exits the application

#####   Customer Notes and features

        -   When a transaction has been completed, the total cost of the transaction will be
            displayed.
        
        -   If you attempt to purchase an item that has a stock quantity of 0, a message will
            be displayed that states the vendor is out of stock of the selected item.
        
        -   If you attempt to purchase quantity of item that is greater than in the inventory,
            you will recieve a message stating that the order cannot be fulfilled and a prompt 
            will be given asking if the remaining stock would like to be purchased. 
            The results of this prompt are listed below:
            
            -   Y:  Remaining stock will be purchase and the transaction details will be shown.
            
            _   N:  The user will be directed back the main menu. Transaction will not be 
                    initiated.



### How to use bamazon as a supervisor

    1.  If using a mac computer, open the terminal and navigate to the folder in which you 
        cloned bamazon.

    2.  Start the application with the 'bamazonSupervisor.js' command.

    3.  Upon startup, the supervisor menu will be displayed. The results from the customer menu 
        are list below:

        -   View Products for Sale: This option will display all items. Units with a quantity 
            of 0 will be shown.

        -   View Low Iventory:  This option will display all items with a quantity less than 5 
            units.

        -   Add to Inventory:   This option allows stock to be added to an item that has 
            previously been added to the inventory. Upon selection, the user will be presented 
            with a menu that requests item ID for and quantity.

        -   Add New Product:    This option allow a new item to be added to the inventory. Upon 
            selection, the user will be presented with a menu that requests the product name, 
            product pricing and the quantity to add to the inventory.

        -   exit: Exits the application