---
layout: post
title: Which is better for learning C# - .NET or .NET Core?
categories:
- programming
tags:
- jekyll3
status: publish
type: post
published: true
---
We are naturally drawn towards new stuff - new means better, right? Surely you heard of .NET Core,
unless you’ve been living under the rock for the last couple of years. New is hard to resist,
especially when it’s backed by Microsoft’s huge PR/propaganda machine. Don’t get me wrong, I am not
blaming Microsoft - they’ve got to make sure they attract and retain enough people onto the new
platform, but this is exactly the moment you want to stop and ask yourself - what’s better for me,
given my task, needs, and constraints?

Also, check out my [free PDF guide][1] to technology choice - should you stick with .NET or pick
.NET Core for your new project?

## Starting to learn C\#
When learning a new language is your utmost priority, you want to immerse yourself into its structure,
do coding exercises, start working on your own small projects. There will be plenty of challenges
and you want to make sure nothing extraneous gets in your way. You want your tools to help you, not drag you
down.

## Enter .NET Core - release version 1.0, or is it?
The current version of .NET Core is 1.0, but that's only part of the story. You also may want to ask
what's the current version of tooling, meaning build/package management tools and such. And the
truth is - it's still in the Preview 2 version ([check out the latest release in here][3])

<a href="https://github.com/dotnet/cli/releases">
<img src="/img/dotnetcore/release.png" class="img-fluid" alt=".Net Core Tooling Preview 2">
</a>

Again, it's understandable Microsoft wants to get the product out of the door as soon as possible,
but if for you, who's just starting to learn C\#, it means added risk of having to deal with flaky
tools, plus potentially having to spend extra time relearning commands/conventions when things
inevitably change in release version, you may as well ask yourself if it's really worth it.

## Conclusion
So if you are not sure what to do and whether you should start learning C\# on .NET Core or
"classic" .NET, I would recommend sticking with tried and proven "classic" .NET. There's no
difference in the language itself (C# 6.0 is available on both platforms and new releases of the
language will be made available both on .NET and .NET Core), plus with "classic" .NET you eliminate
all the potential flakiness that can be present in .NET Core toolchain.

But "Future!" I hear you saying, "And Progress!" - yes, .NET Core is the future, and you may want to
keep some tabs on its progress - already mentioned [Toolset releases][3] page, as well as the [.NET
Core roadmap][4] page on Github, specifically that part around planned ship dates.

## Never miss a new article {#ctaTitle}

{::options parse_block_html="true" /}
<div id="ctaCopy">
I hope this post helped you to decide what to choose for learning C\#.

If you want to receive helpful guides and articles as I publish them, subscribe to my mailing
list below. I only write actionable advice that is based on real-world problems, saves people time 
and brings the joy of creation. I never spam, period.
</div>

{::options parse_block_html="false" /}
{% include subscription.html %}

[1]:/dot-net-core-or-dot-net-framework-which-one-is-right-for-you/
[2]:/img/dotnetcore/release.png
[3]:https://github.com/dotnet/cli/releases
[4]:https://github.com/dotnet/core/blob/master/roadmap.md#ship-dates
