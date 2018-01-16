---
layout: post
title: How to use two URL parameters in ASP.NET Core
categories:
- programming
tags:
-
excerpt_separator: <!--more-->
status: publish
type: post
published: true
---
Handling of URLs and URL parameters in ASP.NET Core is done via Routing Middleware. That's what
Microsoft wants you to believe: Routes in ASP.NET Core provide capabilities of [directing incoming
requests to route handlers (controllers)][1].

What MS is not telling you, is that Routing also provides copious amounts of reasons to hate it. If
you ever said to yourself anything like _"OK cool, so I’ll just add a new route for this endpoint,
and in no time will go back to the actual task at hand"_ and then, like, THREE hours down the track
when nothing works and your manager is, like, _“Have you done it yet?”_, you really starting
questioning whether this whole web developer career thing is going to work out for you.
<!--more-->

It’s not uncommon to spend hours, trying to modify an existing route in the application or trying to
add a new one. In this article, I’d like to show you how to create a route with more than one
parameter, while avoiding all the drudgery.

## What's in here?
After reading this article you will learn:

- How to create routes with more than one parameter in ASP.NET Core
- How to generate links to those routes/controller actions in Razor templates
- PLUS a work (and life!) saving BONUS - when you really don't need more than one parameter, even 
  if you think you do

Also, you can get tested and 100% working Visual Studio project with the complete source code of
examples used in this article.

### How to add a second parameter to URL

There are two ways of specifying routes to your controllers in ASP.NET Core: via Convention Based 
Routing and Attribute Routing. Convention Based Routing seems to be the most problematic one, so
let's get it out of the way.

### Step 1. Locate route initialisation code
To add a new route via Convention Based Routing, you need to modify startup code of your ASP.NET
Core application, which by default sits in `Startup.cs` file. Depending on the structure of your 
project it might be located somewhere else, but keep looking for a call to the function listed below
and you'll find it.

We are particularly interested in `app.UseMvc()` function call, which receives an anonymous function
as the first parameter:

{% highlight csharp %}
public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
{
    // ...skipped bunch of code...
    app.UseMvc(routes =>
    {
        routes.MapRoute(
            name: "default",
            template: "{controller=Home}/{action=Index}/{id?}");
    });
}
{% endhighlight %}

### Step 2. Add a new route mapping
What you see above is the standard route mapping. Now we are going to add a new mapping, one that
takes two parameters. Here's how the code is going to look like after we do that:

{% highlight csharp %}
public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
{
    // ...skipped bunch of code...
    app.UseMvc(routes =>
    {
        routes.MapRoute(
            name: "default",
            template: "{controller=Home}/{action=Index}/{id?}");

        // New code to handle requests like '/Users/1/BuyProduct/2'
        routes.MapRoute(
            // Name of the new route, we'll need it later to generate URLs in the templates
            name: "twoids",
            // Route pattern
            template: "{controller}/{name}/{action}/{name2}");
    });
}
{% endhighlight %}

As you can see, the second route looks somewhat similar to the first one, but now we have moved
things around a bit: parameter `{name}` sits between Controller and Action, and parameter `{name2}`
is located at the end of the URL.

Interesting thing is, you don't actually need to adhere to the strict `{controller}/{action}/{id}` 
scheme for URL templates, you can move parameters around. For example, the following pattern
`{name}/{name2}/{action}/{controller}` is just as valid as the previous one.  Check out the full
source code to see other wonderful combinations. Free your mind!

### Step 3. Add a controller method to work with the new route
Now we need to add a controller method, that would use the newly create URL mapping.

{% highlight csharp %}
public class MasterController : Controller
{
    // ...skipped bunch of code...

    // Make sure that parameter names match one specified in .MapRoute() call
    // i.e. "name" and "name2", otherwise Routing will not match the request!
    public IActionResult Detail(string name, string name2)
    {
        return View(new MasterDetailModel { Name = name, Name2 = name2 });
    }
}
{% endhighlight %}
**WARNING**: You want to make sure that parameter names in controller action match the ones
specified in `.MapRoute()` call, otherwise ASP.NET Core won't be able to map & direct requests 
to this controller action.

### Step 4. Generating URLs in Razor templates
Now you may want to display a link to the newly created page somewhere in the app. To do so, we use 
`Url.RouteUrl` function:

{% highlight html %}
@{
    var link1 = Url.RouteUrl("twoids", new { controller = "Master", Action = "Detail", name = "Australia", name2 = "England" });
}
<ul>
    <li><a href="@link1">Australia - England: @link1</a></li>
</ul>
{% endhighlight %}

Which will produce the following HTML in the browser:

{% highlight html %}
<ul>
    <li><a href="/master/Australia/detail/England">Australia - England: /master/Australia/detail/England</a></li>
</ul>
{% endhighlight %}

## When you DON'T need two parameters in the URL
It makes sense to use two parameters in situations when entities, to which the parameters refer, are
in many-to-many relationship. For example, one football team may play versus many other teams, giving
you URLs such as `/games/Australia/vs/NewZealand`.

There are however situations, when entities are in Parent-Child, or One-to-Many relationship, and in
this case, it doesn't really make sense to include Parent entity's ID/name into the URL, as it can be
obtained from a database. So in the example, where we may look at a hypothetical student's page,
there's no need to specify ID of the University: `/uni/1/student/2` - in this instance, the first
parameter is redundant.

## Get complete, tested and working source code for this article {#ctaTitle}
{% include experiment.html %}
{% include alt-cta.html %}
{::options parse_block_html="false" /}
{% include subscription.html %}

[1]:https://docs.microsoft.com/en-us/aspnet/core/fundamentals/routing
