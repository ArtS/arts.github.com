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
###Why bother with Profiler?

Sometimes, when errors or exceptions happen you can't just attach a debugger to your web app - for
example, errors may happen only in production, and you can only sit and watch the error logs fly past,
or sometimes there's even no meaningful logs available. Maybe you need to debug a closed system - proprietary
component/nuget package that fails. Maybe it's a combination of several factors - licenses, data,
environment settings, external processes - all that makes local error replication really hard or 
impossible.

But if you know from the logs or other sources that error occurs when database is accessed, you can
find out which queries fail and why. Firstly, you need to attach SQL Profiler to an instance of SQL
Server. Run SQL Profiler, from "File" menu select "New trace...", then enter your server address and
connection credentials, click "Connect".

"Trace properties" window will appear, where on "General" tab, under "Use the template" select
"Blank"

![Trace window][1]

Then on "Event Selection" tab click "Column filters" and enter your database name under "Like"
filter. You can skip this step if you have just one database, otherwise you're risking being flooded
with too many tracing messages.

![Edit filter][2]

Then again on "Event Selection" tab, in the event grid, select following events:

- Exception under Errors and Warnings
- RPC: Completed under Stored Procedures
- RPC: Starting under Stored Procedures
- SQL: BatchCompleted under TSQL
- SQL: BatchStarting under TSQL

![Errors and warnings][3]

![Stored procedures][4]

![TSQL][5]

And then click "Run". You should get a stream of events that looks something like the screen below.
Do not freak out if there's too many events and they run screaming at you, which happens if you have
a big systems with lots of users. What you really interested in is lines that have "Exception" in
the "EventClass" column, like this:

![Events trace][6]

And that exception is caused by the command just above, one with the title `RPC: Starting`:

![Real cause, bitch!][7]

So in this instance we can clearly tell that certain table is missing it's ID column, which
could be a result of missing database update.

[1]:/img/profiler/trace-properties.png
[2]:/img/profiler/edit-filter.png
[3]:/img/profiler/errors-and-warnings.png
[4]:/img/profiler/stored-procedures.png
[5]:/img/profiler/tsql.png
[6]:/img/profiler/trace.png
[7]:/img/profiler/error.png
