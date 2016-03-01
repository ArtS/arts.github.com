---
layout: post
title: How to validate a text input for only printable ASCII characters in ASP.NET MVC
categories:
- programming
tags:
- jekyll3
status: publish
type: post
published: true
---
Let’s dive right in, plain and simple: for some reason, you need to make sure that user does not
enter any non-printable characters into a text input field on a form. Maybe the data needs to travel
to far reaches of the known universe, to a remote ancient banking backend system that runs on COBOL
and mainframes (fueled by the energy of a dying brown dwarf). Or maybe the column in the database
where this data is going to end up has never heard of Unicode. Or maybe that’s just one of those
unexplainable, irrational so-called “business rules”, that some aspiring manager somewhere up in the
ranks decided to implement.

##Good old friend, Regular Expression
ASP.NET MVC comes with a plenty of inbuilt validators, and `RegularExpression` is one of them. I
will spare you the lengthy details of how validation works in ASP.NET MVC, if you're interested
in theory, check out [this article][1].

All we need to do is to chuck a `[RegularExpression]` validation attribute on our model and specify
a couple of parameters:

{% highlight csharp %}
public class AccountModel
{
    [Required]
    [RegularExpression("[ -~]+", // Regular expression to use for validation
                       // Error message to display
                       ErrorMessage = "Please use only printable English characters")]
    [Display(Name = "Account name")]
    public string AccountName { get; set; }
}
{% endhighlight %}

The value parameter for the regular expression attribute deserves a bit of explanation. If you look
at the [ASCII table][2], you will see that printable part of the table starts with the space
character (` `) and ends with the tilde character, that is `~`.

We're using the [character class regex][3] in here, specifying the range of acceptable characters
starting from space and ending with the tilde: `[ -~]`. Dash character serves here as a separator,
essentially saying: "_match all characters starting from space and ending with tilde_". In order to
match more than just one character, we specify `+`, which is a [repetition operator][4].

## One big catch
There's, at least, one more way of specifying the filtering regex for the `[RegularExpression]`
attribute - instead of including only printable characters, you can try to exclude non-printable
ones. So your regular expression would look something like this: `[^\x00-\x7F]+`. This is actually
quite a bad idea if you are ever going to use FluentValidation. When this regex is translated to
JavaScript statement and executed, it's going to produce the following error:

`Uncaught SyntaxError: Invalid regular expression: /[^�-]/: Range out of order in character class`

So instead of filtering out non-printable characters explicitly, just stick to checking that all
characters are, in fact, printable.

## Controller code
That's really it. What's remaining is to see how this is getting validated in the controller.
{% highlight csharp %}
//
// 2. Action method for handling user-entered data when 'Update' button is pressed.
//
[HttpPost]
public ActionResult UpdateAccount(AccountModel model)
{
    // In case everything is fine - i.e. "AccountName" is entered and valid,
    // redirect the user to the "ViewAccount" page, and pass the account object along via Session
    if (ModelState.IsValid)
    {
        Session["AccountModel"] = model;

        // In here you can add saving of object to a database

        return RedirectToAction("ViewAccount");
    }

    // Validation failed, something is not right. Re-render the registration page, keeping user-entered data
    // and display validation errors
    return View("Index", model);
}
{% endhighlight %}

## Enabling FluentValidation
If you want to add client-side JavaScript validation, refer to my earlier article, ["How to use
Bootstrap 3 validation states with ASP.NET MVC Forms"][5], or simply download the code for this
article from GitHub - I enabled FluentValidation in this project for you. Here's the [zip][6] with
complete source code, or you can [browse it][7] on GitHub.

{% include experiment.html %}

## Wait, there's more {#ctaTitle}
I hope this short article helped you to avoid the same trap I fell into and saved you some time.

Do you want to avoid wasting your time on stupid bugs and traps in ASP.NET MVC? Did you ever waste
hours of your time on some infuriatingly obscure bug or an edge case? It doesn't have to be
like that.

Subscribe to my mailing list and save HOURS of your life - I never spam, and I only send useful and
actionable advice.

{% include subscription.html %}

[1]:http://www.asp.net/mvc/overview/getting-started/introduction/adding-validation
[2]:https://en.wikipedia.org/wiki/ASCII#ASCII_printable_code_chart
[3]:http://www.regular-expressions.info/charclass.html
[4]:http://www.regular-expressions.info/repeat.html
[5]:{% post_url 2015-02-15-how-to-use-bootstrap-3-validation-states-with-asp-net-mvc-forms %}
[6]:https://github.com/ArtS/aspnetmvc-asciionly-textbox-/archive/master.zip
[7]:https://github.com/ArtS/aspnetmvc-asciionly-textbox-
