---
title: Dependency Injection
---

dbExpression uses [Microsoft's Dependency Injection](https://docs.microsoft.com/en-us/dotnet/core/extensions/dependency-injection) framework in conjunction with an internal dependency injection framework, where database-specific services are registered/resolved in "child" containers, with fallback to Microsoft's service collection/provider.


