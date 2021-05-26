---
layout: post
title: How To Set Default Option In Select List In ASP.NET Core MVC
description: Learn how to set a default option in Select List and which mistakes to avoid to save time
categories:
- programming
excerpt_separator: <!--more-->
type: post
---
It can be extremely infuriating to stumble over something so seemingly simple as the Select List
control, and having to spend time trying to make it work, instead of focusing on what really matters
in the given moment -- be it learning a new tech or developing your web app.

ASP.NET Core MVC made is somewhat easier to deal with select lists. Previously in .NET Framework,
you had quite a few ways of supplying data to your Select Lists, to the point where it just got
ridiculous and it seemed like the [bloody thing just wanted to kill you][1].

Now a lot of ambiguity seems to have been removed, and Tag Helpers for MVC and Razor Pages are much
easier to use. Let's have a look at how you can set default option for Select List control in ASP.NET Core MVC or
Razor Pages.

<!--more-->
## Most important attributes: asp-items and asp-for
Below is an example code that does several things that are very important if you want to use Select
List control:

- `asp-items` specifies the data source to be used to populate collection of `<option>` for `<select>`
  control
- `asp-for` specifies both the selected value (YES, THAT'S WHAT WE WANT!) and the name of the 
  form element that's going to be used for POSTing the data back to your controller

{% highlight html %}
  <div class="form-group">
      <select asp-for="Country" asp-items="Model.Countries" class="form-control" aria-label="Select your country">
      </select>
  </div>
{% endhighlight %}

The most confusing bit here is `asp-for="Country"` -- while it refers to the View Model `Country`, you need to
omit the `Model.` prefix. On the contrary, you DO WANT to have that prefix for `asp-items` value.
Consistency? Yeah nah, Microsoft knows better. &#129318;

Just remember - values of both attributes refer to fields in your View Model. So in this instance,
your View Model will look like this:

{% highlight csharp %}
    public class UserModel {
        public string Country { get; set; }
        public IEnumerable<SelectListItem> Countries { get; init; }
    }
{% endhighlight %}

## How to populate View Model in the Controller
Every time you pass the View Model to the View, you need to populate the fields. Below is the code
that's used to set required data on the View Model.

{% highlight csharp %}
    [HttpGet]
    public IActionResult Index()
    {
        var allCountries = GetAllCountries();
        var userModel = new UserModel() {
            // Set default country to "Australia"
            Country = allCountries.FirstOrDefault(c => c.Name == "Australia").Id,
            // Set list off all couintries that are available for selection
            Countries = GetSelectListItems(allCountries)
        };

        return View(userModel);
    }
{% endhighlight %}

## Errors, exceptions, wasted time

There are several things to watch out for.

You may not have many items in your Select List and thus decide not to bother with `asp-items`
attribute. Most likely, that's not a good decision. It's much easier to delegate control rendering
to Razor templating engine than trying to set selected option yourself.

Second, you want to make sure that you supply a collection of `SelectListItem`s in `asp-items`
attribute, otherwise you're going to get a compilation error looks something like this: `Cannot
implicitly convert type 'Whichever wrong type you used' to
'System.Collections.Generic.IEnumerable<Microsoft.AspNetCore.Mvc.Rendering.SelectListItem>'. An
explicit conversion exists (are you missing a cast?)`

Third, try to avoid using `ViewData`, `TempData` and alike as the way to pass data from
Controller to the View, and just use View Models. This way you will avoid a lot of cryptic errors,
and get the compile time type checking out of the box.

Also, you always want to pay close attention to how you pass data to tag helpers, so they render
correctly in all scenarios: on the first page load, during POST back that fails validation, or when
populating forms with data from existing objects/DB.

## Conclusion
Hopefully, this article shows how to use Select List control in your ASP.NET Core apps and saves you
some time in the future by showing you the most frequent mistakes developers make.

{% include code-download-cta.html %}

[1]:{% post_url 2015-01-06-dropdownlistfor-with-dictionaries-in-ASP-NET-MVC-and-why-SelectList-wants-to-kill-you %}
