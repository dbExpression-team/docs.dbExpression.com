## What were we trying to achieve?
The motivation behind dbExpression was a desire to bring the capabilities of the data persistence engine into the hands of the application developer.  With dbExpression, the code that handles the basics of pushing data into and pulling data out of your target database is generated via a CLI tool.  We refer to this generated code as the dbExpression scaffolding.  The scaffolding contains all the classes and functional plumbing necessary to insert, update, delete and query your data with expressions that live directly within your application source code.  When you modify your target database in any way, regenerating the scaffolding exposes those changes to your application, keeping schema changes in sync with your application code.

 The data access code that enables the shuffling of data to and from the target database is monotonous, time consuming, and it is likely undergoing constant change.  If you add a table, you must then write some data access code to get data in and out of that table.  If you add a column to an existing table, you must modify the data access code that handles pushing and pulling data to and from that table.  If you delete a column from a table, you must modify the data access code.  If you split a table into two tables, you must modify the data access code.  If you change the data type of a column within a table, you must modify the data access code.

 What is all this data access code really doing? 
 * Opening (and hopefully) closing ADO.NET SqlConnections.
 * Intializing and configuring ADO.NET SqlCommands and SqlParameters
 * Mapping runtime data structures into ADO.NET SqlParameters
 * Executing ADO.NET SqlCommands.
 * Beginning, committing and rolling back ADO.NET SqlTransactions.
 * Reading ADO.NET SqlDataReader data.
 * Properly casting and converting SqlDataReader data from DbType to .NET CLR type.
 * Mapping converted SqlDataReader data into runtime data structures.

## Who is dbExpression for?
dbExpression is for application developers writing software targeting Microsoft SQL Server versions 2005+.

## Is dbExpression a proven solution?
The initial concept of scaffolding code via code generation and fluently building SQL queries started a few years ago.  The basic concepts and structure were implemented and utilized for numerous private consulting projects.  The tools have been used as the foundation to create dozens of large and small scale applications covering a wide range of software domains:
* Financial services
* Transaction processing
* Healthcare
* Education
* Non-profit
* Legal
* Real estate

As the number of developers using dbExpression grew and developers moved on to other opportunities, a closed community of users started to organically grow.  There was ever increasing pressure to open source the library and tools - hence dbExpression.
