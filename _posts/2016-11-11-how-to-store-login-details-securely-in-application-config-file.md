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

__WARNING__:
This article is quite outdated now. I do not recommend using this approach for anything that even
remotely resembles a real production app. You should be using a secure cloud secrets storage
service, such as AWS Secrets Manager or Azure Key Vault. I wrote some new articles to help you
navigate this space:

- [How to securely store and retrieve sensitive info in .NET Core apps with Azure Key Vault][1]
- [How to use AWS Secrets Manager to retrieve passwords in .Net Core apps][2]

The article below is preserved for purely historical purposes. Feel free to play around with the
code in there, but please, for the love of all that's good, do not store passwords locally with the
apps.

---

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

{% include code-download-cta.html %}

[1]:https://github.com/ArtS/secure-local-config
[2]:{% post_url 2019-07-11-how-to-use-aws-secret-manager-secrets-in-dotnet-core-application %}
[3]:{% post_url 2020-09-17-how-to-securely-store-and-retrieve-passwords-in-dot-net-core-apps-with-azure-key-vault %}
