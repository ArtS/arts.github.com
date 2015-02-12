---
layout: post
title: How to use Bootstrap 3 validation states with ASP.NET MVC Forms
categories:
- programming
tags:
- asp.net mvc
- c#
status: publish
type: draft
published: true
---
Recently, when writing code for my blog post on drop downs, "[DropDownListFor with Dictionaries in ASP.NET MVC and why SelectList wants to kill you][1]", I stumbled over an interesting problem - when ASP.NET MVC HTML helpers, such as `@Html.TextBoxFor()` and `@Html.DropDownListFor()` render validation error messages into HTML these don't get displayed properly in Bootstrap 3.

There's nothing wrong with MVC as such in here, as it is meant to be agnostic of any CSS framework, meaning that you should be able to use it with any CSS framework. Although problem remains - CSS classes, such as

{% highlight html %}
<div class="form-group">
    <label for="FirstName">First name</label>
    <input class="input-validation-error form-control" data-val="true" data-val-required="The First name field is required." id="FirstName" name="FirstName" type="text" value="">
    <span class="field-validation-error" data-valmsg-for="FirstName" data-valmsg-replace="true">The First name field is required.</span>
</div>
{% endhighlight %}

[1]:http://nimblegecko.com/dropdownlistfor-with-dictionaries-in-ASP-NET-MVC-and-why-SelectList-wants-to-kill-you/
