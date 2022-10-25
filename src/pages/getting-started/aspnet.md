---
title: ASP.NET
---

## ASP.NET Core
dbExpression works out of the box with ASP.NET Core.

## ASP.NET Web Application (.NET Framework)

If you're using dbExpression with an ASP.NET Web Application (.NET Framework), you'll use the configuration used for a console application (non-ASP.NET Core application)
in your `Global.asax`.  For example, the following `Global.asax` file for an MVC application:

```csharp
public class MvcApplication : System.Web.HttpApplication
{
    protected void Application_Start()
    {
        AreaRegistration.RegisterAllAreas();
        FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
        RouteConfig.RegisterRoutes(RouteTable.Routes);
        BundleConfig.RegisterBundles(BundleTable.Bundles);

        var services = new ServiceCollection();
        services.AddDbExpression(
            dbex => dbex.AddDatabase<MsSqlDbExTest>(
                database => database.ConnectionString.Use(
                    ConfigurationManager.ConnectionStrings["Default"].ConnectionString
                    )
            )
        );
        var provider = services.BuildServiceProvider();
        provider.UseStaticRuntimeFor<MsSqlDbExTest>();
    }
}

```
