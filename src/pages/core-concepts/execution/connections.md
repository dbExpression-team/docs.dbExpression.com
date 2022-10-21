---
title: Connections
---

When executing a singular QueryExpression, there is typically no need to manually manage the underlying connection. 
If you call `Execute` or `ExecuteAsync` on any query without providing a connection, the execution pipeline handles 
acquiring, opening, closing and disposing the underlying connection for you.  For instances where direct management 
of the connection is needed, you can retrieve an `ISqlConnection` from `db.GetConnection()`.

```csharp
using ISqlConnection connection = db.GetConnection();
connection.Open();
db.SelectOne(dbo.Person.LastName)
    .From(dbo.Person)
    .Where(dbo.Person.Id == 3)
    .Execute(connection);
connection.Close(); //optional when inside using
```

The `ISqlConnection` interface returned from `db.GetConnection()` is an abstract representation of the underlying ADO.NET 
connection objects.  If you need one of the underlying types, you can easily get to them.
```csharp
using ISqlConnection connection = db.GetConnection();
SqlConnector sc = (SqlConnector)connection; //get the actual SqlConnector
IDbConnection? idbConn = connection.DbConnection; //get the underlying ADO.NET IDbConnection
SqlConnection sqlConn = (SqlConnection)idbConn; //get the underlying ADO.NET SqlConnection  

```