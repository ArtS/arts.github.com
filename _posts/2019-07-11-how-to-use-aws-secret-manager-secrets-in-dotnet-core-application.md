---
layout: post
title: How to use AWS Secrets Manager to store & read passwords in .Net Core apps
categories:
- programming
tags:
-
excerpt_separator: <!--more-->
status: publish
type: post
published: true
---
More often than not your application needs to have access to various sensitive information, such as
logins & passwords of various sorts (database, network resources etc), API keys, encryption keys and
alike.

In one of my earlier articles, I demonstrated how that information can be stored in an encrypted way
in the application config file -- see [How to store login details securely in the application config file][1]. 
This approach, however, is not fool-proof. In fact, it's quite easy to decrypt the information stored in
such a way, provided the attacker has access to the executable with the decryption key.

In this article, I would like to show you a much more secure way of storing and accessing sensitive
information -- such as usernames and passwords, encryption keys, API keys etc. This method will come
particularly handy if you already rely on AWS for some of your application needs.

_Looking for an Microsoft Azure-specific solution to store & read your passwords? Check out this
article: ["How to securely store and retrieve sensitive info in .NET Core apps with Azure Key Vault"][6]_

<!--more-->

## Storing a secret
Creating a secret is easy:
- First of all, login to AWS console, and then type "Secrets Manager" in the search box.
- Navigate to Secrets Manager, and click on "Store a new secret" button
- Select "Other type of secrets"

![AWS Secrets Manager "Store a new secret" screen][3]

You can both supply a free-text value for the secret, as well as provide a JSON-formatted data (this
will need to be de-serialised by your app later). JSON is preferable if you want to store a complex
structure, however, if you have just a password to store, replace everything in that text box with
your secret string:

![Example of a secret in AWS Secrets Manager][4]

Next step is to name the secret. You may want to use some form of "path emulation" in your secrets
naming. For example, `web-api/passwords/database` may store a DB password used by your Web API
back-end, and `worker/password/web-api-key` for your worker app, that calls Web API and needs an API
key. Having a simple naming convention helps when you have several secrets to keep the track of.

![Example of a secret name in AWS Secrets Manager][5]

## Secret access control
Unfortunately, secret access control is a big topic that is outside of this article. I am going to 
assume that you already have a user or a role set up in AWS that has corresponding permissions to 
access AWS Secrets Manager. 

In case you need to get that sorted first, check out this article -
["Authentication and Access Control for AWS Secrets Manager"][2]. But in short, you'll need to:

- Create a new user or a role (or use an existing one)
- Assign an IAM policy to that user/role that allows accessing this secret

If this proves to be problematic, leave a comment below, or shoot me an email, and I'll write a
separate article on how to do that.

## Reading the secret from your app
Finally, the fun part! First of all, your .NET Core app needs to reference `AWSSDK.SecretsManager`
NuGet package. To do that, in your terminal of choice navigate to your project folder and run the
following command:

{% highlight bash %}
dotnet add package AWSSDK.SecretsManager
{% endhighlight %}

Next, the following code will connect to AWS and retrieve the secret:
{% highlight csharp %}
    // ... bunch of code skipped for brevity...
    //
    // accessKeyId, secretAccessKey are normally set in your env vars
    // 
    var client = new AmazonSecretsManagerClient(accessKeyId, secretAccessKey, RegionEndpoint.APSoutheast2);

    var request = new GetSecretValueRequest
    {
        // this gets your secret name, 'web-api/passwords/database' in our case
        SecretId = secretName
    };

    GetSecretValueResponse response = null;

    try
    {
        response = client.GetSecretValueAsync(request).Result;
    }
    //
    // Exceptions are taken from AWS SDK API Reference here:
    // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html#API_GetSecretValue_Errors
    //
    // Setting breakpoints inside every exception handler can help you identify what's 
    // wrong in each individual situation. 
    //
    catch (DecryptionFailureException e)
    {
        // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
        throw;
    }
    // ... bunch of catch code skipped for brevity...
{% endhighlight %}
Some critical moments to call out here:

1. `accessKeyId` and `secretAccessKey` are meant to contain valid access credentials. Generally, your
   EC2 instance will have environment variables `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`
   containing those. You can skip these parameters, and it will force the
   `AmazonSecretsManagerClient` to use the environment variables.
2. It is important to specify the correct AWS Region where your secret is stored, either via
   `AmazonSecretsManagerClient` call as above or by setting the default region, like so: 
   `AWSConfigs.AWSRegion = RegionEndpoint.APSoutheast2.SystemName;`

It's quite likely that your app won't retrieve the secret correctly the first time you test it. Don't
despair - security is a tricky area. There are quite a few hoops to jump through:
- your IAM user's policy needs to be set up correctly
- your app needs to get its creds (Access Key & Secret Access Key)
- your app needs to supply those creds to the manager

To troubleshoot any issues, set breakpoints in __every__ `catch` clause (there's a few, see the link
above for all possible exceptions, or download the code below). Run your app in the debugger and see
which error you get. Inspect the exception object in detail, as it will contain details of the
particular issue you're having. Alternatively, add ample logging.

## Conclusion
In this article, I demonstrated how you can store secrets using AWS Secrets Manager, how to retrieve
them using `AmazonSecretsManagerClient` from `AWSSDK.SecretsManager` package and how to troubleshoot
any issues you may have.

Leave a comment below if you have any issues or questions!

{% include code-download-cta.html %}

[1]:/how-to-store-login-details-securely-in-application-config-file/
[2]:https://docs.aws.amazon.com/secretsmanager/latest/userguide/auth-and-access.html
[3]:/img/secret-type-choice.png "AWS Secrets Manager 'Store a new secret' screen"
[4]:/img/secret-value.png "Example of a secret in AWS Secrets Manager"
[5]:/img/secret-name.png "Example of a secret name in AWS Secrets Manager"
[6]:{% post_url 2020-09-17-how-to-securely-store-and-retrieve-passwords-in-dot-net-core-apps-with-azure-key-vault %}
