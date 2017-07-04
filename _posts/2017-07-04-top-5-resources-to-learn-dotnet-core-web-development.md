---
layout: post
title: Top 5 resources to learn .NET Core web development
categories:
- programming
tags:
-
status: publish
type: post
published: true
---
When it comes to something as new and quickly changing as .NET Core, and all the other tech that
runs on top of it, such as ASP.NET Core and Entity Framework Core, it can be quite daunting trying
to keep up with all the changes that Microsoft keeps introducing after finding a seemingly sane and
workable solution. 

{::options parse_block_html="true" /}

<small>
_Luckily, .NET Core 1.1 has been released some time ago, and now we’re into [1.1.2 version][1]. If
you’re using any previous versions of 1.1, consider upgrading, since the latest version contains the
fix for a [security issue][3] found earlier._
</small>

{::options parse_block_html="false" /}

So things are looking relatively stable for 1.x version of .NET Core, and while quite a bit of
turbulence swirls around upcoming .NET Core 2, this shouldn’t stop us from getting up to speed with
the current release. With this in mind, I would like to list some of the top resources that should
help you learn .NET Core as well ASP.NET Core.

## [Microsoft Virtual Academy][4]
Microsoft Virtual Academy or MVA is a good resource, though watch out for outdated supplementary
text still referring to .NET Core 1.0, as well as be ready to encounter invalid references to field
names/class names/command line options that got renamed. Otherwise, it’s a great starting point if
you just entering ASP.NET Core development and prefer a detailed, step-by-step guided tour.

Some of the courses to look at:

- [Introduction to ASP.NET Core with Visual Studio 2017][5]
- [Intermediate ASP.NET Core 1.0][6] (I know, I know, 1.0, though most of the stuff should be still relevant for 1.1 version)
- [ASP.NET Core 1.0 Cross-Platform][7] -- pay this guy a visit if you’re on Mac or on Linux

Again, in case you run into outdated instructions or code in the videos, make sure to check out
course-related Github repositories, those are more likely to contain more up-to-date versions of the
example source codes.

## [ASP.NET Core Documentation][8]
This is the more up-to-date cousin of Microsoft Virtual Academy from above, and most of the content
is just good old text, which is easier to read at your own pace, but it also contains fewer errors
and outdated references due the to ease of maintenance and community participation.

Don’t be afraid and have a browse, it’s definitely more friendly than your regular MSDN
documentation, as it contains [plenty of tutorials](https://docs.microsoft.com/en-us/aspnet/core/tutorials/),
as well as an overview of
[architecture fundamentals](ttps://docs.microsoft.com/en-us/aspnet/core/fundamentals/). There’s a
dedicated section for [ASP.NET Core MVC](ttps://docs.microsoft.com/en-us/aspnet/core/mvc/overview)
that covers the building of websites and APIs.

For offline access, you can download a [hefty PDF](https://opbuildstorageprod.blob.core.windows.net/output-pdf-files/en-us/MSDN.aspnet-core-conceptual/live.pdf)
(over 1k+ pages).

## FREE (yes, free) limited 12 months Pluralsight Subscription
Pluralsight is a paid service with quite a few online courses on various topics, including .NET Core
development. You can get a free (albeit limited) access to Pluralsight courses for 12 months if you
[sign up for Microsoft Visual Studio Dev Essentials][9] program. After signing up, get your free
Pluralsight subscription by clicking on “Get Code” under “Pluralsight” card in “Education” section:

![Pluralsight access code](/img/misc/pluralsight.png)

Following Pluralsight courses on .NET Core are available:

- [ASP.NET Core Fundamentals](https://www.pluralsight.com/courses/aspdotnet-core-fundamentals)
- [ASP.NET Core Razor Deep Dive](https://www.pluralsight.com/courses/asp-dot-net-core-razor-deep-dive)
- [Entity Framework Core: Getting Started](https://www.pluralsight.com/courses/entity-framework-core-getting-started)
- [Building Your First API with ASP.NET Core](https://www.pluralsight.com/courses/asp-dotnet-core-api-building-first)
- [Building Your First ASP.NET Core Web Application](https://www.pluralsight.com/courses/aspdotnetcore-web-application-building)
- [Implementing and Securing an API with ASP.NET Core](https://www.pluralsight.com/courses/aspdotnetcore-implementing-securing-api)
- [Getting Started with .NET Core for Windows Developers](https://www.pluralsight.com/courses/dotnet-core-windows-developers-getting-started)
- [Building a Web App with ASP.NET Core, MVC 6, EF Core, and Angular](https://www.pluralsight.com/courses/aspdotnetcore-efcore-bootstrap-angular-web-app)

I think it’s a great option, and the only reason I am not listing it as the first one in this
article is that I am not sure for how long this is going to be available, so jump on the bandwagon
and get yourself some free courses while you can.

## [Stackoverflow Documentation](https://stackoverflow.com/documentation?tab=name)
Stackoverflow Documentation project was created with a noble goal in mind -- to create an up-to-date
repository of various examples, how-tos and “getting started" guides.

To date, its [ASP.NET Core](https://stackoverflow.com/documentation/asp.net-core/topics) section
has 25 articles, followed by [.NET Core](https://stackoverflow.com/documentation/.net-core/topics) 
(9 articles) and [ASP.NET Core MVC](https://stackoverflow.com/documentation/asp.net-core-mvc/topics) 
(3 articles).

The best thing about the whole project is that you can contribute by writing articles, adding new
chapters and fixing bugs in the code examples. This project is most likely to contain up-to-date
examples.

## [.NET Core Guide](https://docs.microsoft.com/en-us/dotnet/core/)
This is an assorted collection of installation manuals, various tutorials, deployment and migration
guides. It’s quite loosely connected, so don’t expect a lot of structure and guidance from this
source, it may leave some gaps in your understanding of .NET Core.

You can download all of the .NET Core Guide content as [one single PDF](https://opbuildstorageprod.blob.core.windows.net/output-pdf-files/en-us/VS.core-docs/live/docs.pdf)
(of over 2k+ pages at that, so be warned!).

## Never miss a new article {#ctaTitle}

{::options parse_block_html="true" /}
<div id="ctaCopy">
I hope this post helped you to pick some useful resources, please share your discoveries in the
comments -- I'd love to add your favorite site to the list!

Also, if you want to receive helpful guides and articles as I publish them, subscribe to my mailing
list below. I only write actionable advice that is based on real-world problems, saves people time 
and brings the joy of creation. I never spam, period.
</div>

{::options parse_block_html="false" /}
{% include subscription.html %}


[1]:https://github.com/dotnet/coreclr/releases/tag/v1.1.2
[2]:https://github.com/dotnet/cli/releases/tag/v1.0.4
[3]:https://github.com/dotnet/announcements/issues/12
[4]:https://mva.microsoft.com/search/SearchResults.aspx#!q=ASP.NET%20Core&topic=Web%20Development&lang=1033
[5]:https://mva.microsoft.com/en-US/training-courses/introduction-to-aspnet-core-with-visual-studio-2017-16841
[6]:https://mva.microsoft.com/en-US/training-courses/intermediate-aspnet-core-10-16964
[7]:https://mva.microsoft.com/en-US/training-courses/aspnet-core-10-crossplatform-17039
[8]:https://docs.microsoft.com/en-us/aspnet/index#pivot=core
[9]:https://www.visualstudio.com/dev-essentials/
