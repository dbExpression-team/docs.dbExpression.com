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
        + dbo.Address.City + ", " + dbo.Address.State + " " + dbo.Address.Zip
    ).From(dbo.Address)
    .InnerJoin(dbo.PersonAddress).On(dbo.PersonAddress.AddressId == dbo.Address.Id)
    .Where(dbo.PersonAddress.PersonId == 1 & dbo.Address.AddressType == AddressType.Billing)
    .Execute();
```
```sql
exec sp_executesql N'SELECT TOP(1)
	([dbo].[Address].[Line1] + @P1 + ISNULL([dbo].[Address].[Line2], @P2) + @P3 + [dbo].[Address].[City] + @P4 + [dbo].[Address].[State] + @P5 + [dbo].[Address].[Zip])
FROM
	[dbo].[Address]
	INNER JOIN [dbo].[Person_Address] ON [dbo].[Person_Address].[AddressId] = [dbo].[Address].[Id]
WHERE
	[dbo].[Person_Address].[PersonId] = @P6
	AND
	[dbo].[Address].[AddressType] = @P7;',N'@P1 char(1),@P2 char(1),@P3 char(2),@P4 char(2),@P5 char(1),@P6 int,@P7 int',@P1=' ',@P2=' ',@P3='
',@P4=', ',@P5=' ',@P6=1,@P7=2
```
{% /code-example %}

String concatenation can also be accomplished using the ```Concat``` database function.