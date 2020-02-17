---
layout: post
title: Where should you put "try ... catch" statements in your C# code
categories:
- programming
tags:
-
excerpt_separator: <!--more-->
type: post
---
Exceptions can happen anywhere. Some are thrown by your code, deliberately. Others are thrown by
.NET or 3rd party libraries. You know where some exceptions may get thrown, and there are heaps more
you didn't even know existed.

Most likely you already know how `try ... catch ... finally` block works (check out this [MS
doco][1] if you want to brush up on that), and while you understand it all at the high level, you
may still be wondering whether you should:

- catch exceptions immediately when calling a function?
- or maybe catch them somewhere in between, after business logic/data access and before UI logic?
- or should you let exceptions bubble up to the very top of your application?
- should you let them crash your app or catch and just ignore them?
- maybe there's a way to recover from exceptions, but how can you do it?

To make an informed judgment, you need to understand the main types of exceptions. This
understanding will help you decide when to catch and how to handle individual kind of
exception in a given situation.

<!--more-->

_Are you having issues with `NullReferenceException`? Check out this article to get more specific
help: ["How to avoid and fix NullReferenceExceptions in ASP.NET MVC"][5]_

## Different types of exceptions
From the perspective of what you can do with them, all exceptions can be divided into three large
groups:

- Exceptions you can safely ignore
- Exceptions you can recover from
- Exceptions you can do nothing about

### Exceptions you can safely ignore
Believe it or not, but there are exceptions you can just ignore. Depending on the main of your
application, you may decide to completely drop exceptions thrown by non-essential services, such as:

#### Application metrics
Services such as DataDog, Graphana, New Relic etc can receive data from your app to track CPU/RAM
utilisation, performance metrics, latencies etc. Most of the time, it is safe to simply catch &
ignore exceptions when calling those types of services.

#### Logging (Log4Net, CloudWatch etc)
If a call to log information/warning/error/failure messages throws exceptions, you may still
decide that your app should nevertheless continue running and serving users' requests.

However, there might be a significant downside to it -- should your app actually encounter a fatal
exception, there'll be no trace of that anywhere in the logs.

There's no one-size-fits-all answer, and you should make a call based on the type of your application
and how critical it is to you to have logs. If you really must have them, all the time -- then your
app should definitely fail when it's unable to log, and display a prominent error message/render
a comprehensive error page.

#### No-operation exception
Say you tried deleting a file, but that file is no longer there, and you get
`DirectoryNotFoundException`. As long as your app doesn't need to do anything about it, you can just
ignore that exception.

You can, however, optimise your logic to check whether a file is still there before trying to delete
it. Exceptions are expensive -- the runtime spends quite a few CPU cycles to gather all the stack
trace info and such when an exception is thrown. So if performance is important, try to avoid
throwing, catching and ignoring no-op exceptions.

#### Ignoring exceptions: Caveats
Whether you can ignore an exception largely depends on what's important for your app -- for
instance, if logging or app metrics are a must, you may want your app to fail outright so that user
could be notified of a problem.

#### When to catch 'safe-to-ignore' exceptions
You want to catch these exceptions as close to the point of invocation as possible so that no extra
logic that your application is supposed to execute gets skipped.

Let's look at a made-up problem. Imagine there are several 'agent' processes, that are running in
parallel, and as part of their work, they may need to delete a certain file. Conflicts may happen and
some agents may try to delete the same file, leading to the `FileNotFound` exception being thrown.

In this instance, we want to catch that particular exception as soon as possible & just ignore it:

{% highlight csharp %}
private void DeleteTempFile(string filePath) {
    try {
      File.IO.DeleteFile(filePath);
    } catch (FileNotFoundException) {
      // Catch just FileNotFoundException, not any Exception
      // 
      // Nothing to do here, move along!
    }
}
{% endhighlight %}

<div class="alert alert-warning" role="alert">
<strong>Warning!</strong> 
<p>In a very few cases, you'd want to specify <code class="highlighter-rouge">Exception</code> as the
generic exception type, so that every exception is ignored in this situation. By doing that you'll
ignore <strong>ALL</strong> exceptions, even the ones that you'd rather stop your app & let you know
something is wrong – like <code class="highlighter-rouge">OutOfMemoryException</code>, or exceptions related to authorisation or
authentication.</p>
<p>Swallowing all exceptions is troublesome and can lead to hard-to-debug situations, where your app
crashes in some weird place with no clear indication of what's gone wrong.</p>
</div>


### Exceptions you can recover from

#### Re-tries

In the brave new world of distributed services/microservice architecture, you can't just assume
that every network call to a service will succeed. There will be timeouts, disconnects, servers
throttling the allocated capacity, DevOps people changing network setting and all sorts of crazy
stuff. All of that can make your HTTP calls fail.

To address that, you can add retry logic when calling a service. Throw in a couple more smarts such
as linear of exponential backing off (which is really a fancy way of saying "ok, you're busy, I'll
come back after a fixed time/waiting for longer than before) and you've got yourself a [retry
policy][2]!

_Btw check out my other article [How to call a JSON API and display the result in ASP.NET Core MVC][2] 
for an example on how to implement a retry policy in ASP.NET Core._

#### Safe default values
When your logic to retrieve some data fails, you might be able to assume some safe to use value
instead of failing.

You need to consider what's worse in your individual situation: say, losing a customer because your
app can't retrieve a price for something, or assuming a sensible default price and carrying on with
the checkout. You may want to talk to your business people - Product Managers or Business Analysts
to decide what's the acceptable level of risk and tradeoffs in an individual situation.

Things you can assume default values for:

- Database connection strings
- Minimum/maximum values for stuff
- User's UI language/Timezone/currency etc
- Prices for things
- Discounts
- Durations for various time spans

### Exceptions you can do nothing about (yet!)

These are the hardest to deal with. Generally, you should catch these exceptions and log all
information in them, including call stack and error message. Also consider logging any context
around them, such as user/object ids etc. This will help you troubleshoot these problems and fix the
root cause - missing or incorrect data, configuration/connectivity issues, memory/performance
issues, authentication/authorisation issues etc.

Ideally, there should be no exceptions. Practically, you will be able to eliminate some of the
recurring ones by analysing your exception logs and coming up with a solution for that particular
exception and leave some of the remaining ones as inevitable noise.

So, catch **ALL** types of exceptions at the highest level in your application. In the case of
ASP.NET Core, you can add a custom [Exception Handler Middleware][3] which will catch errors
occurring in your controllers.

Mind you that Exception Handling Middleware won't catch any exceptions occurring during ASP.NET Core app
startup, so for that you want to enable [capture of startup errors][4].

For console apps, wrapping all calls in you `static void Main()` with `try`..`catch` should suffice:

{% highlight csharp %}
    class Program
    {
        static void Main(string[] args)
        {
            try {
              //
              // Do all risky stuff here
              //
            } catch (Exception ex) {
              // It's totally fine to catch ALL exceptions at the app level
              Console.WriteLine("OMG NOES EXCEPTIONZ");
              Console.WriteLine(ex.ToString());
            }
        }
    }
{% endhighlight %}


## Conclusion

In this article, you have just learnt

- when you can safely ignore exceptions
- what to do to recover from some exceptions
- how to handle unknown/new exceptions

Let me know if you have any questions -- just use the comments form below or send me an email! I
reply to all emails I receive.

## But Wait, There's More! {#ctaTitle}

{::options parse_block_html="true" /}
<div id="ctaCopy">
I hope this article helped you to take a step back and learn to identify various types of exceptions
and how to deal with them.

Don't miss my next post - subscribe to the mailing list to get handy tips and solutions for ASP.NET
NVC Core. I never spam, and you can unsubscribe at any time.
</div>

{::options parse_block_html="false" /}
{% include subscription.html %}

[1]:https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/try-catch
[2]:{% post_url 2019-10-15-how-to-call-json-api-and-display-result-in-asp-net-core-mvc %}
[3]:https://docs.microsoft.com/en-us/aspnet/core/fundamentals/error-handling?view=aspnetcore-3.1#exception-handler-lambda
[4]:https://docs.microsoft.com/en-us/aspnet/core/fundamentals/error-handling?view=aspnetcore-3.1#startup-exception-handling
[5]:{% post_url 2015-07-30-how-to-avoid-and-fix-nullreferenceexceptions-in-asp-net-mvc %}
