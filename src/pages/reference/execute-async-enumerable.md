---
title: ExecuteAsyncEnumerable
---

The `ExecuteAsyncEnumerable` method is used to **asynchronously* enumerate** the results of execution of 
a SQL statement.

## Any query type or stored procedure

{% method-descriptor %}
```json
{
    "syntax" : "ExecuteAsyncEnumerable(\r\t[{connection}]\r\t[,{commandTimeout}]\r\t[,{cancellationToken}]\r)",
    "arguments" : [
        {
            "argumentName" : "connection",
            "required" : false, 
            "description" : "A SQL connection to use for query execution.  dbExpression will open the connection if it isn't already open, and will honor a transaction if one has been started on an open connection." ,
            "types": [
                { 
                    "typeName" : "ISqlConnection"
                }
            ]
        },
		{
            "argumentName" : "commandTimeout",
            "required" : false, 
            "description" : "The execution duration (in seconds) of a query before execution will timeout if not yet complete." ,
            "types": [
                { 
                    "typeName" : "int"
                }
            ]
        },
		{
            "argumentName" : "cancellationToken",
            "required" : false, 
            "description" : "dbExpression will check at each stage of the execution pipeline workflow and throw an exception if the token has been cancelled.",
            "types": [
                { 
                    "typeName" : "CancellationToken" 
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}

---

## `SelectOne` or `SelectMany` queries and stored procedures

For `SelectOne` and `SelectMany` queries, execution signatures include delegates
for overriding the management of rowset data.  Use these delegates when the configurations for 
rowset data mapping needs to be replaced at the query level.  These signatures are available 
for queries for entities and dynamics - but not scalar values.

{% method-descriptor %}
```json
{
    "syntax" : "ExecuteAsyncEnumerable(\r\t[{commandTimeout}]\r\t[,{connection}]\r\t[,{read|map}]\r\t[,{cancellationToken}]\r)",
    "arguments" : [
        {
            "argumentName" : "connection",
            "required" : false, 
            "description" : "A SQL connection to use for query execution.  dbExpression will open the connection if it isn't already open, and will honor a transaction if one has been started on an open connection." ,
            "types": [
                { 
                    "typeName" : "ISqlConnection"
                }
            ]
        },
        {
            "argumentName" : "commandTimeout",
            "required" : false, 
            "description" : "The execution duration (in seconds) of a query before execution will timeout if not yet complete.",
            "types": [
                { 
                    "typeName" : "int" 
                }
            ]
        },
		{
            "argumentName" : "read",
            "required" : false, 
            "description" : "A delegate that enables you to take full control of the data reader returned from execution.  Invocations using this parameter DO NOT have a method return." ,
            "types": [
                { 
                    "typeName" : "Action<ISqlFieldReader>"
                }
            ]
        },
		{
            "argumentName" : "map",
            "required" : false, 
            "description" : "A delegate that enables you to take control of the mapping of rowset data.  Invocations using this parameter return value(s), you specify what it returns by the generic parameter `T`.",
            "types": [
                { 
                    "typeName" : "Func<ISqlFieldReader,T>" 
                }
            ]
        },
		{
            "argumentName" : "cancellationToken",
            "required" : false, 
            "description" : "dbExpression will check at each stage of the execution pipeline workflow and throw an exception if the token has been cancelled." ,
            "types": [
                { 
                    "typeName" : "CancellationToken"
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}

{% accordian caption="syntax examples" %}
Execute a `SelectMany` query and asynchronously serialize the data as it's received:
```csharp
await foreach (var person in 
        db.SelectMany(
            dbo.Person.Id,
            dbo.Person.FirstName + " " + dbo.Person.LastName
        )
        .From(dbo.Person)
        .ExecuteAsyncEnumerable())
{
    await JsonSerializer.SerializeAsync(stream, person);
}
```

```csharp
await foreach (var person in 
        db.SelectMany(
            dbo.Person.Id,
            dbo.Person.FirstName,
            bo.Person.LastName
        )
        .From(dbo.Person)
        .ExecuteAsyncEnumerable(row => new 
            { 
                Id = row.ReadField()!.GetValue<long>(), 
                FullName = $"{row.ReadField()!.GetValue<string>()} {row.ReadField()!.GetValue<string>()}"
            }))
{
    await JsonSerializer.SerializeAsync(stream, person);
}                   
```
{% /accordian %}

