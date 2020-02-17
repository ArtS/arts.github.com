---
layout: post
title: How to avoid and fix NullReferenceExceptions in ASP.NET MVC
categories:
- programming
tags:
- asp.net mvc
- c#
status: publish
type: post
published: true
---
Quite often people stumble into same problems again and again, and getting a NullReferenceException
is the one that occurs most frequently, and frankly, can be quite annoying. This problem happens when
writing brand-new ASP.NET MVC code, such as controllers or views, but also when modifying existing
code that used to work just fine, but somehow suddenly got broken. Here I want to show you why these
exceptions happen and how to fix them, so you can stop wasting your time and do more of the
programming that you actually enjoy.

_Not sure where should those `try`...`catch` blocks go in your code? Learn how to deal with various
types of exceptions in your apps: [Where should you put "try ... catch" statements in your C#
code][2]_

## What is NullReferenceException and where can it happen?

NullReferenceException is exactly what it says - it is thrown by .NET Runtime
when your code tries to access properties or call methods using empty, or null,
reference. It sounds obvious and trite, but finding a place in your code where
things went haywire may take some time.

## NullReferenceException in .cshtml Razor views

Let's say you have a UserProfile.cshtml page that displays "Industry" selection
drop down list for a logged in user (to put a dropdown on a form see my [other
article][1]):

{% highlight html %}
@model UserProfileModel

<div class="form-group">
    @Html.LabelFor(m => m.Industry)
    @Html.EnumDropDownListFor(model => model.Industry,
                              Model.Industries,
                              "- Please select your industry -",
                              new { @class = "form-control" })
</div>
{% endhighlight %}

and when you hit this page you see the following exception:

<style>
.exception {
  font-family:"Verdana";font-weight:normal;font-size: .7em;color:black;
  line-height: normal;
  color: #000;
  margin-bottom: 30px;
}
.exception b {font-family:"Verdana";font-weight:bold;color:black;margin-top: -5px}
.exception H1 { font-family:"Verdana";font-weight:normal;font-size:18pt;color:red }
.exception H2 { font-family:"Verdana";font-weight:normal;font-size:14pt;color:maroon }
.exception pre {font-family:"Consolas","Lucida Console",Monospace;font-size:11pt;margin:0;padding:0.5em;line-height:14pt;border:none;background-color:#ffc;color: #000;}
.exception code {padding:0;}
.exception .marker {font-weight: bold; color: black;text-decoration: none;}
.exception .version {color: gray;}
.exception .error {margin-bottom: 10px;}
.exception .expandable { text-decoration:underline; font-weight:bold; color:navy; cursor:hand; }
.exception table {
  background-color: #ffffcc;
}
.exception hr {
  margin: 0.5em;
  padding: 0;
}
</style>
<div class="exception">
<span><h1>Server Error in '/' Application.<hr width="100%" size="1" color="silver"></h1>
<h2> <i>Object reference not set to an instance of an object.</i> </h2></span>
<font face="Arial, Helvetica, Geneva, SunSans-Regular, sans-serif ">
<b> Description: </b>An unhandled exception occurred during the execution of the current web request. Please review the stack trace for more information about the error and where it originated in the code.
<b> Exception Details: </b>System.NullReferenceException: Object reference not set to an instance of an object.<br><br>
<b>Source Error:</b> <br><br>
<table width="100%" bgcolor="#ffffcc">
<tbody><tr>
        <td>
<code><pre>
Line 27:                     &lt;div class="form-group"&gt;
Line 28:                         @Html.LabelFor(m =&gt; m.Industry)
<font color="red">Line 29:                         @Html.EnumDropDownListFor(m =&gt; m.Industry,
</font>Line 30:                                                   Model.Industries,
Line 31:                                                   "- Please select your industry -",
</pre></code>
</td>
</tr>
</tbody></table>
<br>
<b> Source File: </b> c:\[...]\Views\Profile\UserProfile.cshtml<b> &nbsp;&nbsp; Line: </b> 29
<br><br>
<b>Stack Trace:</b> <br><br>
<table width="100%" bgcolor="#ffffcc">
<tbody><tr>
        <td>
        <code><pre>
[NullReferenceException: Object reference not set to an instance of an object.]
ASP._Page_Views_Profile_UserProfile_cshtml.Execute() in c:\...\Views\Profile\UserProfile.cshtml:29
System.Web.WebPages.WebPageBase.ExecutePageHierarchy() +271
[... some lines deleted ...]
System.Web.Mvc.MvcHandler.System.Web.IHttpAsyncHandler.EndProcessRequest(IAsyncResult result) +38
System.Web.CallHandlerExecutionStep.System.Web.HttpApplication.IExecutionStep.Execute() +932
System.Web.HttpApplication.ExecuteStep(IExecutionStep step, Boolean&amp; completedSynchronously) +188
</pre></code>
</td>
</tr>
</tbody></table>
<hr width="100%" size="1" color="silver">
</font>
</div>

Believe me or not, this problem trips people over most often. The reason for this exception 
is that no model is being passed to the view from the controller's action:

{% highlight csharp %}
public ActionResult UserProfile() {
    var userModel = GetLoggedInUser();
    //
    // … some more super-serious business logic in here ...
    //
    return View(); // <-- HERE'S THE PROBLEM!
}
{% endhighlight %}

That's why when the view is being rendered, `Model` variable inside of .cshtml
points to `null`, and trying to access `null.FirstName` obviously throws a brand
spanking new `NullReferenceException`. To fix this need to pass an instance of
the model to the View() call:

{% highlight csharp %}
public ActionResult UserProfile() {
    var userModel = GetLoggedInUser();
    //
    // … some more super-serious business logic in here ...
    //
    return View(userModel); // <-- JUST PASS THE MODEL HERE, TOO EASY!
}
{% endhighlight %}

## NullReferenceException when working with database entities

This is a second most-common problem - when loading entities from a database,
you cannot always be sure whether an object you're trying to load or one of its
linked entities exists. Say there's an optional `Address` object that
`UserProfile` object can be linked to. If you do the following in your code,
you'll get a NullReferenceException when `Address` is missing:

{% highlight csharp %}
public int GetUserPostCode(int userId) {
    var user = GetUserFromDb(userId);
    return user.Address.PostCode;
}
{% endhighlight %}

In which case the following exception will blow your call stack right up:

<div class="exception">
<span><h1>Server Error in '/' Application.<hr width="100%" size="1" color="silver"></h1>

<h2> <i>Object reference not set to an instance of an object.</i> </h2></span>

<font face="Arial, Helvetica, Geneva, SunSans-Regular, sans-serif ">

<b> Description: </b>An unhandled exception occurred during the execution of the current web request. Please review the stack trace for more information about the error and where it originated in the code.

<br><br>

<b> Exception Details: </b>System.NullReferenceException: Object reference not set to an instance of an object.<br><br>

<b>Source Error:</b> <br><br>

<table width="100%" bgcolor="#ffffcc">
<tbody><tr>        <td>        <code><pre>
Line 55:         public int GetUserPostCode(int userId) {
Line 56:             var user = GetUserFromDb(userId);
<font color="red">Line 57:             return user.Address.PostCode;</font>
Line 58:         }
</pre></code></td></tr></tbody></table>
<br>

<b> Source File: </b> c:\...\Controllers\ProfileController.cs<b> &nbsp;&nbsp; Line: </b> 57
<br><br>

<b>Stack Trace:</b> <br><br>

<table width="100%" bgcolor="#ffffcc">
<tbody><tr>
        <td>
        <code><pre>
[NullReferenceException: Object reference not set to an instance of an object.]
App.Controllers.ProfileController.ViewProfile() in c:\...\Controllers\ProfileController.cs:57
lambda_method(Closure , ControllerBase , Object[] ) +101
System.Web.Mvc.ActionMethodDispatcher.Execute(ControllerBase controller, Object[] parameters) +59
... some lines skipped...
System.Web.CallHandlerExecutionStep.System.Web.HttpApplication.IExecutionStep.Execute() +932
System.Web.HttpApplication.ExecuteStep(IExecutionStep step, Boolean&amp; completedSynchronously) +188
</pre></code>
        </td>
</tr>
</tbody></table>
<br>
<hr width="100%" size="1" color="silver">
<b>Version Information:</b>&nbsp;Microsoft .NET Framework Version:4.0.30319; ASP.NET Version:4.0.30319.34212
</font>
</div>

To fix this exception, you need to retrieve data in a safe manner - by checking all the reference
types first and avoiding dangerous assumptions that related objects are always going to be present:

{% highlight csharp %}
public int? GetUserPostCode(int userId) { // Notice that function returns nullable int now
    var user = GetUserFromDb(userId);
    if (user != null && user.Address != null) { // This check will help to avoid NullReferenceExceptions
        return user.Address.PostCode;
    }
    return null;
}
{% endhighlight %}

## NullReferenceException when calling methods on null

Similarly, calling any functions on a null reference will result in
NullReferenceException. Say you are building an auction site, where users can
add photos to their listings. There's class called 'Listing' that has a
collection of 'Photos', and you want users to be able to submit new listings
along with the photos in the following manner:

{% highlight csharp %}
[HttpPost]
public ActionResult NewListing(ListingModel model) {
    var newListing = new ListingDBObject {
        Price = model.Price,
        Title = model.Title,
        ContactNumber = model.ContactNumber
    }

    foreach (var photo in model.Photos) {
        newUser.Photos.Add(new PhotoDBObject { // <- THIS WILL BLOW UP!
            BinaryData = photo.Data;
        });
    }

    //...here goes code that saves new listing to the database
}
{% endhighlight %}

Again, you'll get a brand new NullReferenceException with the following stack
trace:

<div class="exception">
<span><h1>Server Error in '/' Application.<hr width="100%" size="1" color="silver"></h1>

<h2> <i>Object reference not set to an instance of an object.</i> </h2></span>

<font face="Arial, Helvetica, Geneva, SunSans-Regular, sans-serif ">

<b> Description: </b>An unhandled exception occurred during the execution of the current web request. Please review the stack trace for more information about the error and where it originated in the code.

<br><br>

<b> Exception Details: </b>System.NullReferenceException: Object reference not set to an instance of an object.<br><br>

<b>Source Error:</b> <br><br>

<table width="100%" bgcolor="#ffffcc">
<tbody><tr>        <td>        <code><pre>
Line 25:
Line 26:    foreach (var photo in model.Photos) {
<font color="red">Line 27:        newUser.Photos.Add(new PhotoDBObject {</font>
Line 58:            BinaryData = photo.Data;
</pre></code></td></tr></tbody></table>
<br>

<b> Source File: </b> c:\...\Controllers\ProfileController.cs<b> &nbsp;&nbsp; Line: </b> 27
<br><br>

<b>Stack Trace:</b> <br><br>

<table width="100%" bgcolor="#ffffcc">
<tbody><tr>
        <td>
        <code><pre>
[NullReferenceException: Object reference not set to an instance of an object.]
App.Controllers.ProfileController.NewListing() in c:\...\Controllers\ProfileController.cs:27
lambda_method(Closure , ControllerBase , Object[] ) +101
System.Web.Mvc.ActionMethodDispatcher.Execute(ControllerBase controller, Object[] parameters) +59
... some lines skipped...
System.Web.CallHandlerExecutionStep.System.Web.HttpApplication.IExecutionStep.Execute() +932
System.Web.HttpApplication.ExecuteStep(IExecutionStep step, Boolean&amp; completedSynchronously) +188
</pre></code>
        </td>
</tr>
</tbody></table>
<br>
<hr width="100%" size="1" color="silver">
<b>Version Information:</b>&nbsp;Microsoft .NET Framework Version:4.0.30319; ASP.NET Version:4.0.30319.34212
</font>
</div>

To fix this you need to initialise the collection first:
{% highlight csharp %}
[HttpPost]
public ActionResult NewListing(ListingModel model) {
    var newListing = new ListingDBObject {
        Price = model.Price,
        Title = model.Title,
        ContactNumber = model.ContactNumber
    }

    newUser.Photos = new List<PhotoDBObject>(); // Initialise the collection first so it's not null
    foreach (var photo in model.Photos) {
        newUser.Photos.Add(new PhotoDBObject { // Add objects to the collection
            BinaryData = photo.Data;
        });
    }

    //...here goes code that saves new listing to the database
}
{% endhighlight %}

{% comment %}
{% include experiment.html %}
{% endcomment %}

## But Wait, There's More! {#ctaTitle}

{::options parse_block_html="true" /}
<div id="ctaCopy">
I hope this article helped you to solve your problem and saved you a bit of time and frustration!

Don't miss my next post - subscribe to the mailing list to get handy tips and solutions for ASP.NET
NVC Core. I never spam, and you can unsubscribe at any time.
</div>

{::options parse_block_html="false" /}
{% include subscription.html %}

[1]:{% post_url 2015-01-06-dropdownlistfor-with-dictionaries-in-ASP-NET-MVC-and-why-SelectList-wants-to-kill-you %}
[2]:{% post_url 2020-02-17-where-should-you-put-try-catch-statements-in-your-code %}
