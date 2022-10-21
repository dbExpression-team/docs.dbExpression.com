---
title: Factories and Services
---

dbExpression uses various services and factories to assemble a query into a SQL statement, 
and to execute that SQL statement against the database.  We won't be discussing all of these 
in detail in this section, but we'll hit the high points.  The important take-away is
dbExpression is extensible - any of the services/factories can be replaced by your own implementations.

> dbExpression is extensible by design.  Any factory or service can be replaced with your own implementation.

While factories can be completely replaced with your own implementations, most of the default factories/services 
can be customized. Typically customization of a default implementation is far less effort than providing your 
own implementation.

> Customization of default factories and services is typically far less effort than providing your own implementation.

The diagram below depicts the services and the order they are used:

{% query-execution-sequence-image /%}

## Statement Builder

The first stage of an execution pipeline is to take the `QueryExpression` and turn it into a SQL statement
for execution.  The statement builder (an implementation of `ISqlStatementBuilder`) mainly uses an appender (an implementation of an `IAppender`), a form
of a "writer" that's usee to construct the text part of a SQL statement.  The statement builder uses:
- element appenders to append the state of elements to an appender
- value converters to convert literal values for use in parameters
- parameter builder to turn literal values into parameters

{% accordian caption="example replacing a sql statement appender" %}
A new/custom implementation of an `IAppender`:
```csharp
...
public class MemoryStreamAppender : IAppender
{
    private readonly MemoryStream stream = new MemoryStream();
    
    public void Write(string value)
    {
        //implementation of writing to the memory stream
    }
    
    //other methods from IAppender interface...
    ... 
}
...
```
To configure this:
```csharp
...
services.AddDbExpression(
    dbex => dbex.AddDatabase<SimpleConsoleDb>(
        db => {
            ...
            db.SqlStatements.Assembly.StatementAppender.Use<MemoryStreamAppender>(); 
            // ^ dbExpression will use MemoryStreamAppenders to build SQL statements
            ...
        }
    )
);
...
```
{% /accordian %}

### Element Appender

An element appender is closely related to an [expression element](../../core-concepts/basics#expression-elements).
Expression elements capture the state while you fluently build a query, and an element appender takes that
state and writes it to the appender.  There are always multiple element appenders needed to construct a SQL statement.
Element appenders are an implementation of `IExpressionElementAppender<T>`, where the generic parameter `T` is the
expression element type it relates to.

### Value Converter (to the database)

When you provide literal values while fluently building a query, the execution pipeline will find a value converter
(implementations of `IValueConvert<T>`, where `T` is the type of the literal value)
for the literal value, and convert that value for use with a parameter.

{% accordian caption="example replacing a value converter" %}
Create a custom value converter to convert boolean values.  In this example, 
the database stores boolean values as strings - "T" and "F" instead of 1 and 0.

```csharp
public class MyBooleanValueConverter : IValueConverter<bool>
{
    public bool ConvertFromDatabase(object value)
        => value is null ? default : value == "T";

    public (Type, object) ConvertToDatabase(object value)
        => (typeof(string), value is null ? null : (value ? "T" : "F"));
}
```

Register the value converter in runtime configuration:
```csharp
services.AddDbExpression(
    dbex => dbex.AddDatabase<MyDatabase>(db => 
        {
            database.Conversions.ForTypes(x => x.ForValueType<bool>().Use<MyBooleanValueConverter>());
        }
    )
);
...
```
{% /accordian %}

### Parameter Builder

A parameter builder takes converted literal values and builds parameters for them.  A parameter builder is an implementation
of `ISqlParameterBuilder`.

## Statement Executor

The second stage of an execution pipeline is to take the assembled SQL statement and all parameters and execute against
the database.  The statement executor (an implementation of an `ISqlStatementExecutor`) uses:
- a database connection
- when the query is a *SELECT* operation expected to return zero or more entities, an entity factory and entity mapper
- value converters to convert database values as they are read from the database

### Connection

When a database command has been constructed and is ready for execution against the database, the execution pipeline
will create a connection (an implementation of `ISqlConnection`) to the database.  If you provided a connection with 
invokation of `Execute` or `ExecuteAsync`, the execution pipeline will use that connection.

### Entity Creation

When selecting entities from the database, the execution pipeline will use an implementation of `IEntityFactory<T>` to create
an instance of an entity for mapping the rowset data from the database.

### Entity Mapping

When selecting entities from the database, an entity mapper (an implementation of `IEntityMapper<T>`, where `T` is the entity type)
maps the rowset data to each entity instance.

## Value Converter (from the database)

All values read from the database are converted using a value converter (the same value converters used when converting literal
values going into the database).  Unless you override a value converter, the defaults basically convert from the database
provided type of `object` to a .NET CLR type.