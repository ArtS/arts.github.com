---
layout: post
title: How to quickly run some C# without a project
categories:
- programming
tags:
-
excerpt_separator: <!--more-->
type: post
---

Do you ever wish you could just quickly run some C# code, without all the heavy lifting, like
creating a new project, setting it up etc? Or worse yet, starting to experiment with some temporary
code by modifying an existing solution, and then forgetting to remove your code, and lo and behold,
next thing you know it's deployed to production?!

Wouldn't it be nice to be able to play around with any C# code, as if from a command line, but with
all the goodies like highlighting and code completion? How awesome it'd be to see all the properties
on the objects you're working with and their actual values, without having to rely on some
vague description from MSDN? Think of this as iPython or JavaScript console, but for C#.

That would let you try different ways to solve problems, running code straight away, line by line,
without having to restart your project and step into whichever function you'd be modifying instead.

<!--more-->

## C# Interactive

If you're on Windows, this is your lucky day (if you're on macOS or Linux -- don't despair, read on,
there's a solution for you too). Both paid-for Visual Studio and free [Visual Studio Community
Edition][2] have an awesome feature - __C# Interactive__.

To open C# Interactive panel, go to _"View" -> "Other Windows" -> "C# Interactive"._

![C# Interactive screenshot][3]

If you need to load additional assemblies (3rd party SDKs / libraries), you can use `#r` command
and provide a full path to the assembly:

![C# interactive load assembly][4]

Also, run `#help` to see useful keyboard shortcuts that save you time when re-running and editing commands.

## .NET Fiddle

I have previously mentioned [.NET Fiddle][5] in the article on [tools for .NET and Web
development][6].  It's an awesome online REPL for C# (as well as F# and VB.NET). It's the only
online REPL that supports latest (at the time of writing) [C# 8.0 features][1]

![.NET Fiddle - online C# REPL][7]

Similar to __C# Interactive__ in VS, it has syntax highlighting, code completion and loading of
libraries -- although the choice of is somewhat constrained to a pre-defined list.

## dotnet-script

If you are on macOS or Linux, but still want to use a local C# REPL, you can try [`dotnet-script`][8].
Although it doesn't have all the standard features such as autocompletion and code highlighting, it
does the job just fine.

Also, you can use it as a script execution engine for your C# code -- imagine writing your shell
scripts in C# instead of bash/zsh/PowerShell!

It supports loading of NuGet packages in much better way than C# Intractive. Refer to the 
documentation for `#r` and `#load` [commands][9]:

{% highlight shell %}
❯ dotnet script
> #r "nuget: AutoMapper, 6.1.0"
> using AutoMapper;
> typeof(MapperConfiguration)
[AutoMapper.MapperConfiguration]
{% endhighlight %}

## Conclusion
Hopefully, this article helps you iterate faster and better when experimenting with C#, and cut down
the time spent endlessly restarting your debugging sessions just when you need to change one line of
code to try out something new.

Liked this article? Join my mailing list to get helpful advice, tips & reviews of dev tools for .NET
development.

{% include subscription.html %}

[1]:https://docs.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-8
[2]:https://visualstudio.microsoft.com/downloads/
[3]:/img/c-sharp-interactive-screenshot.png
[4]:/img/c-sharp-interactive-load-assembly.png
[5]:https://dotnetfiddle.net/
[6]:{% post_url 2020-08-10-online-tools-for-dotnet-core-and-web-development %}
[7]:/img/dotnetfiddle.png
[8]:https://github.com/filipw/dotnet-script
[9]:https://github.com/filipw/dotnet-script#inline-nuget-packages
