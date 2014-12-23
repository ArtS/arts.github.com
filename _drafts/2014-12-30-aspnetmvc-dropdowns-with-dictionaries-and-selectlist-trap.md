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
Dictionaries can be quite useful for a number of scenarios - serving as data source for select lists
of countries, states, time zones, age ranges, genders - basically any pre-defined, fixed-set option
lists.

Also, check out my previous articles where I explain how DropDownListFor works, how to [get the
selected value in your controller][1] and how to make sure the selected value is rendered back, as
well as how to use [enums in drop down lists][2] in a user-friendly, humane way.

####DropDownListFor and Dictionary<TKey, TValue>
Let's start with a simplistic user registration page that has, amongst other things, a drop down
list with names of US states (I used Australian states in my [earlier example][1], so this should
balance it nicely). Users need to be able to see a full names of states, such as '_Alabama_', and when
a state is selected, we want to get its abbreviation, such as '_AL_', in the controller.

<p class="center" markdown="1">
    ![User Profile][3]
</p>
<p class="center" markdown="1">
    ![User Profile][4]
</p>

As said earlier, DropDownListFor needs a collection of SelectListItem so it can render the correct
options. There's a very handy (yet treacherous, but I'll get back to that later) helper class
SelectList which can convert a Dictionary (or any collection, for that matter) into a list of
SelectListItems. Let's see how it's done.

[Controller code]
Not too much to be explained here, we've got a classic "get data from database, send it to the view"
scenario.

[View code]

The most important bit here is how SelectList class constructor is called - and how that determines
the contents of generated <option> elements under the <select> element. In here you can see that we
pass our dictionary of states into the constructor and also specify that it should use "Key" field
on enumerated objects (in this case you get a collection of KeyValuePair when you enumerate a
dictionary) to obtain values for the '<option value="">' attribute and "Value" field to use for the
contents of the <option> element.

So our dictionary that looks like this:
[Dictionary snippet]

is turned into html that looks like this:
[piece of matching html code]

it looks like there's at least two ways to select the value in the Drop Down List when rendering it
on the page - two slightly different, somewhat confusing ways. I also want to show you how to use
@Html.DropDownListFor with Dictionaries or arbitrary classes - things such as your own Models.

Secondly, let's have look at that trap with some people fall into. We have already looked into
'classic' way you're supposed to be using @Html.DropDownListFor together with SelectList that many
examples on the net sport:

[@Html.DropDownListFor code with simple SelectList in cshtml]

Everything seems reasonably clean and easy to understand in here - you can see where selected
value's coming from and where it gets stored, from which fields the data for values and text in the
<option>  tags are coming from etc.

Although, sometimes instead of creating a SelectList in the cshtml, people build the list in the
controller, adding SelectItem instances manually. And when you see that SelectItem has a boolean
'Selected' property you may think 'Oh, that's neat, I shall use that'. And that's where the
confusion is.

[describe in details]

I hope this clear some things up for you - leave a comment here if you have any questions and I'll
do my best to address it. Also, subscribe to my mailing list so you can get the freshly baked
articles as soon as I publish them - I want to help you build your web apps better and faster
and avoid getting stuck in the intricacies .NET and ASP.NET MVC.

{% highlight csharp %}
{% endhighlight %}

####Source code
Here are the download links to the [MVC4][4] and [MVC5.1+][5] versions of Visual Studio solutions
that include the above code. You can browse the code ([MVC4][6], [MVC5.1+][7]) online or clone the
git repository.

###But wait, there's more
Hopefully this article helps you navigate the muddy waters of ASP.NET MVC and saves you a few
minutes of your life which is better spent on what you actually want - things like writing good web
apps and not decipheryng cryptic docs.

Sign up to my **Untangling ASP.NET MVC** mailing list to get articles on how to tame the ASP.NET
MVC beast -- there'll be tons more actionable advice on how to write apps faster and easier and how
to avoid spending hours when you get stuck with ASP.NET MVC.

{% include subscription.html %}

[1]:{% post_url 2014-10-15-using-simple-drop-down-lists-in-ASP-NET-MVC %}
[2]:{% post_url 2014-11-17-aspnetmvc-dropdowns-with-enums %}
[3]:/img/mvc/dropdowns-3/profile.png
[4]:/img/mvc/dropdowns-3/profile-animated.gif
[5]:
[6]:
[7]:
