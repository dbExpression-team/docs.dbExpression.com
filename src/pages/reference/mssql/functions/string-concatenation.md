---
title: String Concatenation
description: How to use string concatenation while fluently building query expressions.
---

{% code-example %}
```csharp
//select person's full billing address 
string? fullAddress = db.SelectOne(
        dbo.Address.Line1 + " " + db.fx.IsNull(dbo.Address.Line2, " ")
        + Environment.NewLine
        + dbo.Address.City + ", " + db.fx.Cast(dbo.Address.State).AsVarChar(2) + " " + dbo.Address.Zip
    ).From(dbo.Address)
    .InnerJoin(dbo.PersonAddress).On(dbo.PersonAddress.AddressId == dbo.Address.Id)
    .Where(dbo.PersonAddress.PersonId == 1 & dbo.Address.AddressType == AddressType.Billing)
    .Execute();
```
```sql
exec sp_executesql N'SELECT TOP(1)
    ([t0].[Line1] + @P1 + ISNULL([t0].[Line2], @P2) + @P3 + [t0].[City] + @P4 + CAST([t0].[State] AS VarChar(2)) + @P5 + [t0].[Zip])
FROM
    [dbo].[Address] AS [t0]
    INNER JOIN [dbo].[Person_Address] AS [t1] ON [t1].[AddressId] = [t0].[Id]
WHERE
    [t1].[PersonId] = @P6
    AND
    [t0].[AddressType] = @P7;',N'@P1 char(1),@P2 char(1),@P3 char(2),@P4 char(2),@P5 char(1),@P6 int,@P7 int',@P1=' ',@P2=' ',@P3='
',@P4=', ',@P5=' ',@P6=1,@P7=2
```
{% /code-example %}

String concatenation can also be accomplished using the `Concat` database function.