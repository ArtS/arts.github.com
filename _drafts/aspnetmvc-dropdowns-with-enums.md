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
ASP.NET MVC is a very powerful, yet quite complex, if not complicated, web
development framework. It's got heaps of various namespaces, classes, functions
and it's hard to tell from just online manuals, such as MSDN, which particular
class or a function overload you need to use for your very specific task.

Seemingly simple things, such as putting a humble drop down that contains
members of a given enum can be quite perplexing, and a lot of people get stuck
there, not even knowing where to start. In this article I'd like to show you,
in a few simple steps, how to do the following:

- put a drop down list on a form
- populate the drop down list with values from an enum, containing a list of industries
- make sure text in the drop down list is easy to read, such as _Construction, Architecture & Interior Design_, not _ConstructionArchitectureAndInteriorDesign_
- have a default value in the drop down list that prompts user to select something, "Please select your industry"

????Check out my previous article [simple dropdown url] for the nitty-gritty
details on how to use a simple drop down list on a form - that gives a good
overview of how different pieces fit together.???

Solution walkthrough
Let's put together a fictitious user profile page which has text boxes for
First and Last names and Industry selection drop down list. That's how it's
going to look like.

[]

Contents of the drop down list will be based on the following enum:
{% highlight csharp %}
public enum Industry
{
    [Display(Name="Accounting")]
    Accounting,
    [Display(Name="Administration & Secretarial")]
    AdministrationAndSecretarial,
    [Display(Name="Advertising, Media, Arts & Entertainment")]
    AdvertisingMediaArtsAndEntertainment,
    //
    // ...more like that...
    //
    [Display(Name="Trades & Services")]
    TradesAndServices,
    [Display(Name="Voluntary, Charity & Social Work")]
    VoluntaryCharityAndSocialWork
}
{% endhighlight %}

To transform this enum and its nice descriptions into a bunch of options in the drop down list, we
can use a helper function `@Html.DropDownListFor`. This function needs a list of `SelectListItem`
objects, so we need to convert the members of the enum into instances of the that class. Here's a
way of doing this:

{% highlight csharp %}
private IEnumerable<SelectListItem> GetSelectListItems()
{
    var selectList = new List<SelectListItem>();
    
    var enumType = typeof(Industry);
    var enumValues = Enum.GetValues(enumType) as Industry[];
    if (enumValues == null)
        return null;

    foreach (var enumValue in enumValues)
    {
        var memberInfo = enumType.GetMember(enumValue.ToString());
        if (memberInfo.Length != 1)
            continue;
        
        var displayAttribute = memberInfo[0].GetCustomAttributes(typeof (DisplayAttribute), false)
                               as DisplayAttribute[];
        if (displayAttribute == null || displayAttribute.Length != 1)
            continue;

        selectList.Add(new SelectListItem
        {
            Value = enumValue.ToString(),
            Text = displayAttribute[0].Name
        });
    }

    return selectList;
}
{% endhighlight %}

Closing comments/links to previous article

Call to action

