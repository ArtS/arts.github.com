---
layout: post
title: Review of Refactoring Essentials extension for Visual Studio
categories:
- programming
tags:
-
status: publish
type: post
published: true
---
As a developer, more often than not you have to deal with other people’s code. And (hopefully only
sometimes) you want to throw it all away and rewrite if from scratch. Those of us that are saner (or
perhaps just with more battle scars) just roll up our sleeves and get into refactoring. And perhaps
you know how awesome it feels to separate someone’s mess of a code into a neatly structured ensemble
of classes and corresponding methods, especially when you realise that mess was written by your
very self.

There are several extensions that enhance refactoring capabilities of Visual Studio, most notable of
those is the paid-for extension ReSharper. Quite often it gets pitted against its free counterpart,
Refactoring Essentials. In this article I’d like to review Refactoring Essentials extension, so you
can better understand if it’s going to match your needs.

## TLDR: Refactoring Essentials is not a complete ReSharper replacement

Right off the bat, I want to make clear that Refactoring Essentials does refactoring only. It does
not provide any additional navigation features, has no neat unit-testing interface, no support for
code formatting schemes, no improved autocompletion, no exception stack traversal tools.
Refactoring Essentials supports C# and Visual Basic only, and if you need JavaScript/C++/HTML/CSS
refactoring support, you are out of luck.

So if you are looking for one-to-one, drop-in replacement, you will need to get other extensions to
supplement for missing features.

But lemme try and convince you giving Refactoring Essentials a shot -- as there are no absolutes,
and everyone’s needs are different, so Refactoring Essentials still might be a decent fit for your
needs. With that, let’s dive deeper into its actual functionality.

## Overview
To install Refactoring Essentials, head to [vsrefactoringessentials.com][1] and download the
appropriate version (VS2015 or VS2017).

After you install the extension and restart your VS, not a whole lot changes visually -- only new
settings screen appears under _Tools &#8594; Options_. There’s not a lot of settings to be tweaked
-- you can only hide conversion from/to C# to/from Visual Basic from the context menu.

{::nomarkdown}
<figure class="figure">
  <img class="figure-img img-fluid rounded" src="/img/refactoring-essentials/options.png" title="Refactoring Essentials settings"/>
  <figcaption class="figure-caption">Refactoring Essentials settings</figcaption>
</figure>
{:/}

If you want to disable or remove the extension, go to _Tools &#8594; Extensions and Updates_, select
“Refactoring Essentials” and click “Disable”.

## Most frequently used refactoring features

I decided to give Refactoring Essentials a fair shot, and switched to it from Resharper for a few
days, and tried to discover as many features as I could during this week. The list of C#
Refactorings and C# Analysers looks impressively long, but how useful are all those
features?

### Code preview
In the beginning, I really liked the “code preview” feature -- if you are new to the
whole refactoring concept, or just not sure what exactly a particular refactoring will do to your
code, this should be super-helpful. Green background denotes new code, red -- code being removed.
However, I quickly realised that I tend to ignore the preview after first few glances at it, so it
may not be all that useful in the medium to long run. 

{::nomarkdown}
<figure class="figure">
  <img class="figure-img img-fluid rounded" src="/img/refactoring-essentials/code-preview.png" title="Code preview in Refactoring Essentials"/>
  <figcaption class="figure-caption">Code preview in Refactoring Essentials</figcaption>
</figure>
{:/}

### Cast to
This function comes handy when you need to assign an integer variable to an
`enum` type of variable, or when casting generic objects to specific types. Refactoring Essentials
can be helpful in this case, although the code it produces is somewhat redundant.

{::nomarkdown}
<figure class="figure">
  <img class="figure-img img-fluid rounded" src="/img/refactoring-essentials/cast-to-redundant.png" title="Cast to refactoring"/>
  <figcaption class="figure-caption">Example of "Cast to" refactoring</figcaption>
</figure>
{:/}

As you can see in the example generated by Refactoring Essentials, there's a redundant namespace 
part of the class in the type cast. It does not need to be included since it is already in the
visibility scope.

### Convert to auto-property
If you have a lot of old-school properties that rely on a backing field, this refactoring will help to 
shorten the code somewhat.

{::nomarkdown}
<figure class="figure">
  <img class="figure-img img-fluid rounded" src="/img/refactoring-essentials/auto-property.png" title="convert to auto property refactoring"/>
  <figcaption class="figure-caption">Example of "Cast to" refactoring</figcaption>
</figure>
{:/}

### Strange code formatting
Some users complained about strange code formatting issue -- apparently Refactoring Essentials
tends to ignore existing location of braces and spacing, applying VS code formatting rules.

Here you can see how existing code with no spaces between curly braces is being refactored into a
statement with spaces between curly braces. It also applies to all sorts of other things, including
function calls, flow control statements such as `if` and `switch` etc.

{::nomarkdown}
<figure class="figure">
  <img class="figure-img img-fluid rounded" src="/img/refactoring-essentials/formatting-problem.png" title="Formatting problem in generated code"/>
  <figcaption class="figure-caption">Unwanted changes introduced in generated code.</figcaption>
</figure>
{:/}

Some of this behaviour is governed by Visual Studio Code formatting settings, which you can change
under _Tools &#8594; Options &#8594; Text Editor &#8594; C# &#8594; Formatting_. Some behaviour
can’t be changed at the moment -- curly braces will always have surrounding spaces after refactoring.

## What’s missing
There are some refactorings that I do use quite often, and I was surprised to find they are not
included in Refactoring Essentials.

### Add missing usages
Sometimes you need to move big chunks of code from one class to another. Doing this via cut and
paste can introduce a lot of missing references. Unfortunately, Refactoring Essentials doesn’t catch
this situation, and you need to fix missing references one by one. ReSharper, on the other hand,
will suggest including usages for copy-pasted code that you moved from another file.

### Move fields
This scenario is similar to simple cut-and-paste: when moving fields/methods from one class to
another, ReSharper offers you to "Apply move refactoring", which updates all references to relocated
members. I could not find anything similar to this in Refactoring Essentials.

### Introduce parameter
“Introduce parameter” refactoring is used quite often. It promotes a variable or a constant to
function's parameter, updating all of the invocations with the previously used value. Sadly,
there’s no in-built feature in Refactoring Essentials to do this. Our paid-for friend Resharper, on
the other hand, provides this functionality.

### Move method
When you extract a certain piece of functionality into a standalone function, sometimes you realise
that other classes could benefit from calling this function also. This is especially the case when
you create ‘utility’, or ‘helper’ functions, that do a generic type of work -- things like data
validation, string formatting, retrieving app’s settings etc.

In this instance, you may want to move a newly generated method to a more appropriate class, so it
could be made available to other callers without introducing an extra dependency between logically
unrelated classes.

I personally do this reasonably often, that’s why it was quite surprising to find that Refactoring
Essentials has no support for this use case. Again, you can do this in Resharper, no drama.

### Other
These types of refactorings are not something that you may want to do frequently, but they
are still quite handy. Again, no love from Refactoring Essentials. Missing also:

- Extract superclass
- Pull method up / push method down in class hierarchy
- Inline method (although it has got “inline temporary variable”)

## Conclusion
It seems that Refactoring Essentials developers decided to supplement already existing refactoring
functions of Visual Studio instead of implementing better versions of existing refactorings. I would
say that VS built-in refactorings, such as Extract Method / Add Missing References are rather basic
and could have benefited from the extension. Also, all these new refactorings operate at the very
local level, and there's nothing that would assist you in doing big moving and shaking, such as
changing solution class hierarchy -- extracting superclasses and moving members around.

While Refactoring Essentials seems to have quite a few gaps, I still think it’s better having it
installed than having nothing. It will jump in here and there and offer to make improvements to your 
code, although don't expect anything ground-breaking.

What's your favourite refactoring extension and why? Please share the knowledge and leave a comment
below!

## Never miss a new article {#ctaTitle}

{::options parse_block_html="true" /}
<div id="ctaCopy">
I hope this review helped you to get a better understanding of what Refactoring Essentials strengths
and weaknesess are.

If you want to receive helpful reviews, guides and articles as I publish them, subscribe to my mailing
list below. I only write actionable advice that is based on real-world problems, saves people time 
and brings the joy of creation. I never spam, period.
</div>

{::options parse_block_html="false" /}
{% include subscription.html %}

[1]:https://github.com/icsharpcode/RefactoringEssentials
