---
layout: post
title: Using Drop Down Lists with enums in ASP.NET MVC
categories:
- programming
tags:
- asp.net mvc
- c#
status: publish
type: post
published: true
---
ASP.NET MVC is a very powerful, yet quite complex, if not complicated, web development framework.
It's got heaps of various namespaces, classes, functions and it's hard to tell from just online
manuals, such as MSDN, which particular class or a function overload you need to use for your very
specific task.

Seemingly simple things, such as creating a humble drop down list that contains members of a given
enum can be quite perplexing, and a lot of people get stuck there, not even knowing where to start.
In this article I will show in just a few simple steps how to do the following:

- put a drop down list on a form
- populate the drop down list with values from an enum, containing a list of industries
- make sure text in the drop down list is easy to read, such as _Construction, Architecture & Interior Design_, not _ConstructionArchitectureAndInteriorDesign_
- have a default value in the drop down list that prompts user to select something, "Please select your industry"

Check out my previous article [Using simple Drop Down Lists in ASP.NET MVC][1] for the detailed
breakdown on how to create a simple drop down list on a form, populate it with values from a
controller, send selected value back and render the drop down with the value selected.

####Solution walkthrough
Let's put together a fictitious user profile page which has text boxes for First and Last names and
Industry selection drop down list. That's how it's going to look like.

<p class="center" markdown="1">
    ![User Profile][3]
</p>

Contents of the drop down list will be based on the following enum:
{% highlight csharp %}
public enum Industry
{
    [Description("Accounting")]
    Accounting,
    [Description("Administration & Secretarial")]
    AdministrationAndSecretarial,
    [Description("Advertising, Media, Arts & Entertainment")]
    AdvertisingMediaArtsAndEntertainment,
    //
    // ...more like that...
    //
    [Description("Trades & Services")]
    TradesAndServices,
    [Description("Voluntary, Charity & Social Work")]
    VoluntaryCharityAndSocialWork
}
{% endhighlight %}

#####ASP.NET MVC 5.1 - a shortcut
If you are amongst more lucky ones and happen to use 5.1 or a later version of the ASP.NET MVC,
there's a really neat shortcut - check out this [`EnumDropDownListFor`][2] helper function. (By the
way, isn't that wonderful how cryptic Microsoft's doco is? Fear not though.)

Here's all you really need to do to put a drop down list on a form:

{% highlight html %}
<div class="form-group">
@Html.LabelFor(m => m.Industry)
@Html.EnumDropDownListFor(model => model.Industry, // Model field that will be used to store user selection
                            "- Please select your industry -", // Text for the first 'default' option
                            new { @class = "form-control" })  @* A class name to assign to "select" tag *@
</div>
{% endhighlight %}

Similarly to [simple drop down list][1], you'll get the user's selection in the `model.Industry`
field on POST. The helper function will also do all the heavy lifting to create proper `<option>`
elements under the `<select>` tag, which will have their text set to the corresponding value from
`[Display(Name="...")]` attribute.

#####ASP.NET MVC 5 & 4 - the hard way
In case of earlier versions of the MVC you need to do some work to get those pesky enum values and
their descriptions out. You can use [`@Html.DropDownListFor`][1] helper function, although it needs 
a list of `SelectListItem` objects, so we need to convert the members of the enum into instances of the
that class. Here's a way of doing this:

{% highlight csharp %}
private IEnumerable<SelectListItem> GetSelectListItems()
{
    var selectList = new List<SelectListItem>();

    // Get all values of the Industry enum
    var enumValues = Enum.GetValues(typeof(Industry)) as Industry[];
    if (enumValues == null)
        return null;

    foreach (var enumValue in enumValues)
    {
        // Create a new SelectListItem element and set its 
        // Value and Text to the enum value and description.
        selectList.Add(new SelectListItem
        {
            Value = enumValue.ToString(),
            // GetIndustryName just returns the Display.Name value
            // of the enum - check out the next chapter for the code of this function.
            Text = GetIndustryName(enumValue)
        });
    }

    return selectList;
}
{% endhighlight %}

####Show selected enum value on a page
Both of the solutions above help you to get a user-selected value in the model on postback, but how
can you actually render that value, in its readable form, on another page? Instead of using the enum
value, we want to render the value specified in those `[Display(Name="...")]` attributes.

That's how to get the text description out:

{% highlight csharp %}
private string GetIndustryName(Industry value)
{
    // Get the MemberInfo object for supplied enum value
    var memberInfo = value.GetType().GetMember(value.ToString());
    if (memberInfo.Length != 1)
        return null;

    // Get DisplayAttibute on the supplied enum value
    var displayAttribute = memberInfo[0].GetCustomAttributes(typeof(DisplayAttribute), false)
                           as DisplayAttribute[];
    if (displayAttribute == null || displayAttribute.Length != 1)
        return null;

    return displayAttribute[0].Name;
}
{% endhighlight %}

And put it on the model:

{% highlight csharp %}
public ActionResult ViewProfile()
{
    // Get user profile information from the session
    var model = Session["UserProfileModel"] as UserProfileModel;
    if (model == null)
        return RedirectToAction("UserProfile");

    // Get the description of the currently selected industry from the 
    // [Display] attribute of Industry enum
    model.IndustryName = GetIndustryName(model.Industry);

    return View(model);
}
{% endhighlight %}

####But wait, there's more!
That's all good and everything, I hear you saying, but what if I have more than just one enum? Say I
also want to use fields like '_Gender_', '_State_' and '_Time Zone_' on my profile page.  Wouldn't
it be nicer if instead of having to decalre a new, slightly different function for each of those
enums you could create just a **_generic_** function, that deals with any enum as long as that enum
adheres to the convention above?


Call to action

[1]:{% post_url 2014-10-15-using-simple-drop-down-lists-in-ASP-NET-MVC %}
[2]:http://msdn.microsoft.com/en-us/library/system.web.mvc.html.selectextensions.enumdropdownlistfor(v=vs.118).aspx
[3]:/img/mvc/dropdowns-2/profile.png