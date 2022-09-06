---
title: Dependency Injection
---

Any dbExpression services that is registered directly with Microsoft's service collection will be *ignored* by dbExpression.  dbExpression services *must* be registered using dbExpression's 
configuration builder for the specific database.

{% callout type="warning" title="Service Registration" %}
dbExpression services must be registered using dbExpression's configuration builder
{% /callout %}

For example, the ```MyDatabase``` database is configured for use with dbExpression as follows:
```csharp

services.AddDbExpression(
    dbex => dbex.AddMsSql2019Database<MyDatabase>(database => database.ConnectionString.Use(config.GetConnectionString("MyDatabase")))
);

...
```

After this minimal configuration, your services can be injected with a configured database by simply adding a constructor argument for the database.

For example, a fully configured instance of ```MyDatabase``` is injected into ```CustomerService``` and is ready to execute queries:

```csharp
...

public class CustomerService
{
    private readonly MyDatabase db;
    
    public CustomerService(MyDatabase db)
    {
        this.db = db ?? throw new ArgumentNullException(nameof(db));
    }
    
    public async Task<IList<Customer>> GetCustomersAsync(int offset, int limit)
    {
        return await db.SelectMany<Customer>() // <- db is an instance of MyDatabase
            .From(dbo.Customer)
            .OrderBy(
                dbo.Customer.LastName, 
                dbo.Customer.FirstName
            )
            .Offset(offset)
            .Limit(limit)
            .ExecuteAsync();
    }
}

...
```