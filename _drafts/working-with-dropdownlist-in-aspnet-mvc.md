---
layout: post
title: Working with DropDownList in ASP.NET MVC
categories: programming
tags:
- DIY
status: publish
type: post
published: true
---
It's surprising how many subtle, but frustrating traps one can fall into when building sites with
ASP.NET MVC. Creating forms for the web is one of them. It's common for people to spend hours
on a trivial thing, something like displaying a selected value in a DropDownList, or getting that
selected value back in a controller. Quite often it happens when you just start learning ASP.NET
MVC or upgrade from an older tech. And boy, is this frustrating as hell - instead of building the 
actual web app you spend hours wrestling with the framework. 

I want to show you how to build a simple form with a drop down list that's got "Please select" text
as the first option and is based on the list of strings supplied by the controller. I'll show you
how to display that list on a form, how to get user's selection in the controller, check user has
selected something and render the list back to the user with the value selected.

Sounds deceptively simple, right? Hold that thought for now and have a look at the [Microsoft's own
documentation][1]  for the `@Html.DropDownListFor` function. It has 6 different overloads - which
one of those do you really need? And what are those mysterious `<TModel, TProperty>`? Now throw into
the mix various ways you can pass the data into the view: ViewBag, ViewData or TempData? Or maybe
Model?. So you are naturally in the perfect spot to start making mistakes.

We need to clear this up once and for all. In this example I will take you through building a
simplistic "Sign Up" form that consists of two fields: Name and State. Both of these fields are
required - this way we can test rendering of selected dropdown list value on the postback.

![Sign Up form][2]

Here's a basic structure to start with: a controller to handle user request and a view that renders
a "registration" form.

[Controller code] [Explanations]

[View code] [Explanations]

What's missing?


I deliberately didn't add any data access or data validation code so it's easier to focus on the
problem at hand. Validation is a complex topic and deserves to be covered separately, which I will
do in the upcoming articles. You can sign up for the updates below so you can learn how to tackle
        the inherent complexity in .NET with ease, all while balancing a stack of chocolates on top
        of


In this series of articles I want to look into the most common problems that happen when working
with forms and controls in the ASP.NET MVC. I will start at the very basic level and will gradually
increase the complexity of problems. However I will do everything I can to make the solutions as
simple as possible.


[1]:http://msdn.microsoft.com/en-us/library/system.web.mvc.html.selectextensions.dropdownlistfor(v=vs.118).aspx
[2]:/img/mvc/dropdowns-1/sign-up.png
![First cut][1]
[5]:http://amzn.to/1qX3LX2
