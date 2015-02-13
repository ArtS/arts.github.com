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
Recently, when writing code for my blog post on drop downs, "[DropDownListFor with Dictionaries in
ASP.NET MVC and why SelectList wants to kill you][1]", I stumbled over an interesting problem - when
using ASP.NET MVC HTML helpers, such as `@Html.TextBoxFor()` and `@Html.DropDownListFor()` to render
controls and `@Html.ValidationMessageFor()` to render validation error messages I reaslised that
ASP.NET NVC uses its own CSS classes, so no errors are getting highlighted when using Bootstrap 3.

There's nothing wrong with MVC as such in here, as it is meant to be CSS framework agnostic, meaning
you should be able to use it with any CSS framework.

To get better understanding of the problem, have a look at this excerpt of ASP.NET MVC form that
contains an error message for a required text field.

{% highlight html %}
<div class="form-group">

    <label for="FirstName">First name</label>

    <input class="input-validation-error form-control" data-val="true"
           data-val-required="The First name field is required."
           id="FirstName" name="FirstName" type="text" value="">

    <span class="field-validation-error" data-valmsg-for="FirstName"
          data-valmsg-replace="true">The First name field is required.</span>

</div>
{% endhighlight %}

As you can see, ASP.NET uses its own CSS classes, such as `input-validation-error` (used to
highlight control with an invalid value) and `field-validation-error` (contains explanatory text for
the error) to indicate there's validation error.

Without proper styling this control looks something like this:

<p class="center" markdown="1">
    ![No styling on the control][2]
</p>

But Bootstrap 3 has this awesome indication for invalid form controls, that hightlights the entire
control and the error text, so you can get something like this:

<p class="center" markdown="1">
    ![Like a boss][3]
</p>

So following [Bootstrap's own documentation][4] we need to make sure that control with error has a
parent with the class of `has-error` and the validation error message element needs to have the
class of `text-danger`. And luckily we can do this with literally 2 lines of JavaScript.



[1]:http://nimblegecko.com/dropdownlistfor-with-dictionaries-in-ASP-NET-MVC-and-why-SelectList-wants-to-kill-you/
[2]:/img/mvc/bootstrap3/no-style.png
[3]:/img/mvc/bootstrap3/like-a-boss.png
[4]:http://getbootstrap.com/css/#forms-control-validation
