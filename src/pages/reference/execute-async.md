---
title: ExecuteAsync
---

The `ExecuteAsync` method is used to **asynchronously** execute a SQL statement against a database.

## For any query or stored procedure

{% method-descriptor %}
```json
{
    "syntax" : "ExecuteAsync(\r\t[{commandTimeout}]\r\t[,{connection}]\r\t[,{cancellationToken}]\r)",
    "arguments" : [
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

## For `SelectOne` or `SelectMany` queries and stored procedures

{% method-descriptor %}
```json
{
    "syntax" : "ExecuteAsync(\r\t[{commandTimeout}]\r\t[,{connection}]\r\t[,{read|map}]\r\t[,{cancellationToken}]\r)",
    "arguments" : [
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
Execute a `SelectOne` query selecting only 2 fields, but map those fields to a `Person`:
```csharp
Person? person = await db.SelectOne(
        dbo.Person.Id,
        dbo.Person.FirstName
    )
    .From(dbo.Person)
    .Where(dbo.Person.Id == 3)
    .ExecuteAsync(row => new Person 
        { 
            Id = row.ReadField()!.GetValue<long>(), 
            FirstName = row.ReadField()!.GetValue<string>()
        });
                    
Console.WriteLine($"[{person.Id}]: Last Name: {person.LastName}, First Name: {person.FirstName}");
// [3]: Last Name: , First Name: Joe

```

Execute a `SelectOne` query selecting only 2 fields, but map those fields to a `Person` (note the method does not return anything):
```csharp
Person person = new Person { Id = 3, LastName = "Smith" };
await db.SelectOne<Person>()
    .From(dbo.Person)
    .Where(dbo.Person.Id == person.Id)
    .ExecuteAsync(row =>
        { 
            //the row has all columns from [dbo].[Person], but only mapping [Id] and [FirstName]
            person.Id = row.ReadField()!.GetValue<long>(), 
            person.FirstName = row.ReadField()!.GetValue<string>()
        });
                    
Console.WriteLine($"[{person.Id}]: Last Name: {person.LastName}, First Name: {person.FirstName}");
// [3]: Last Name: Smith, First Name: Joe

```

Execute a `SelectOne` query selecting only 2 fields, but modify one of the fields and return a new `dynamic` object:
```csharp
Person person = new Person { Id = 3, LastName = "Smith" };
dynamic? name = await db.SelectOne(
        dbo.Person.FirstName,
        dbo.Person.LastName
    )
    .From(dbo.Person)
    .Where(dbo.Person.Id == person.Id)
    .ExecuteAsync(row =>
    {
        var firstName = row.ReadField()!.GetValue<string>();
        firstName = firstName == "Joe" ? "Joseph" : firstName;
        return new { FirstName = firstName, LastName = row.ReadField()!.GetValue<string>() };
    });
                
Console.WriteLine($"[{person.Id}]: Last Name: {name.LastName}, First Name: {name.FirstName}");
// [3]: Last Name: Smith, First Name: Joseph

```

Execute a `SelectOne` query selecting only 1 field, and set a value on a `Person` variable, using a different value if the database value equals `Joe`:
```csharp
Person person = new Person { Id = 3, LastName = "Smith" };
await db.SelectOne(dbo.Person.FirstName)
    .From(dbo.Person)
    .Where(dbo.Person.Id == person.Id)
    .ExecuteAsync(value => person.FirstName = value == "Joe" ? "Joseph" : value);
                
Console.WriteLine($"[{person.Id}]: Last Name: {person.LastName}, First Name: {person.FirstName}");
// [3]: Last Name: Smith, First Name: Joseph

```
{% /accordian %}
