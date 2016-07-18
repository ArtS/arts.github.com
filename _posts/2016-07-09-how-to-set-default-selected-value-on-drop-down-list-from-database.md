---
layout: post
title: How to select a default value in DropDownList from a database
categories:
- programming
tags:
status: publish
type: post
published: true
---
As highlighted previously in [one of those articles][3], it's easy to get confused and stuck when
trying to specify selected or default value for dropdown lists. The problem stems from the fact
that, first and foremost, MSDN documentation is terrible for those things, and secondly because of 
the approach that Microsoft took, trying to build "one-size-fits-all" solution. But let's not get
too philosophical here and get down to the ground.

_This article is one of the 'DropDownList series' articles that should help you in dealing with 
DropDownList / SelectList / SelectListItem related problems. Check out other DropDownList articles
here_:

- [Using simple DropDownLists in ASP.NET MVC][1]
- [ASP.NET.MVC DropDownLists with enums][2]
- [DropDownListFor with Dictionaries in ASP.NET MVC and why SelectList wants to kill you][3]

## 'Default' and 'Selected' values - why do we need two?
There are two ways to specify which item is selected in a dropdown list, and this is the main source
of confusion and problems. There are two distinct scenarios:

1. The page is loaded for the first time and the dropdown selection is set to some default value, say
   'US' for the country selection.
2. The page is loaded with real data, and the dropdown selection is set to a value that user had chosen
   previously.

## How to specify default value
Let's say you have a class 'Country' with two properties, 'Id' and 'Name', and you want
to display a dropdown list with the country selection, where Australia is pre-selected by default
(because naturally, you expect that most of your users will be from Australia).

There are at least two ways you can do that: either by using a helper class `SelectList` which creates
a collection of `SelectListItem` instances or by creating that collection manually in the
controller.

### Use SelectList in the view
This is the most simple and short way of doing that. Note how `13` is used to specify default
selection.

{% highlight csharp %}
@Html.DropDownListFor(
    m => m.CountryId, // Specifies where to store selected country Id
                      // It needs to be null for the default selection to work!

    new SelectList(Model.Countries, // IEnumerable<Country>, contains all countries loaded from a database
                   "Id",   // Use Country.Id as a data source for the values of dropdown items
                   "Name", // Use Country.Name as a data source for the text of dropdown items
                   13 // Specifies Australia (which has ID of 13) as the element selected by default
                   ),

    // Text of option that prompts user to select
    "- Please select your country -"
)
{% endhighlight %}

### Use SelectListItem in the controller
This method is a bit more involved but it allows you use more complex logic for figuring which 
element should be marked as selected.

Controller code:
{% highlight csharp %}

var allCountries = countryRepository.GetAllCountries();
var items = new List<SelectListItem>();

foreach(var country in allCountries)
{
    items.Add(new SelectListItem() {
        Text = coutry.Name,
        Value = Country.Id.ToString(),
        // Put all sorts of business logic in here
        Selected = country.Id == 13 ? true : false
    });
}

model.Countries = items;
{% endhighlight %}

And then in your view:
{% highlight csharp %}
@Html.DropDownListFor(
    m => m.CountryId, // Specifies where to store selected country Id
                      // It needs to be null for the default selection to work!

    Model.Countries, // just supply already created collection of SelectListItems

    // Text of option that prompts user to select
    "- Please select your country -"
)
{% endhighlight %}

### DANGER. WARNING. THERE BE DRAGONS.
There's one __BIG CAVEAT__: the default value supplied via one of those methods will be completely
ignored if the value of the first parameter of `DropDownListFor` (Model.CountryId in this case) is not
null. In other words, if a user had selected a value or if the model got this value set via some
other pathway (like you loaded it from a database), the default value __will be ignored__.

I have tripped over this myself, time and again, even when writing this article. So make sure the
model field that you use to store the selected Id from the dropdown list is nullable __and is set
to null__ on the first page load.

Also, __do not use__ `SelectedList` or `SelectedListItem` to specify what user had selected, instead
use them for what they are built - to specify a __default__ value.

## How to specify selected value

Selected value is different from the default value in the way that it had, well, been selected at some
point. You may have just loaded an object from a database for editing and need to render already
selected country.

To do so you need to use the first argument of the `DropDownListFor` function. Also, note that whatever 
you specify in `SelectList`/`SelectListItem` constructors for selected value __will be ignored__.

Simplified controller code, which loads a user from a database, sets values on the model:
{% highlight csharp %}
public EditUser(int userId) {
    var user = LoadUserFromDB(userId);
    var model = new UserModel();
    model.CountryId = user.CountryId;
    model.Countries = GetAllCountries();
    //... other code to set the rest of the properties
    return View(model);
}
{% endhighlight %}

View code, uses `Model.ContryId` to specify selected value:
{% highlight csharp %}
@Html.DropDownListFor(
    m => m.CountryId, // Specifies where to store selected country Id
                      // It needs to be null for the default selection to work!

    new SelectList(Model.Countries,
                   "Id",
                   "Name"),

    // Text of option that prompts user to select
    "- Please select your country -"
)
{% endhighlight %}

## Source codes
Feel free to download the complete source code that shows you how to use `SelectedList`/`SelectedListItem`/
`DropDownListFor` from [this GitHub repo][4].

## Don't get stuck again, save yourself some precious time! {#ctaTitle}

{::options parse_block_html="true" /}
<div id="ctaCopy">
I hope this article helped you to move forward in your work.

You can probably recall a time when you were stuck on some problem and the solution seemed so close,
yet it took hours to figure it out. And when you eventually did that, it was something so
infuriatingly stupid, you wanted to punch the monitor.

Do you want to avoid wasting your time on stupid bugs and traps in .NET? Subscribe to my mailing
list and save HOURS of your life and bring the joy back into programming. I only send useful and 
actionable advice, no spam ever, and you can unsubscribe at any time.
</div>

{% include alt-cta.html %}

{::options parse_block_html="false" /}
{% include subscription.html %}

[1]:{% post_url 2014-10-15-using-simple-drop-down-lists-in-ASP-NET-MVC %}
[2]:{% post_url 2014-11-17-aspnetmvc-dropdowns-with-enums %}
[3]:{% post_url 2015-01-06-dropdownlistfor-with-dictionaries-in-ASP-NET-MVC-and-why-SelectList-wants-to-kill-you %}
[4]:https://github.com/ArtS/aspnetmvc-selectlist-selectlistitem
