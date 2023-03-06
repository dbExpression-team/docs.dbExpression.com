---
title: Update Statements
description: Fluently build an UPDATE sql statement using dbExpression.
todo: create reference link to update statement once docs for select statement are completed (/reference/statements/update-statement)
  [this was after the first example:] See [Advanced Queries (Arithmetic)](/advanced/arithmetic) section for more detail on using server side arithmetic.
---

Using dbExpression, you can compose and execute direct updates against the target database.  Unlike some ORM frameworks, it's not standard or required to retrieve data in order to execute an update.  

> In addition to `Execute`, `Update` includes `ExecuteAsync` to asynchronously update data.

To update a field value, use the `Set` method of the field expression. The following QueryExpression issues an update 
to the *Person* table where *Person.Id* is equal to the literal value `1` and sets that person's credit limit to 
the literal value `25,000`.

{% code-example %}
```csharp
int affected = db.Update(dbo.Person.CreditLimit.Set(25_000))
    .From(dbo.Person)
    .Where(dbo.Person.Id == 1)
    .Execute();
```
```sql
exec sp_executesql N'UPDATE
    [t0]
SET
    [t0].[CreditLimit] = @P1
FROM
    [dbo].[Person] AS [t0]
WHERE
    [t0].[Id] = @P2;
SELECT @@ROWCOUNT;',N'@P1 int,@P2 int',@P1=25000,@P2=1
```
{% /code-example %}

> Execution of an update query returns the affected row count.  

It's also possible to perform arithmetic within the `Set` method.
For example, if you needed to increase the list price of products in a specific category 
by `n%`, the adjustment is accomplished (without data retrieval) using server side arithmetic.

{% code-example %}
```csharp
int affected = db.Update(
        dbo.Product.ListPrice.Set(dbo.Product.ListPrice * 1.1)
    )
    .From(dbo.Product)
    .Where(dbo.Product.ProductCategoryType == ProductCategoryType.Books)
    .Execute();
```
```sql
exec sp_executesql N'UPDATE
    [t0]
SET
    [t0].[ListPrice] = ([t0].[ListPrice] * @P1)
FROM
    [dbo].[Product] AS [t0]
WHERE
    [t0].[ProductCategoryType] = @P2;
SELECT @@ROWCOUNT;',N'@P1 float,@P2 int',@P1=1.1000000000000001,@P2=3
```
{% /code-example %}

Let's look at another couple of examples.  The following uses the `dbex.Null` helper method (we'll cover it in a bit)
to set `Line2` of an `Address` to null.
{% code-example %}
```csharp
int affected = db.Update(dbo.Address.Line2.Set(dbex.Null))
    .From(dbo.Address)
    .Where(dbo.Address.Id == 7)
    .Execute();
```
```sql
exec sp_executesql N'UPDATE
    [t0]
SET
    [t0].[Line2] = NULL
FROM
    [dbo].[Address] AS [t0]
WHERE
    [t0].[Id] = @P1;
SELECT @@ROWCOUNT;',N'@P1 int',@P1=7
```
{% /code-example %}

And of course, you can update multiple fields at once:
{% code-example %}
```csharp
int affected = db.Update(
        dbo.Person.FirstName.Set("Jane"), 
        dbo.Person.LastName.Set("Smith")
    )
    .From(dbo.Person)
    .Where(dbo.Person.Id == 12)
    .Execute();
```
```sql
exec sp_executesql N'UPDATE
    [t0]
SET
    [t0].[FirstName] = @P1,
    [t0].[LastName] = @P2
FROM
    [dbo].[Person] AS [t0]
WHERE
    [t0].[Id] = @P3;
SELECT @@ROWCOUNT;',N'@P1 varchar(20),@P2 varchar(20),@P3 int',@P1='Jane',@P2='Smith',@P3=1
```
{% /code-example %}

And one more example with a bunch of stuff (inner join, derived table, aliases, function, and group by) to 
update a person's credit limit to the max total amount they've made on a single purchase:
{% code-example %}
```csharp
int affectedCount = db.Update(dbo.Person.CreditLimit.Set(("newCreditLimit", "creditLimit")))
    .From(dbo.Person)
    .InnerJoin(
        db.SelectMany(
                dbo.Purchase.PersonId,
                db.fx.Max(dbo.Purchase.TotalPurchaseAmount).As("creditLimit")
            )
            .From(dbo.Purchase)
            .GroupBy(dbo.Purchase.PersonId)
    ).As("newCreditLimit").On(dbo.Person.Id == ("newCreditLimit", "PersonId"))
    .Execute();
```
```sql
UPDATE
	[dbo].[Person]
SET
	[CreditLimit] = [newCreditLimit].[creditLimit]
FROM
	[dbo].[Person]
	INNER JOIN (
		SELECT
			[dbo].[Purchase].[PersonId],
			MAX([dbo].[Purchase].[TotalPurchaseAmount]) AS [creditLimit]
		FROM
			[dbo].[Purchase]
		GROUP BY
			[dbo].[Purchase].[PersonId]
	) AS [newCreditLimit] ON [dbo].[Person].[Id] = [newCreditLimit].[PersonId];
SELECT @@ROWCOUNT;
```
{% /code-example %}