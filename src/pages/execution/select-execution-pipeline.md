---
title: Select Execution Pipeline
---

For SELECT operations (including QueryExpressions with a Query Type of ```SelectOne``` or ```SelectMany```), the following pipeline is executed:

![Select Query Expression Pipeline](https://dbexpressionpublic.blob.core.windows.net/docs/select-execution-pipeline.png)

When executing SELECT operations, the following additional events can be subscribed to:
* ```OnBeforeSelectQueryExecution``` - This event is fired *just before* the ```OnBeforeSqlStatementExecution``` event.
* ```OnAfterSelectQueryExecution``` - This event is fired *just after* the ```OnAfterSqlStatementExecution``` event.

In addition to ```commandTimeout``` and ```connection``` values that can be provided to the ```Execute``` and ```ExecuteAsync``` methods, execution of SELECT operations additionally support custom mapping via delegates:

* ```Func<ISqlFieldReader,TEntity>``` - when supplied, the delegate is responsible for mapping rowset values to and returning an entity.
```csharp
Person? person = db.SelectOne(
        dbo.Person.Id,
        dbo.Person.FirstName
    )
    .From(dbo.Person)
    .Where(dbo.Person.Id == 3)
    .Execute(row => new Person 
        { 
            Id = row.ReadField()!.GetValue<long>(), 
            FirstName = row.ReadField()!.GetValue<string>()
        });
                    
Console.WriteLine($"[{person.Id}]: Last Name: {person.LastName}, First Name: {person.FirstName}");
// [3]: Last Name: , First Name: Joe

```

* ```Action<ISqlFieldReader>``` - when supplied, the delegate is responsible for mapping rowset values and the execution will not return a value(s).
```csharp
Person person = new Person { Id = 3, LastName = "Smith" };
db.SelectOne<Person>()
    .From(dbo.Person)
    .Where(dbo.Person.Id == person.Id)
    .Execute(row =>
        { 
            //the row has all columns from [dbo].[Person], but only mapping [Id] and [FirstName]
            person.Id = row.ReadField()!.GetValue<long>(), 
            person.FirstName = row.ReadField()!.GetValue<string>()
        });
                    
Console.WriteLine($"[{person.Id}]: Last Name: {person.LastName}, First Name: {person.FirstName}");
// [3]: Last Name: Smith, First Name: Joe

```

* ```Func<ISqlFieldReader,T>``` - when supplied, the delegate will manage mapping a scalar value to a value that will be returned from execution.
```csharp
Person person = new Person { Id = 3, LastName = "Smith" };
dynamic? name = db.SelectOne(
        dbo.Person.FirstName,
        dbo.Person.LastName
    )
    .From(dbo.Person)
    .Where(dbo.Person.Id == person.Id)
    .Execute(row =>
    {
        var firstName = row.ReadField()!.GetValue<string>();
        firstName = firstName == "Joe" ? "Joseph" : firstName;
        return new { FirstName = firstName, LastName = row.ReadField()!.GetValue<string>() };
    });
                
Console.WriteLine($"[{person.Id}]: Last Name: {name.LastName}, First Name: {name.FirstName}");
// [3]: Last Name: Smith, First Name: Joseph

```

* ```Action<object>``` - when supplied, the delegate will manage mapping the returned scalar value and execution will not return a value(s).
```csharp
Person person = new Person { Id = 3, LastName = "Smith" };
db.SelectOne(dbo.Person.FirstName)
    .From(dbo.Person)
    .Where(dbo.Person.Id == person.Id)
    .Execute(value => person.FirstName = value == "Joe" ? "Joseph" : value);
                
Console.WriteLine($"[{person.Id}]: Last Name: {person.LastName}, First Name: {person.FirstName}");
// [3]: Last Name: Smith, First Name: Joseph

```