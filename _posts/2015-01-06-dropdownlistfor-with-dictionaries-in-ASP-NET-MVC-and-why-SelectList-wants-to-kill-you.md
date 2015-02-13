---
layout: post
title: DropDownListFor with Dictionaries in ASP.NET MVC and why SelectList wants to kill you
categories:
- programming
tags:
- asp.net mvc
- c#
status: publish
type: post
published: true
---
####Intro

I would like to show you how to use ASP.NET MVC helper function `DropDownListFor` and `SelectList`
class with generic Dictionaries, such as `Dictionary<string, string>` or `Dictionary<int, string>`.
Dictionaries can be quite useful for a number of scenarios -- serving as a data source for select
lists of countries, states, time zones, age ranges, genders -- basically any pre-defined, fixed-set
option lists.

Also, check out my previous articles on [how DropDownListFor works, how to get the selected value in
your controller and how to make sure the selected value is rendered back][1], as well as [how to use
enums in drop down lists][2] in a humane, non-cryptic way.

####DropDownListFor and Dictionary<TKey, TValue>
Let's start with a simplistic user registration page that amongst other things, has a drop down
list with names of US states (I used Australian states in my [earlier example][1], so this should
balance it nicely). A user needs to be able to see full names of the states, such as '_Alabama_',
and when a state is selected, we want to get its abbreviation, such as '_AL_', in the controller.

<p class="center" markdown="1">
    <img src="/img/mvc/dropdowns-3/profile.png" data-gif="/img/mvc/dropdowns-3/profile-animated.gif" class="gifs" />
</p>
<script src="/js/jquery.gifplayer.js"></script>
<script>
  (function($) {
    $('.gifs').gifplayer({label: 'PLAY'});
    $('ins.play-gif').click(function() { ga('send', 'event', 'button', 'click', 'PLAY', {href: window.location.pathname}); })
  })(jQuery);
</script>

In the example above I used `Html.DropDownListFor` helper function, which needs a collection of
`SelectListItem` so it can render the correct options. There's a very handy (yet treacherous, but I'll
get back to that later) helper class `SelectList` which can convert a Dictionary (or any collection,
for that matter) into a list of `SelectListItem` instances. Let's see how it's done.

Firstly, let's get us some data in the controller -- there I pretend that I get an instance of 
`Dictionary<string, string>` from a DB layer/helper. Nothing exciting here, let's move along to the
view.

{% highlight csharp %}
//
// 1. Action method for displaying the 'User Profile' page
//
public ActionResult UserProfile()
{
    // Get existing user profile object from the session or create a new one
    var model = Session["UserProfileModel"] as UserProfileModel ?? new UserProfileModel();

    // Simulate getting states from a database
    model.States = GetStatesFromDB();

    return View(model);
}

/// <summary>
/// Simulates retrieval of country's states from a DB.
/// </summary>
/// <returns>Dictionary of US states</returns>
private Dictionary<string, string> GetStatesFromDB()
{
    return new Dictionary<string, string>
    {
        {"AK", "Alaska"},
        {"AL", "Alabama"},
        {"AR", "Arkansas"},
        {"AZ", "Arizona"},
        // some lines skipped
    }
}
{% endhighlight %}

The view is a bit more interesting -- the most important bit here is how we convert the dictionary,
stored in `Model.States`, into an instance of `IEnumerable<SelectListItem>` that's needed by `DropDownListFor`.
{% highlight html %}

<!-- ...some lines skipped... -->

@Html.DropDownListFor(m => m.State, // Store selected value in Model.State

                      // This argument needs some explanation - here we take a Distionary<string, string>
                      // and turn it into an instance of SelectList, see blog post for more details
                      new SelectList(Model.States, "Key", "Value"),

                      // Text for the first 'default' option
                      "- Please select your state -",
                      
                      // A class name to put on the "<select>"
                      new { @class = "form-control" }
                      ) 

<!-- ...some lines skipped... -->
{% endhighlight %}

You can see the [full source code of the view][3] on github.

That magical line `new SelectList(Model.States, "Key", "Value")` is what does the job -- it
basically says -- '_take this collection, and for each dictionary item create a `SelectListItem`
with its `Value` property set to the `Key` property and its `Text` property set to `Value` property
of a given dictionary item_'.

So in the end you get some nice and clean HTML that looks like this:
{% highlight html %}
<select class="form-control" id="State" name="State"> <!-- some attrs=ibutes skipped -->
    <option value="">- Please select your state -</option>
    <option value="AK">Alaska</option>
    <option value="AL">Alabama</option>
    <option value="AR">Arkansas</option>
    <option value="AZ">Arizona</option>
    <!-- and on it goes -->
</select>
{% endhighlight %}

Check you the [full source code of the project here on github][4] or download it as a [zip file][5].

####It's a trap
You might have noticed in the documentation for one of the [`SelectList` constructors][6] a beningly
named parameter `selectedValue`, whose name suggests that you should, naturally, use it to select an
item in the list. The description only confirms this. But there be dragons.

This parameter is meant to be used as a __default value__ when form with a drop down is rendered for
the first time. A good example would be trying to pre-fill new user's state based on their IP
address to save them some time.

This default value is only going to be taken into account by `DropDownListFor` if the corresponding
model field (`Model.State` in our case) that's used for storage of user's selection is set `null`.
If the model field has got __any__ value, the default `selectedOption` parameter is going to be
ignored by ASP.NET MVC.

If we were to modify the earier example to pre-select, say _Maine_ (because there's a lot of pine
trees and the air is clean), that's how it would look like:

{% highlight csharp %}
@Html.DropDownListFor(m => m.State, // Store selected value in Model.State

                      // Notice "ME" as the last parameter here - 
                      // that's the key for "Maine" in the supplied dictionary
                      new SelectList(Model.States, "Key", "Value", "ME"),

                      // Text for the first, non-selected option
                      "- Please select your state -",

                      // A class name to put on the "<select>"
                      new { @class = "form-control" }
                      ) 
{% endhighlight %}

####Source code
Here is a [download link][5] for a complete Visual Studio solution that includes the code used in this
artice. You can [browse the code online][4] or clone the git repository.

####But wait, there's more
I hope this clears things up for you -- leave a comment here if you have any questions or shoot me
an email and I'll do my best to answer it.

Subscribe to my mailing list so you can get the freshly baked articles as soon as I publish
them -- I want to help you build your web apps better and faster and avoid getting stuck in the
intricacies .NET and ASP.NET MVC.

{% include subscription.html %}

[1]:{% post_url 2014-10-15-using-simple-drop-down-lists-in-ASP-NET-MVC %}
[2]:{% post_url 2014-11-17-aspnetmvc-dropdowns-with-enums %}
[3]:https://github.com/ArtS/aspnetmvc-dropdowns-dictionaries/blob/master/Dropdown-dictionary/Views/Profile/UserProfile.cshtml
[4]:https://github.com/ArtS/aspnetmvc-dropdowns-dictionaries
[5]:https://github.com/ArtS/aspnetmvc-dropdowns-dictionaries/archive/master.zip
[6]:http://msdn.microsoft.com/en-us/library/dd492553(v=vs.118).aspx