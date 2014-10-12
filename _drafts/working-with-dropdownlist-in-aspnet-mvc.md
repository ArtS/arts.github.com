---
layout: post
title: Working with DropDownList in ASP.NET MVC
categories:
- programming
tags:
- asp.net mvc
- c#
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

<p class="center" markdown="1">
    ![Sign Up form][2]
</p>

Here are the bits and pieces we need for this task: a model to hold the user-entered data, a
controller to handle user requests and a view that renders the "Sign Up" form. Let's take these
pieces apart.

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
As you can see model is pretty simple and reflects the form's fields except for one property -
`States`. It works together with `State` property - while the the `State` receives user's selection,
`States` hold a list of all possible selections.

#### Controller
Controller's a bit more complex - it consists of 3 action methods and a couple of utility functions.
{% highlight csharp %}
    public class SignUpController : Controller
    {
        //
        // 1. Action method for displaying a 'Sign Up' page
        //
        public ActionResult SignUp()
        {
            // Let's get all states that we need for a DropDownList
            var states = GetAllStates();

            var m = new SignUpModel
            {
                // Create a list of SelectListItems so these can be rendered on the page
                States = GetSelectListItems(states)
            };

            return View(m);
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
            // only selected in the DropDownList value is posted back, not the whole
            // list of states
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
            // that has both it's Value and Text properties set to a particular state.
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

[Explanations]

{% highlight html %}
    // View code
{% endhighlight %}

[Explanations]

What's missing?


I deliberately didn't add any data access or data validation code so it's
easier to focus on the problem at hand. Validation is a complex topic and
deserves to be covered separately, which I will do in the upcoming articles.
You can sign up for the updates below so you can learn how to tackle the
inherent complexity in .NET with ease, all while balancing a stack of
chocolates on top of


In this series of articles I want to look into the most common problems that happen when working
with forms and controls in the ASP.NET MVC. I will start at the very basic level and will gradually
increase the complexity of problems. However I will do everything I can to make the solutions as
simple as possible.


[1]:http://msdn.microsoft.com/en-us/library/system.web.mvc.html.selectextensions.dropdownlistfor(v=vs.118).aspx
[2]:/img/mvc/dropdowns-1/sign-up.png
