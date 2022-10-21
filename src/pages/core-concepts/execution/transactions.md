---
title: Transactions
---

dbExpression will use a transaction if provided when executing a query.  If you 
need to start a new transaction, the `ISqlConnection` offers methods that enable
creation of transactions and full management of transactions.

The example below demonstrates how to execute multiple queries within a single transaction.  
```csharp
var p = new Person() { ... };
var a = new Address() { ... }

using ISqlConnection c = db.GetConnection(); //aquire a connection
try
{
    c.Open(); //open the connection
    c.BeginTransaction();// begin the transaction

    //the connection is provided on each expression exection
    db.Insert(p).Into(dbo.Person).Execute(c);
    db.Insert(a).Into(dbo.Address).Execute(c);
    var pa = new PersonAddress() { PersonId = p.id, AddressId = a.id };
    db.Insert(pa).Into(dbo.PersonAddress).Execute(c)

    c.CommitTransaction()// all is good, commit the transaction
    c.Close(); //optional when within using
}
catch
{
    c.RollbackTransaction(); //something exploded, roll the entire transaction back
}
```