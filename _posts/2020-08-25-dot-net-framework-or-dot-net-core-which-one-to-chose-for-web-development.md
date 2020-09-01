---
layout: post
title: .NET Framework or .NET Core &ndash; which one should you learn for web development?
categories:
- programming
tags:
-
excerpt_separator: <!--more-->
type: post
---
Whether you're just starting to look into web development after learning some C#, or whether you're a
seasoned Windows developer making forays into web dev, it's very common to stumble into this massive
confusion: it seems like Microsoft deliberately tried to complicate things by creating heaps of
technologies and acronyms for them. Let's have a look, just off the top of my head, we have got the
following tech available to us:

<!--more-->

- .NET Framework (and quite a few versions of it!)
- ASP.NET
- ASP.NET MVC
- ASP.NET Web Services
- .NET Core
- ASP.NET Core
- ASP.NET MVC

What are the differences between them? Which one is best to pick for learning web dev is today's
world? Which one will be most needed in the job market for the years to come?

Let's dive right into it. Starting with a short history lesson.

## In the beginning
The first version of .NET Framework was released in 2002, and since then we've got to version 4.8
released in April 2019. In 2016 Microsoft released the first version of .NET Core, which was not
nearly as full-featured, but had a massive advantage over its predecessor -- it was truly
cross-platform.

![Timeline of .NET][2]

_Each major release of .NET Core brought a lot of breaking changes, that's why you want to be
careful when looking for answers to your questions or tutorials -- make sure you looking at the
right version of the framework._

## Differences
.NET Framework can only run on Windows, and while there is a third-party implementation called Mono,
it didn't seem to win peoples (and more importantly, businesses') hearts as much as .NET Core did.
However, being the longest-lived player on the market, .NET Framework amassed a huge following, lots
of libraries, books, courses and tutorials.

.NET Core is truly cross-platform and runs on Windows, Linux and Mac OS. That comes with certain
drawbacks -- there was a handful of very popular .NET Framework libraries that were not ported to
.NET Core immediately, although over time the ecosystem has mostly caught up, whether with
Microsoft releasing new versions of popular libraries (Entity Framework, SignalR), or the
open-source movement implementing the missing pieces (WCF). Some libraries still haven't been
ported and probably not ever going to be -- such as WebForms.

_By the way, if you're looking to use WinForms with .NET Core, seems like it's your lucky day!
Microsoft recently released [Windows Forms Designer for .NET Core][10]_

As far as the documentation is concerned -- Microsoft has done a fantastic job at documenting .NET
Core, so it's heaps better than your general useless MSDN madness. There's also tons of tutorial,
free and paid online courses, blog post available for .NET Core.  Also, most of the .NET Framework
developers migrated to .NET Core, so you'll find ample online presence in discussion forums such as
[/r/dotnet][3] and [forums.asp.net][4].

While you can use same programming languages (C#, F#, VB.NET (_limited support_)) with both .NET
Framework and .NET Core, the way projects are structured, system & SDK library names and APIs are
quite different, so there's definitely going to some learning curve whichever way you go. If you
start with .NET Core there's always a chance you'll get asked to look into a legacy .NET Framework
web app at work, but don't be afraid -- while they are different in a lot of ways, you'll still have
a bit of a head start when it comes to C#, CLR and .NET as a platform.

_One of my awesome readers pointed out that complete VB.Net support is lacking in the current .NET
Core (3.1). Seems like you can only target Console apps and Class Libraries if you're using VB. Full
support is planned for .NET 5. See this blog post for more details: [Visual Basic support planned
for .NET 5.0][9]_

## Future
Microsoft stopped actively developing __.NET Framework__, and will only be releasing maintenance and
security updates. So essentially it's a dead-end, progress-wise. Having said that, companies
that have apps running on the .NET Framework will be supported for quite some time, effectively for
as long as the underlying platform (Windows) is supported.

__.NET Core__, on the other hand, is being actively developed, with grand plans of releasing a new
version by the end of 2020 (and then yearly afterwards). Doing the usual Microsoft thing, they are
going to rename it yet again and call it __.NET 5__. I guess they're trying to bring it back in line
and unify the naming, but boy do I feel sorry for all the new devs that come to the ecosystem and
need to decide WFT they are supposed to be using.

## Choice is obvious
As far as the modern Web Development are is concerned, without any doubt .NET Core should be your
choice over .NET Framework. The main question is which part of the framework you should start
learning depends on the sort of web app you're planning to build.

### Microservices and SPAs
If you're planning to build new microservices or Single-Page Applications (with front-end frameworks
like ReactJS), you should start with __ASP.NET Core__. Check out this article ["Create web APIs with
ASP.NET Core"][5] to get started.

### "Traditional" web apps
If you're planning to build a more traditional web app, where there's not a whole lot of client-side
Javascript logic required, i.e. you're not planning to use ReactJS/Angular/Vue and just want your
app to render some pages, let users submit information and display something back, you have several
options:

- __Razor Pages__ -- a good choice for simple, small projects that require mostly static pages &
  basic data entry
  - Check out "[Introduction to Razor Pages in ASP.NET Core][6]" to get started with Razor Pages
- __ASP.NET Core MVC__ -- gives your code more structure, making separation of logic from
  presentation mandatory. Default choice when most people think of web dev with C#
  - Check out "[Overview of ASP.NET Core MVC][7]" to get started with MVC
- __Blazor__ -- Build interactive web apps with C# without any Javascript. A relatively new technology
  that seems to be very popular with a lot of devs these days, although has a shortcoming of
  significant data transfer requirements. Might be OK for apps that run on a fast internal network,
  but may underperform over the internet connection.
  - Check out "[Introduction to ASP.NET Core Blazor][8]" to get started with Blazor

## Job market
While there's still a lot of web apps running on .NET Framework that supporting real business needs
and bringing home bacon so to speak, .NET Core is definitely the way where the job market is
moving. Sure, there will be plenty of jobs that list .NET Framework as a requirement, but most
likely that'd be for the maintenance of existing apps, not writing new ones.

When interviewing for a dev role that involves .NET Framework, there's a couple of things to watch
out for. Ask your prospective employer these questions:

- anticipated percentage of work on .NET Framework codebases
- what is their migration plan for .NET Framework apps, if any. If it's '_we'll do it someday_` and
  it's one of the main line-of-business apps, reconsider your decision to join, as you might be
  stuck with an old app that company is not willing to invest into
- do they have up-to-date licenses for latest Visual Studio (2019 at the time of writing this post),
  as they might be stuck in the past with VS2015 or older. In this instance -- RUИ! (Kidding, they
  might be using VS Community Edition, check for that too).
- what's their approach/policy to staying up to date with minor and major .NET Core updates -- do
  their devs get time to do it, or is it an afterthought? Ask them what's the current version(s) of
  .NET Core they are running.


## Conclusion
Hopefully, this article helped to answer your questions and pick the right technology to learn web
development. If you have any questions - just leave your comment below and I'll do my best to answer
it.

_Interested in learning more about web dev with .NET Core? Check out this blog post on [best
resources to learn web development with .NET Core][1]_

{::options parse_block_html="true" /}
<div id="ctaCopy">
Also, join my mailing list to get helpful advice, tips & tricks on .NET development.
</div>

{::options parse_block_html="false" /}
{% include subscription.html %}

[1]:{% post_url 2017-07-04-top-5-resources-to-learn-dotnet-core-web-development %}
[2]:/img/dotnet-history.png
[3]:https://forums.asp.net/
[4]:https://forums.asp.net/
[5]:https://docs.microsoft.com/en-us/aspnet/core/web-api/?view=aspnetcore-3.1
[6]:https://docs.microsoft.com/en-us/aspnet/core/razor-pages/?view=aspnetcore-3.1&tabs=visual-studio
[7]:https://docs.microsoft.com/en-us/aspnet/core/mvc/overview?view=aspnetcore-3.1
[8]:https://docs.microsoft.com/en-us/aspnet/core/blazor/?view=aspnetcore-3.1
[9]:https://devblogs.microsoft.com/vbteam/visual-basic-support-planned-for-net-5-0/
[10]:https://devblogs.microsoft.com/dotnet/windows-forms-designer-for-net-core-released/
