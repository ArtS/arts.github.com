---
layout: post
title: How to trace SQL Server database errors and exceptions with SQL Profiler
categories:
- programming
tags:
- sql server
status: publish
type: post
published: true
---
Sometimes, when errors or exceptions happen you can't just attach a debugger to your web app - for
example, errors may happen only in production, and you can only sit and watch the error logs fly
past, or sometimes there are even no meaningful logs available. Maybe you need to debug a closed
system - proprietary component/NuGet package that fails. Maybe it's a combination of several factors
- licenses, data, environment settings, external processes - all that makes local error replication
really hard or impossible.

## How to catch the bastard
But if you know from the logs or other sources that error occurs when a database is accessed, you can
find out which queries fail and why. Firstly, you need to attach SQL Profiler to an instance of SQL
Server. Run SQL Profiler, from "File" menu select "New trace...", then enter your server address and
connection credentials, click "Connect".

"Trace properties" window will appear, where on "General" tab, under "Use the template" select
"Blank"

<img src="/img/profiler/trace-properties.png" class="img-fluid" alt="Trace window">

Then on "Event Selection" tab click "Column filters" and enter your database name under "Like"
filter. You can skip this step if you have just one database, otherwise, you're risking being flooded
with too many tracing messages.

<img src="/img/profiler/edit-filter.png" class="img-fluid" alt="Edit filter">

Then again on "Event Selection" tab, in the event grid, select following events:

- Exception under Errors and Warnings
- RPC: Completed under Stored Procedures
- RPC: Starting under Stored Procedures
- SQL: BatchCompleted under TSQL
- SQL: BatchStarting under TSQL

<img src="/img/profiler/errors-and-warnings.png" class="img-fluid" alt="Errors and warnings">

<img src="/img/profiler/stored-procedures.png" class="img-fluid" alt="Stored procedures">

<img src="/img/profiler/tsql.png" class="img-fluid" alt="TSQL">

And then click "Run". You should get a stream of events that looks something like the screen below.
Do not freak out if there are too many events and they run screaming at you, which happens if you have
a big system with lots of users. What you're really interested in is lines that have "Exception" in
the "EventClass" column, like this:

<img src="/img/profiler/trace.png" class="img-fluid" alt="Events trace">

And that exception is caused by the command just above, one with the title `RPC: Starting`:

<img src="/img/profiler/error.png" class="img-fluid" alt="Real cause, bitch!">

So in this instance we can clearly tell that certain table is missing its `ID` column, which
could be a result of missing/incomplete database schema update.

{% comment %}
{% include experiment.html %}
{% endcomment %}

## WANT MORE? SUBSCRIBE HERE {#ctaTitle}

{::options parse_block_html="true" /}
<div id="ctaCopy">
I hate wasting my time on stupid bugs, environment problems and trying to make sense of obscure 
documentation - that's why whenever I find a faster way of doing something I share that with you.

So if you don't want to miss my next article, sign up to the mailing list below. There'll be lots
more time-saving and frustration-avoiding advice there, so sign right up. I never spam, period.
</div>

{% comment %}
{% include alt-cta.html %}
{% endcomment %}

{::options parse_block_html="false" /}
{% include subscription.html %}
