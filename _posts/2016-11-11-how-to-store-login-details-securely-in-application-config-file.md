---
layout: post
title: How to store login details securely in the application config file
categories:
- programming
tags:
status: publish
type: post
published: true
---

It is very common in our day and age of interconnected integratedness for an application to be
reaching out to external services such as email servers, databases etc. This creates a problem
-- you need to store usernames, passwords, access codes, API keys etc somewhere and mitigate the
 risks of that sensitive information either not being found or read by a wrong person.

One of the ways of securing such sensitive information is symmetric encryption - when same
password/key is used for encryption and decryption. In this article, I want to show you how to read 
encrypted data from application config file in .NET, decrypt it, update it, encrypt and store it
back into the configuration file.

## Enter app.config
There's a handful of classes in .NET that you can use to read and update application config file.
Two things to be mindful of:

- You need to add a reference to `System.Configuration` assembly to your project
- You need to obtain runtime location of the program's executable so you can load & update the
  config file

## Storing encrypted values in app.config
Let's have a look at the following code:
{% highlight csharp %}
    // Load application configuration file so we can update it
    var configuration = ConfigurationManager.OpenExeConfiguration(Assembly.GetExecutingAssembly().Location);

    configuration.AppSettings.Settings["username"].Value = EncryptString("new username", configPassword);
    configuration.AppSettings.Settings["password"].Value = EncryptString("new password", configPassword);
    configuration.Save();

    // Reload app config file
    ConfigurationManager.RefreshSection("appSettings");
{% endhighlight %}

It loads application configuration file (using it's location determined via
`Assembly.GetExecutingAssembly().Location`), updates entries for `"username"` and `"password"`,
saves the file and reloads it.

Ignore `EncryptString(...)` function for now, just assume it does what it's supposed to do - we'll
get back to it later.

## Reading and decrypting values in app.config
Following code reads the values from the config and decrypts them:
{% highlight csharp %}
    var encryptedUsername = ConfigurationManager.AppSettings["username"];
    var encryptedPassword = ConfigurationManager.AppSettings["password"];
    Console.WriteLine(string.Format("Encrypted username: {0}", encryptedUsername));
    Console.WriteLine(string.Format("Encrypted password: {0}", encryptedPassword));
    
    // Decrypt username & password and print to the console
    var decryptedUsername = DecryptString(encryptedUsername, configPassword);
    var decryptedPassword = DecryptString(encryptedPassword, configPassword);

    Console.WriteLine(string.Format("Decrypted username: {0}", decryptedUsername));
    Console.WriteLine(string.Format("Decrypted password: {0}", decryptedPassword));
{% endhighlight %}

Again, ignore the `DecryptString(...)` function for now... Actually, no, let's talk encryption.

## How encryption/decryption works
Examples above deliberately hide the cryptographic aspect of the problem so we can focus on
retrieving and updating of config values. You can, however, get fully working crypto code by
downloading the source code that goes with this article (see below for that).

The encryption/decryption functions use symmetric key (or password), meaning the same key is used
for encryption and decryption. This can be a reasonable level of protection if you just want to
ward off people that are not supposed to be poking around and sticking their noses into everything,
however, this will probably not stop a serious attacker, capable of disassembling your source code
that stores the password.

If you need a higher level of security, you should consider asymmetric keys and different crypto
algorithms.

I have written a new article that shows how to use AWS Secrets Manager to retrieve secrets from a
secure storage -- check it out here, it's a much more secure way of storing sensitive data: 
[How to use AWS Secrets Manager to retrieve passwords in .Net Core apps][2]

{::options parse_block_html="true" /}
<div id="divCodeDownload">
## Source code
To download fully working and tested source code with this example head to this [GitHub repo][1].
</div>

{% include experiment.html %}

## Don't get stuck again, save yourself some precious time! {#ctaTitle}

{::options parse_block_html="true" /}
<div id="ctaCopy">
I hope this article helped you to move forward in your work.

You can probably recall a time when you were stuck on some problem and the solution seemed so close,
yet it took hours to figure it out. And when you eventually did that, it was something so
infuriatingly stupid, you wanted to punch the monitor.

Do you want to avoid wasting your time on stupid bugs and traps in .NET? Subscribe to my mailing
list and save HOURS of your life and bring the joy back into programming. I only send useful and 
actionable advice, no spam ever, and you can unsubscribe at any time.
</div>

{% include alt-cta.html %}

{::options parse_block_html="false" /}
{% include subscription.html %}


[1]:https://github.com/ArtS/secure-local-config
[2]:/how-to-use-aws-secret-manager-secrets-in-dotnet-core-application/
