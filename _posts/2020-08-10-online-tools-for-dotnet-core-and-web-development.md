---
layout: post
title: Online tools for .Net Core and Web development
categories:
- programming
tags:
-
excerpt_separator: <!--more-->
type: post
---
When you work for long enough on a given project, you kind of get comfortable with the tools and
things eventually start to feel familiar. So it's only natural to start feeling like you're missing
out and there might be newer and greater things out there, some exciting new languages, tools or
techniques.

In this article, I'd like to show you some online tools that I found super helpful in my development
work.

<!--more-->

## Develop & iterate faster

Remember the feeling when you need to set up a whole new project in VS just so you can play around
with a new idea or test a new C# feature? Or even worse, write some temporary code in the an
solution you're developing and then forgetting to remove it, committing & deploying to prod?
Dreadful, I know.

What if there was a tool that let you quickly write & run some C# code without too much fuss?

### .NET Fiddle
[.NET Fiddle][1] lets you run C# code in your browser. It has syntax and error highlighting,
autocompletion and it runs latest C#, so you get access to all latest language features. To get
that working, make sure to select ".NET Core" in the `Compiler` dropdown.

[![dotnetfiddle.net interfaces screenshot][2]][1]

You can also import packages such as `JSON.NET`, `EntityFramework`, `Linq` and many others, see the
full list [here][3].

There ars quite a few features there:

- sharing your code with others,
- auto-formatting
- converting VB to C# (and other way around)
- collaborate on the same code with several people remotely, although I couldn't get this feature to
  work

There's also a couple of other online C# execution environments, like [csharppad.com][4] or
[repl.it][5], but they don't seem to support latest features of C# and look outdated, so [.NET
Fiddle][1] stands out quite clearly from the crowd.

## OAuth, JWT & OpenID

Authorisation tokens are not going anywhere any time soon, whether you like it or not. There is a
tool that can help troubleshoot issues with auth tokens, such as invalid issuer/audience, elapsed
expiry date, invalid credentials etc.

It can be really helpful to see the data stored in that encoded auth token, so that you can spot any
obvious errors.

### jwt.io
If you having authorisation issues between your browser and the backend, or between microservices,
you can take the particular auth token in question, plug it into [jwt.io][7] and see what exactly is
stored in there.

[![jwt.io interface][6]][7]

## JSON stuff

### quicktype.io

[Generate C# classes][9] from JSON documents as simple as copy, paste and click.  It's indispensable
when you're defining boundaries of your API / microservice or integrating new services into existing
code base -- just take an example JSON payload and turn it into C# class.

[![quicktype.io interface][8]][9]


It lets you generate C# classes from other data, such as:

- JSON Schema
- Saved [Postman][10] responses & requests
- Typescript (it even generates custom `JsonConverter` class for enums)

It also supports a whole heap of other languages, such as Go, Swift, Java, Ruby and many others.

### JSON Formatter & Validators

There's quite a few online JSON formatters and validators that you can use to transforms mangled
JSON data into human-readable text.(Because let's admit there's so much software in this world that
doesn't care about the readability of JSON, like application log files, JSON stored in databases
etc.

It's also handy to be able to take any suspicious JSON that might be crashing your app or leading to
otherwise unexpected behaviour during serialisation/deserialisation and get it validated just to be
sure.

Here's a couple of formatters that I found to be useful:

- [jsonformatter.org][11]
- [jsonformatter.curiousconcept.com][12]

## Mock data

Often you need to get a sizeable amount of data for your tests, like GUIDs, names & addresses, phone
numbers and alike. The following tools can help with that:

### guidgenerator

[guidgenerator.com][13] offers the following functionality:

- Generate multiple GUIDs
- Formatting options (upper case, dashes)
- Encoding options (Base64, URL encode)

### Fake Name Generator
[www.fakenamegenerator.com][14] can generate non-existing identities, including data such as:

- First, middle, last and maiden names
- Social security numbers
- GPS coords
- Phone number
- Date of birth
- Emails, passwords, user agents
- Credit Card details
- Employment details
- Physical data (height, weight)
- Postal tracking numbers
- Car ownership details

You can generate single profiles or request a whole bunch of them to be generated. The download link
to a CSV file will be sent to your email after a reasonably short wait.

[![fakenamegenerator.com generated CSV file][15]][14]

### Bogus

[Bogus][16] is a .NET package that lets you create fake data during runtime in C#, F# and VB.NET. It
supports tons of different attribute types, such as:

- Address fields (street names, suburbs, states, countries etc)
- Company details (names, departments, bullshit slogans even)
- Database structures (table/column names)
- Date information (year/month/day, weekdays, intervals)
- Financial data (account numbers, credit card details, crypto addresses)
- Real image URL generation using [picsum.photos][17], [lorempixel.com][18], [placeholder.com][19]
  and [loremflickr.com][20]. You can specify the type of images (abstract, animals, business, cats,
  city, food, fashion, people, nightlife, nature, sports, technology, transport)
- Internet-related data (emails, user names, MAC/IP addresses, User Agents, URLs, protocols etc)
- Lorem Ipsum copy (single words, sentences, paragraphs of text)
- Personal details (names, phone numbers, job titles)
- Product reviews (called rants, ironically!)
- Vehicle details (Vin numbers, manufacturer, model, vehicle type, fuel type)
- Random numbers, byte sequences and strings

It also supports a whole bunch of non-English locales, such as French, Arabic, Japanese, Russian,
Indian, Chinese, Ukrainian etc.

Bogus has got very extensive API, totally check it out if you need to generate testing data in your
code.

## gitignore.io

Generate .gitignore files for your projects easily with [gitignore.io][21]. Just enter your language
/ IDE / Framework into the search box and Richard's your father's brother. You can add several
keywords to generate a file that covers all of the tech you're using.

[![gitignore.io search results][22]][21]

## Conclusion

There you go, here's a bunch of tools to help you with Web and App development on .NET platform.

Is there a tool that you found to be super useful that's not listed above? Hit me up on
[art@nimblegecko.com][23] or leave a comment below, and I will add it to the list!

{::options parse_block_html="true" /}
<div id="ctaCopy">
Also, sign up to my mailing list to get helpful advice, tips & tricks and all sort of things .NET
development related.
</div>

{::options parse_block_html="false" /}
{% include subscription.html %}

[1]:https://dotnetfiddle.net/
[2]:/img/dotnetfiddle.png "dotnetfiddle.net interface screenshot"
[3]:https://dotnetfiddle.net/Search/ByNuGetPackage
[4]:http://csharppad.com/
[5]:https://repl.it/languages/csharp
[6]:/img/jwtio.png "jwt.io interface screenshot"
[7]:https://jwt.io
[8]:/img/quicktypeio.png "quicktype.io interface screenshot"
[9]:https://quicktype.io/csharp/
[10]:https://www.postman.com/
[11]:https://jsonformatter.org/
[12]:https://jsonformatter.curiousconcept.com
[13]:https://www.guidgenerator.com/
[14]:https://www.fakenamegenerator.com/
[15]:/img/fakenamegenerator.png
[16]:https://github.com/bchavez/Bogus
[17]:https://picsum.photos/
[18]:http://lorempixel.com/
[19]:https://placeholder.com/
[20]:https://loremflickr.com/
[21]:https://www.toptal.com/developers/gitignore
[22]:/img/gitignoreio.png
[23]:mailto:art@nimblegecko.com
