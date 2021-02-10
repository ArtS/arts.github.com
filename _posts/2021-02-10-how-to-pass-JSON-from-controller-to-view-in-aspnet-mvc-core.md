---
layout: post
title: How to pass JSON from Controller to View in ASP.NET MVC Core and avoid XSS
description: How to make changes to your existing codebase to test a new idea you may have, and roll your changes back if needed, clean and quick.
categories:
- programming
excerpt_separator: <!--more-->
type: post
---
When working on your ASP.NET MVC application, you often need to include some of your app's data as
Javascript objects. You may need this for some interactive behaviour, graphs/charts, or simply to
"hydrate" the UI with the relevant information, such as username etc.

There's certainly a big push to move away from rendering JSON data in MVC Views. Instead, it's
recommended to use Ajax calls that fetch JSON data from backend APIs. This helps to separate
concerns in your application, making it more maintainable and easier to support, test and debug.

However, sometimes it's OK to put JSON data directly in MVC Views:

- performance--it saves you another network call
- prototyping--test your idea before you spend a lot of time on adding another endpoint to your backend API
- size of the data--if it's just a small object, you may not want to create a separate endpoint
  just for that thing
- legacy--the app you're working on is ancient, soon-to-be-retired, so there's really no
  point putting lipstick on the pig

With these caveats in mind, let's see how you can easily put some JSON into your ASP.NET MVC views.

<!--more-->

## Encoding problem
The problem with outputting any values into Views in ASP.NET MVC is that the framework encodes the
output, trying to save you from introducing Cross-Site Scripting (XSS) vulnerabilities to your
front-end code.

Briefly, an XSS vulnerability is when an attacker can provide some content that has
a malicious Javascript payload, which then gets rendered by your web app and executed in users'
browsers.

_Check out ["Prevent Cross-Site Scripting (XSS) in ASP.NET Core"][1] for more details on how
to avoid this happening to your app._

The encoding that ASP.NET MVC does for you replaces all special characters like `"'<>` (and a few
more) with their corresponding HTML codes, such `&#39;&quot;&lt;&gt;`.

Say you have an object `Customer`, and you are trying to put it in a `<script>` section like this:

{% highlight html %}
  <script>
    var customers = JSON.parse('@JsonSerializer.Serialize(Model.Customer)');
  </script>
{% endhighlight %}

then all you are going to end up in the browser is going to look something like this:

{% highlight html %}
  <script>
    var customers = JSON.parse('{&quot;Id&quot;:1,&quot;FirstName&quot;:&quot;Hasim&quot;,&quot;LastName&quot;:&quot;Santello&quot;,&quot;DOB&quot;:&quot;2/09/2004&quot;}');
  </script>
{% endhighlight %}

and it's not even a correct JSON! ASP.NET MVC made it safe for you, but also, unfortunately, also
broke it.

## @Html.Raw to the rescue
To turn all those `&quot;` and such into proper Javascript, you need to tell ASP.NET to skip the
encoding and output the __raw__ data:

{% highlight html %}
  <script>
    // ...
    var customers = JSON.parse('@Html.Raw(JsonSerializer.Serialize(Model.Customers))');
    // ...
  </script>
{% endhighlight %}

...and viola! it results in a nice, clean, parsable JSON:

{% highlight html %}
  <script>
    // ...
    var customers = JSON.parse('{"Id":1,"FirstName":"Hasim","LastName":"Santello","DOB":"2/09/2004"}');
    // ...
  </script>
{% endhighlight %}

## A word of warning about XSS
As mentioned previously, check out that [XSS article][1], and also be mindful of how you use the
data received from the server, whether that's embedded in the page with `@Html.Raw` or via Ajax.

For instance, do not concatenate strings to make HTML entities. This example

{% highlight html %}
  <script>
    // ...
    var customer = JSON.parse('... some malicious JSON here with XSS attack...');
    $(body).append($('<div>' + customer.Name + '</div>');
    // ...
  </script>
{% endhighlight %}

will introduce a very obvious XSS security hole in your site, because if a malicious user updates
their name to `<script>alerts('YOU PWND!');</script>` that code will execute on clients' browsers.

Whichever Javacript framework you're using, check its doco on how to avoid XSS. With jQuery, use
methods like `.text()` to set text of newly created elements.

{% include code-download-cta.html %}

[1]:https://docs.microsoft.com/en-us/aspnet/core/security/cross-site-scripting?view=aspnetcore-5.0
