---
title: Insert Statements
description: Fluently build an INSERT sql statement using dbExpression.
todo: create reference link to insert statement once docs for select statement are completed (/reference/statements/insert-statement)
---

To start building *INSERT* queries, use the database accessor (static or dependency injected instance) followed by a `Insert` or `InsertMany`. 
An *INSERT* query relies on the data packages (entities) generated via the scaffolding process.

> In addition to `Execute`, `Insert` and `InsertMany` include `ExecuteAsync` to asynchronously insert data.

## Insert an Entity

In the example below, we set properties of the `Person` entity instance and pass it to the `Insert` method.  dbExpression 
handles the mapping and parameterization of the data and sends it to the target database as a *Merge* statement.  The *Merge* 
statement returns (as output) all the resulting columns, which are mapped back to the `Person` entity instance.  This process 
accounts for the return of data created by your database platform:
* columns with an identity specification
* computed column values
* columns with server side default constraints

{% code-example %}
```csharp
var charlie = new Person()
{
    FirstName = "Charlie",
    LastName = "Brown",
    BirthDate = new DateTime(1950, 10, 2),
    GenderType = GenderType.Male,
    CreditLimit = 45000,
    YearOfLastCreditLimitReview = 2021,
    RegistrationDate = DateTimeOffset.Now,
    LastLoginDate = null,
};
// The person table relies on an identity specification 
// for the Id field (PK).  At this point, charlie.Id will be 0
// Person also contains a DateCreated column that is set via 
// a server side default binding of: GETDATE()

db.Insert(charlie).Into(dbo.Person).Execute();

// after the insert is executed, charlie.Id will contain 
// the identity generated on the database server
// charlie.DateCreated will contain the result of the 
// default constraint applied to the column
```
```sql
exec sp_executesql N'SET NOCOUNT ON;
MERGE [dbo].[Person] USING (
VALUES
	(@P1, @P2, @P3, @P4, @P5, @P6, @P7, NULL, 0)
) AS [__values] (
	[FirstName],
	[LastName],
	[BirthDate],
	[GenderType],
	[CreditLimit],
	[YearOfLastCreditLimitReview],
	[RegistrationDate],
	[LastLoginDate],
	[__ordinal]
) ON 1 != 1
WHEN NOT MATCHED THEN
INSERT (
	[FirstName],
	[LastName],
	[BirthDate],
	[GenderType],
	[CreditLimit],
	[YearOfLastCreditLimitReview],
	[RegistrationDate],
	[LastLoginDate]
) VALUES (
	[__values].[FirstName],
	[__values].[LastName],
	[__values].[BirthDate],
	[__values].[GenderType],
	[__values].[CreditLimit],
	[__values].[YearOfLastCreditLimitReview],
	[__values].[RegistrationDate],
	[__values].[LastLoginDate]
	)
OUTPUT
	[__values].[__ordinal],
	[inserted].[Id],
	[inserted].[FirstName],
	[inserted].[LastName],
	[inserted].[BirthDate],
	[inserted].[GenderType],
	[inserted].[CreditLimit],
	[inserted].[YearOfLastCreditLimitReview],
	[inserted].[RegistrationDate],
	[inserted].[LastLoginDate],
	[inserted].[DateCreated],
	[inserted].[DateUpdated];',
	N'@P1 varchar(20),@P2 varchar(20),@P3 date,@P4 int,@P5 int,@P6 int,@P7 datetimeoffset(7),
	@P8 datetimeoffset(7)',@P1='Charlie',@P2='Brown',@P3='1950-10-02',@P4=1,@P5=45000,@P6=2021,
	@P7=NULL,@P8=NULL
```
{% /code-example %}

## Insert a Batch of Entities

To insert a batch of records, use the `InsertMany` query type while building a query.  `InsertMany` 
utilizes the same insert strategy as `Insert` described above.  Upon return from execution of the `InsertMany`, 
all the supplied objects will have identity values, computed values and defaulted values.

{% code-example %}
```csharp
var sally = new Person()
{
    FirstName = "Sally",
    LastName = "Brown",
    BirthDate = new DateTime(1959, 5, 26),
    GenderType = GenderType.Female,
    CreditLimit = 42000,
    YearOfLastCreditLimitReview = 2021,
    RegistrationDate = DateTimeOffset.Now,
    LastLoginDate = null,
};

var linus = new Person()
{
    FirstName = "Linus",
    LastName = "van Pelt",
    BirthDate = new DateTime(1952, 7, 14),
    GenderType = GenderType.Male,
    CreditLimit = 42000,
    YearOfLastCreditLimitReview = 2021,
    RegistrationDate = DateTimeOffset.Now,
    LastLoginDate = null,
};

var lucy = new Person()
{
    FirstName = "Lucy",
    LastName = "Van Pelt",
    BirthDate = new DateTime(1952, 3, 3),
    GenderType = GenderType.Female,
    CreditLimit = 42000,
    YearOfLastCreditLimitReview = 2021,
    RegistrationDate = DateTimeOffset.Now,
    LastLoginDate = null,
};

db.InsertMany(sally, linus, lucy).Into(dbo.Person).Execute();

// all properties based on identity column specifications, 
// default constraints or computed columns 
// will be populated on execution.
```
```sql
exec sp_executesql N'SET NOCOUNT ON;
MERGE [dbo].[Person] USING (
VALUES
	(@P1, @P2, @P3, @P4, @P5, @P6, @P7, NULL, 0),
	(@P8, @P9, @P10, @P11, @P5, @P6, @P12, NULL, 1),
	(@P13, @P14, @P15, @P16, @P5, @P6, @P17, NULL, 2)
) AS [__values] (
	[FirstName],
	[LastName],
	[BirthDate],
	[GenderType],
	[CreditLimit],
	[YearOfLastCreditLimitReview],
	[RegistrationDate],
	[LastLoginDate],
	[__ordinal]
) ON 1 != 1
WHEN NOT MATCHED THEN
INSERT (
	[FirstName],
	[LastName],
	[BirthDate],
	[GenderType],
	[CreditLimit],
	[YearOfLastCreditLimitReview],
	[RegistrationDate],
	[LastLoginDate]
) VALUES (
	[__values].[FirstName],
	[__values].[LastName],
	[__values].[BirthDate],
	[__values].[GenderType],
	[__values].[CreditLimit],
	[__values].[YearOfLastCreditLimitReview],
	[__values].[RegistrationDate],
	[__values].[LastLoginDate]
	)
OUTPUT
	[__values].[__ordinal],
	[inserted].[Id],
	[inserted].[FirstName],
	[inserted].[LastName],
	[inserted].[BirthDate],
	[inserted].[GenderType],
	[inserted].[CreditLimit],
	[inserted].[YearOfLastCreditLimitReview],
	[inserted].[RegistrationDate],
	[inserted].[LastLoginDate],
	[inserted].[DateCreated],
	[inserted].[DateUpdated];',N'@P1 varchar(20),@P2 varchar(20),@P3 date,@P4 int,@P5 int,@P6 int,@P7 datetimeoffset(7),@P8 varchar(20),@P9 varchar(20),@P10 date,@P11 int,@P12 datetimeoffset(7),@P13 varchar(20),@P14 varchar(20),@P15 date,@P16 int,@P17 datetimeoffset(7)',@P1='Sally',@P2='Brown',@P3='1959-05-26',@P4=2,@P5=42000,@P6=2021,@P7='2022-06-10 10:23:59.1748700 -05:00',@P8='Linus',@P9='van Pelt',@P10='1952-07-14',@P11=1,@P12='2022-06-10 10:23:59.1750456 -05:00',@P13='Lucy',@P14='Van Pelt',@P15='1952-03-03',@P16=2,@P17='2022-06-10 10:23:59.1750510 -05:00'
```
{% /code-example %}