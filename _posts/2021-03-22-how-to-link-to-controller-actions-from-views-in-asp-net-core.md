---
layout: post
title: How to link to Controller Actions from Views in ASP.NET MVC Core
description: Learn how to use @Html.ActionLink and Anchor Tag Helper to link to your controller's GET methods in ASP.NET MVC Core
categories:
- programming
- web
- asp.net mvc core
excerpt_separator: <!--more-->
type: post
---
Often you need to put links in your ASP.NET MVC Core Views that take users to other controllers in
your web app -- like navigating to a details page for a particular record in the table. Or when
building a primary, secondary or tertiary navigation. Or logging users in or out. Heck, you need
links everywhere!

A very obvious (but wrong!) way is to hardcode relative paths to your controller's actions in the
View, like `<a href="/product/details/1">View product details</a>`. It's super easy, right? What can
possibly go wrong? Actually, a lot of things. Just the tip of the iceberg:

- to pass parameters, you'll need to do string concatenation/formatting in Razor or Javascript
- if you move or rename your controller or its methods, effectively changing the URL, your links will
  break
- if your URL schema changes say from using named ids like `?id=1` to positional ids, like
  `/products/1`, you'll need to update all your hardcoded URLs. 

As you can see, hardcoding is a big pain in the rear. But what can you do instead? Fear not, there's
a solution that addresses all the above problems and more!

<!--more-->
## Make us some links

Let's look into automatic link generation, and how you can pimp it up to make it type-safe, ensuring
compile-time checking, so no 404s ever happen when you refactor your code by renaming controllers or
their methods.

There are at least three different ways to make links in ASP.NET MVC Core: 

- `HtmlHelperLinkExtensions.ActionLink` AKA [`@Html.ActionLink`][3] extension method
- Anchor tag helper, [`<a asp-* ...>`][4]
- [`Url.Action()`][5] extension method

### ActionLink extension method
Unfortunately, as it's often the case with Microsoft's docs, it's quite cryptic. Like how the hell
are you supposed to know, based on the very [scant documentation][2], which particular method you
need to call?

- `ActionLink(IHtmlHelper, String, String)`
- `ActionLink(IHtmlHelper, String, String, Object)`
- `ActionLink(IHtmlHelper, String, String, String)`
- `ActionLink(IHtmlHelper, String, String, Object, Object)`
- `ActionLink(IHtmlHelper, String, String, String, Object)`
- `ActionLink(IHtmlHelper, String, String, String, Object, Object)`

Instead of trying to explain what all these parameters mean, let me just show you the most common
use cases of this extension method.

- get a link to the current controller's action:
  ```
  @Html.ActionLink("Link to Index action", "Index")
  ```
- get a link to specific controller and action:
  ```
  @Html.ActionLink("Link to Index action of Home controller", "Index", "Home")
  ```
- get a link to specific controller and action with parameters:
  ```
  @Html.ActionLink("Link to Index action of Home controller with id=100500 and name='John Doe'",
                   "Index", "Home",
                   new { id = 100500, name = "John Doe" })
  ```
- get a link to specific controller and action and set css class for the link:
  ```
  @Html.ActionLink("Link to Index action of Home controller with id=100500 and name='John Doe' and CSS class",
                   "Index", "Home",
                   new { id = 100500, name = "John Doe" },
                   new { @class="css-class"})
  ```
Now let's look into the parameters:

- as you have probably figured out, you never need to specify the first parameter, `IHtmlHelper`, as it's a type parameter 
- `linkText` specifies the text that goes in between `<a></a>` tags.
- `actionName` specifies the action of the controller.
- `controllerName` specifies the name of the controller __without__ the "Controller" suffix. So `Home`
  instead of `HomeController`
- `routeValues` specifies parameters for your actions. You can use both `object` as in case of `new
  { name = "value" }`, or an instance of generic dictionary `IDictionary<TKey, TValue>`
- `htmlAttributes` an object that contains additional HTML attributes for the `<a>` tag, such as CSS
  class name

This extension method is to be called from Views:

{% highlight html %}
  <p>This link is generated in the View:</p>
    <ul>
        <li>@Html.ActionLink("Simple link to a 'Home' controller 'Index' action", "Index", "Home")</li>
    </ul>
  </p>
{% endhighlight %}

### Anchor Tag Helper
While `@Html.ActionLink()` is a carry-over left in ASP.NET Core for migration from .NET, the
brand-spanking new way of generating links is the [Anchor Tag Helper][1]. Sporting much improved
readability, it lets you do this:

{% highlight html %}
  <p>This link is generated in the View:</p>
    <ul>
        <li><a asp-controller="Home" asp-action="Index">Simple link to a 'Home' controller 'Index' action</a></li>
    </ul>
  </p>
{% endhighlight %}

Check out the [documentation][1] for the full list of supported attributes, these being the
most important ones:
- `asp-controller` -- target controller
- `asp-action` -- target action
- `asp-route-{value}` -- specify parameters for the action
- `asp-fragment` -- specify URL fragment to be added after `#`

This example shows how to generate a link with parameters:

{% highlight html %}
  <a asp-controller="Home" asp-action="Details"
     asp-route-id="100500"
     asp-route-name="John Doe">A link with parameters to 'Home' controller 'Details' action</a>
{% endhighlight %}

### Url.Action Helper Method
Not all links need to be generated in Views, sometimes you need to build links in your Controllers
too. `UrlHelperExtensions` class has [`Url.Action`][6] method that does just that. The documentation
is similarly obscure, but now you know how to navigate it.

Some examples:

- get a link to a 'Home' controller's 'Index' action
  ```
  Url.Action("Index", "Home")
  ```
- get a link with parameters to 'Home' controller's 'Details' action
  ```
  Url.Action("Details", "Home", new { name = "John Doe", id = 100500})
  ```

## Type-safe link generation with compile-time checking
All the examples above suffer from a fundamental problem: if you rename a controller or action
method, the links will break, but you'll only going to find out about it when trying to use them.
That's clearly not good enough. 

Let's further improve the link generation by bringing in compile-time checking and retrieval of the
data that we need. The following code uses `Url.Action` with a custom method `GetControllerName` and
`nameof` operator to get names of Controller and Action:

{% highlight csharp %}
Url.Action(nameof(HomeController.Details),
           Utils.GetControllerName<HomeController>(),
           new { name = "John Doe", id = 100500})
{% endhighlight %}

In the similar fashion, you can use that approach with both `@Html.ActionLink` and `<a asp-controller="..."></a>`:


{% highlight html %}
<p>
  @Html.ActionLink("Safely generated link with parameters to 'Home' controller 'Details' action",
  nameof(HomeController.Details),
  Utils.GetControllerName<HomeController>(),
  new { name = "John Doe", id = 100500})
</p>
{% endhighlight %}

{% highlight html %}
<a asp-controller="@(Utils.GetControllerName<HomeController>())"
   asp-action="@(nameof(HomeController.Details))"
   asp-route-id="100500"
   asp-route-name="John Doe">Safely generated link with parameters to 'Home' controller 'Details' action</a>>
{% endhighlight %}

And that's a one-line implementation of `GetControllerName` utility function. The only reason we
need it is to get rid of the `Controller` suffix at the end of the string.
{% highlight csharp %}
public static string GetControllerName<T>() where T : Controller {
    return typeof(T).Name.Replace(nameof(Controller), string.Empty);
}
{% endhighlight %}

## Conclusion
In this article, we looked at different ways of generating links in Views and Controllers in ASP.NET
Core MVC. We also looked at how to make the link generation process resilient to changes in your
application and avoid breaking the links.

{% include code-download-cta.html %}

[1]:https://docs.microsoft.com/en-us/aspnet/core/mvc/views/tag-helpers/built-in/anchor-tag-helper?view=aspnetcore-3.1
[2]:https://docs.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.mvc.rendering.htmlhelperlinkextensions.actionlink?view=aspnetcore-3.1
[3]:#actionlink-extension-method
[4]:#anchor-tag-helper
[5]:#urlaction-helper-method
[6]:https://docs.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.mvc.urlhelperextensions?view=aspnetcore-3.1
