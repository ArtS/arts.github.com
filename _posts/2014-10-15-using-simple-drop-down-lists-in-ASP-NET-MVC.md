---
layout: post
title: Using simple Drop Down Lists in ASP.NET MVC
categories:
- programming
tags:
- asp.net mvc
- c#
status: publish
type: post
published: true
---
<script src="//www.google-analytics.com/cx/api.js?experiment=2w87ahlPSw6M93zJ0HC4KA"></script>
<script>
(function() {
  var varIndex = cxApi.chooseVariation();
  var variations = [
    function() {},
    function() {
      $('#ctaTitle').text('STOP now and subscribe!');
    }
  ];
  $(document).ready(variations[varIndex]);
})();
</script>
It's surprising how many subtle, but frustrating traps one can fall into when building sites with
ASP.NET MVC. Creating forms for the web is one of them. It's common to spend hours on something
trivial, such as displaying a selected value in a DropDownList on postback, or getting that selected
value in a controller. Quite often it happens when you just start learning ASP.NET MVC or upgrade
from an older tech. And boy, is this frustrating as hell -- instead of building an actual web app,
you spend hours wrestling with the framework.

I want to show you how to build a simple form with a drop down list that's got "Please select" text
as the first option and is based on the list of strings supplied by the controller. I'll show you
how to display that list on a form, how to get user's selection in the controller, check that user
has selected something and render the list back to the user with the value selected.

Sounds deceptively simple, right? Hold that thought for now and have a look at the [Microsoft's own
documentation][1]  for the `@Html.DropDownListFor` function. It has 6 different overloads -- which
one of those do you really need? And what are those mysterious `<TModel, TProperty>` or
`optionLabel`? Now throw into the mix various ways you can pass the data into the view: ViewBag,
ViewData or TempData? Or maybe Model? So you are naturally in the perfect spot to start making
mistakes.

We need to clear this up once and for all. In this example I will take you through building a
simplistic "Sign Up" form that consists of two fields: Name and State. Both of these fields are
required -- this way we can test rendering of selected dropdown list value on the postback.

<p class="center" markdown="1">
    ![Sign Up form][2]
</p>

The following bits and pieces are needed:

* a model to hold user-entered data
* a controller to handle user requests
* a view that renders the "Sign Up" form

Here's the [complete code][3] of the solution used in this article. You can also [browse the
code][4] online or clone the git repository. Now let's dive right into the details.

####Model
{% highlight csharp %}
    public class SignUpModel
    {
        [Required]
        [Display(Name="Name")]
        public string Name { get; set; }

        // This property will hold a state, selected by user
        [Required]
        [Display(Name="State")]
        public string State { get; set; }

        // This property will hold all available states for selection
        public IEnumerable<SelectListItem> States { get; set; }
    }
{% endhighlight %}
As you can see model is pretty simple and reflects the form's fields except for one property --
`States`. It works together with the `State` property -- while the the `State` receives user's
selection, `States` hold a list of all possible selections.

#### Controller
Controller's a bit more complex - it consists of 3 action methods and a couple of utility functions.
{% highlight csharp %}
    public class SignUpController : Controller
    {
        //
        // 1. Action method for displaying 'Sign Up' page
        //
        public ActionResult SignUp()
        {
            // Let's get all states that we need for a DropDownList
            var states = GetAllStates();

            var model = new SignUpModel();

            // Create a list of SelectListItems so these can be rendered on the page
            model.States = GetSelectListItems(states);

            return View(model);
        }

        //
        // 2. Action method for handling user-entered data when 'Sign Up' button is pressed.
        //
        [HttpPost]
        public ActionResult SignUp(SignUpModel model)
        {
            // Get all states again
            var states = GetAllStates();

            // Set these states on the model. We need to do this because
            // only the selected value from the DropDownList is posted back, not the whole
            // list of states.
            model.States = GetSelectListItems(states);

            // In case everything is fine - i.e. both "Name" and "State" are entered/selected,
            // redirect user to the "Done" page, and pass the user object along via Session
            if (ModelState.IsValid)
            {
                Session["SignUpModel"] = model;
                return RedirectToAction("Done");
            }

            // Something is not right - so render the registration page again,
            // keeping the data user has entered by supplying the model.
            return View("SignUp", model);
        }

        //
        // 3. Action method for displaying 'Done' page
        //
        public ActionResult Done()
        {
            // Get Sign Up information from the session
            var model = Session["SignUpModel"] as SignUpModel;

            // Display Done.html page that shows Name and selected state.
            return View(model);
        }

        // Just return a list of states - in a real-world application this would call
        // into data access layer to retrieve states from a database.
        private IEnumerable<string> GetAllStates()
        {
            return new List<string>
            {
                "ACT",
                "New South Wales",
                "Northern Territories",
                "Queensland",
                "South Australia",
                "Victoria",
                "Western Australia",
            };
        }

        // This is one of the most important parts in the whole example.
        // This function takes a list of strings and returns a list of SelectListItem objects.
        // These objects are going to be used later in the SignUp.html template to render the
        // DropDownList.
        private IEnumerable<SelectListItem> GetSelectListItems(IEnumerable<string> elements)
        {
            // Create an empty list to hold result of the operation
            var selectList = new List<SelectListItem>();

            // For each string in the 'elements' variable, create a new SelectListItem object
            // that has both its Value and Text properties set to a particular value.
            // This will result in MVC rendering each item as:
            //     <option value="State Name">State Name</option>
            foreach (var element in elements)
            {
                selectList.Add(new SelectListItem
                {
                    Value = element,
                    Text = element
                });
            }

            return selectList;
        }
    }
{% endhighlight %}

The most important piece in the controller is the following code (and it's repeated in both `SignUp`
methods):
{% highlight csharp %}
    model.States = GetSelectListItems(states);
{% endhighlight %}
As said above, this code runs twice -- first when user loads the 'Sign Up' page in the browser and 
the form is displayed, and second time when user submits the form.

Why does it need to happen twice? The nature of browser forms is such that **only selected values
are posted back**, and if you want to display the form after a postback (in case there's a
validation error in one of the form's controls, for example), you need to populate all the
supplementary data again, otherwise controls such as DropDownLists will be just rendered empty.

####View
And View is the final destination where it all comes together with the help of
`Html.DropDownListFor()` function.
{% highlight html %}
@model Dropdowns.Models.SignUpModel

@{ ViewBag.Title = "Sign up"; }

<div class="row">
    <div class="col-sm-4 col-sm-offset-4">

        <h1>Sign up</h1>

        <div class="panel panel-default">
            <div class="panel-body">
                @using (Html.BeginForm("SignUp", "SignUp", FormMethod.Post, new { role = "form" })) {

                    @* Name textbox *@
                    <div class="form-group">
                        @Html.LabelFor(m => m.Name)
                        @Html.TextBoxFor(m => m.Name, new { @class = "form-control" })
                    </div>

                    @* State selection dropdown *@
                    <div class="form-group">
                        @Html.LabelFor(m => m.State)
                        @Html.DropDownListFor(m => m.State, // 1. Store selected value in Model.State;
                                                            // when page is rendered after postback,
                                                            // take selected value from Model.State.

                                              // 2. Take list of values from Model.States
                                              Model.States, 

                                              // 3. Text for the first 'default' option
                                              "- Please select a state -", 

                                              //4. A class name to assign to <select> tag
                                              new { @class = "form-control" })
                    </div>

                    <button type="submit" class="btn btn-primary">Sign up</button>
                }
            </div>
        </div>
    </div>
</div>
{% endhighlight %}
Again, the most important point to note here is the call of `DropDownListFor()` function. It does
all the heavy lifting when rendering a `<select>` tag with a bunch of `<option>` tags.
As you can tell from the comments, its first argument `m => m.State` is used to store and retrieve 
selected value, and its second argument `Model.States` is used to supply all possible selections for
the dropdown. In the end you get something like this sent to user's browser:
{% highlight html %}
<select class="form-control" id="State" name="State">
    <option value="">- Please select a state -</option>
    <option value="ACT">ACT</option>
    <option value="New South Wales">New South Wales</option>
    <option value="Northern Territories">Northern Territories</option>
    <option value="Queensland">Queensland</option>
    <option value="South Australia">South Australia</option>
    <option value="Victoria">Victoria</option>
    <option value="Western Australia">Western Australia</option>
</select>
{% endhighlight %}
Oh, and remember that cryptic `optionLabel` argument of `DropDownListFor` function? It's actually used to render
the 'prompt' option of the drop down list. I'd never be able to tell that from the name alone!

Here's a download link to the [complete code][3] of the solution used in this article. You can 
[browse the code][4] online or clone the git repository.

I deliberately didn't put any data access or data validation code so it's easier to focus on the
problem at hand. Validation is a complex topic and deserves to be covered separately, which I will
do in the upcoming articles. I also completely skipped the process Model Binding as it's too big 
for this article -- but I will cover that in the later articles too.

Also check out my [next article on how to use `DropDownListFor` with enums][5] - you'll learn how to 
show enums in a readable form in drop down lists and heaps more.

<h3 id="ctaTitle">But wait, there's more</h3>
If you don't want to miss my new articles, sign up to **Untangling .NET** below, and learn how to 
tackle complex problems of ASP.NET MVC with ease, and how to stop wasting hours on trivial problems. 
Stop the vicios frustration cycle and become a better person overall. I never spam, period.

{% include subscription.html %}

[1]:http://msdn.microsoft.com/en-us/library/system.web.mvc.html.selectextensions.dropdownlistfor(v=vs.118).aspx
[2]:/img/mvc/dropdowns-1/sign-up.png
[3]:https://github.com/ArtS/aspnet-dropdowns/archive/master.zip
[4]:https://github.com/ArtS/aspnet-dropdowns
[5]:/aspnetmvc-dropdowns-with-enums/
