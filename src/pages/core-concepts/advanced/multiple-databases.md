---
title: Multiple Databases
description: How to use multiple databases in query expressions.
---

***This section applies when dbExpression is used in static mode.  This section is not applicable if you are using dependency injection***.

Using multiple databases with dbExpression in a single code file is completely feasible - there is nothing inherent to dbExpresssion that precludes the use of multiple databases.  However, namespace collisions are likely.  This is because (*by default*) scaffolding produces a database accessor named `db` to use for fluently building queries (unless overridden in scaffolding).  If you have scaffolded more than one database, both databases will expose a `db` entry point for building queries.  The .NET compiler will have ambiguity in the type `db` originating from two different namespaces.  There are two solutions:
* *using alias directive(s)* at the top of any file that uses two or more databases
* Apply overrides to scaffolding to generate different database accessor names, database names, and/or schema names for one (or more) of the databases.  *This approach is global in nature*, it is highly recommended this decision is made prior to authoring a lot of queries using `db`.  If you are using dbExpression to migrate data from one database to another where the schema (and/or database names) are identical, this is the viable solution.

## Using Alias Directive

For example, given two databases that have been scaffolded with `rootNamespace` values 'ACME.Customer' and 'ACME.Sales' (see [Scaffold Configuration](../../core-concepts/configuration/scaffolding)).  When scaffolded using the dbExpression CLI tool, both of these will contain a `db` type (`ACME.Customer.DataService.db` and `ACME.Sales.DataService.db`).  To use both of these in a single file and remove ambiguity to the compiler, add a *using alias directive* to the top of the file for each database accessor:

```csharp
...
using ACME.Customer.DataService;
using ACME.Customer.dboData;
using ACME.Sales.DataService;
using ACME.Sales.dboData;
...

// using alias directive for 'Customer' database accessor
using customer_db = ACME.Customer.DataService.db;
// using alias directive for 'Sales' database accessor
using sales_db = ACME.Sales.DataService.db;

namespace ACME.CRM
{
    public class CustomerService
    {
        public (Customer, IEnumerable<Orders>) GetOrdersByCustomerId(int customerId)
        {
            Customer customer = customer_db.SelectMany<Customer>()  
				// ^ 'customer_db' instead of 'db'
                .From(customer_db.dbo.Customer)  
				// ^ disambiguate 'dbo' with the database accessor, 'customer_db'
                .Where(customer_db.dbo.Customer.Id == customerId)  
				// ^ disambiguate 'dbo' with the database accessor, 'customer_db'
                .Execute();
                
            IEnumerable<Order> orders = sales_db.SelectMany<Order>())  
				// ^ 'sales_db' instead of 'db'
                .From(sales_db.dbo.Order)  
				// ^ disambiguate 'dbo' with the database accessor, 'sales_db'
                .Where(sales_db.dbo.Order.CustomerIdentifier == customer.Identifier)  
				// ^ disambiguate 'dbo' with the database accessor, 'sales_db'
                .Execute();
                
            return (customer, orders);
        }
    }
}
```

## Using Scaffolding Overrides

Continuing the "ACME" example from above, to disambiguate the `db` accessor from two different databases in a single code file, an alternative is to change the code through scaffolding.  In the configuration file used for scaffolding the *Customer* database (i.e. `dbex.config.json`), ensure the following configuration:
```json
{
    ...
    "databaseAccessor": "customer_db"
    ...
    "overrides [...]"
}
```
Scaffold the code using the dbExpression CLI tool (`dbex gen`).

In the configuration file used for scaffolding the *Sales* database (i.e. `dbex.config.json`), ensure the following configuration:
```json
{
    ...
    "databaseAccessor": "sales_db"
    ...
    "overrides [...]"
}
```
Scaffold the code using the dbExpression CLI tool (`dbex gen`).

Now, the same code sample above becomes:
```csharp
...
using ACME.Customer.DataService;
using ACME.Customer.dboData;
using ACME.Sales.DataService;
using ACME.Sales.dboData;
...

namespace ACME.CRM
{
    public class CustomerService
    {
        public (Customer, IEnumerable<Orders>) GetOrdersByCustomerId(int customerId)
        {
            Customer customer = customer_db.SelectMany<Customer>()  
				// ^ 'customer_db' instead of 'db'
                .From(customer_db.dbo.Customer)  
				// ^ disambiguate 'dbo' with the database accessor, 'customer_db'
                .Where(customer_db.dbo.Customer.Id == customerId)  
				// ^ disambiguate 'dbo' with the database accessor, 'customer_db'
                .Execute();
                
            IEnumerable<Order> orders = sales_db.SelectMany<Order>())  
				// ^ 'sales_db' instead of 'db'
                .From(sales_db.dbo.Order)  
				// ^ disambiguate 'dbo' with the database accessor, 'sales_db'
                .Where(sales_db.dbo.Order.CustomerIdentifier == customer.Identifier)  
				// ^ disambiguate 'dbo' with the database accessor, 'sales_db'
                .Execute();
                
            return (customer, orders);
        }
    }
}
```

The only difference is the removal of the *using alias directive(s)* at the top, as now the need for these are mitigated by the different database accessor type names in the scaffold code.