---
layout: post
title: How to securely store and retrieve sensitive info in .NET Core apps with Azure Key Vault
categories:
- programming
tags:
-
excerpt_separator: <!--more-->
type: post
---
If your Web, Console/Windows or WPF app ever needs to talk to databases, other APIs or maybe
encrypt/decrypt information it receives from other apps or the user, it needs to access sensitive
authentication credentials -- such as user names and passwords for database connection strings, API
keys, private encryption keys etc.

Where should you store that sensitive info and how would you supply it for your app? The first
obvious approach is to store those values in a config file of sorts or a local database. Why not?
It's easy, secrets can be read & used by your app quickly and reliably, it seems.

Well, there are several major issues with that approach:

<!--more-->

- anyone with access to your app can view the config and see the passwords etc
- since your app's config might be checked into your version control, any leak of the code will
  expose your secrets
- if you ever need to change the password, you'll need to update all config files deployed to all
  machines

Even if you decide to encrypt the password to hide it from prying eyes, the decryption key and the
algorithm need to be supplied with your app, meaning anyone with basic knowledge of disassembling
.NET apps can eventually decrypt the secret.

## How to store & access secrets securely

In the case of a web app, you can store passwords in environment variables on the server and read it
using [`EnvironmentVariablesConfigurationProvider`][1], which eliminates the need to store passwords
in a config file or source code.

But your local apps can't use that method, because local env vars are just as easily accessible to
an attacker as the config file. That's why your app needs to access those secrets from somewhere
else -- like secure cloud storage.

_Looking for an AWS-specific solution to store & read your passwords? Check out this article: ["How to
use AWS Secrets Manager to store & read passwords in .Net Core apps"][2]_

In this article, I'd like to show you how to set up an Azure Key Vault, which is a secure service,
specifically designed for storage, retrieval and maintenance of sensitive authentication
information. You'll also learn how to create, modify and read secrets in Key Vault using both
command line and C# code.

## Get your ducks in a row

When it comes to setting up a Key Vault, you need to follow certain steps to ensure that only
people and apps with the right credentials can access this sensitive information. Let's outline the
steps and then dive into each one in detail.

1. [First, you'll need to set up an account with Azure, if you don't have one already][11]
2. [Install Azure CLI so you could run commands from your local shell][12]
3. [Login to your Azure account from your command line shell][9]
4. [Decide which geographical location you're going to use for storage of your secrets][13]
5. [Create a Resource Group to host the Key Vault][14]
6. [Create a Key Vault][10]
7. [Set up access credentials for the newly created Key Vault][15]
8. [Learn how to create & read a secret using the command line][16]
9. [Learn how to retrieve the secret using C#][17]

That's quite a few steps, but if you already have Azure account set up and CLI tools installed,
feel free to skip first two steps.

### Register for an Azure account
At the time of writing of this article, you can get $200 US dollars in credit for free (expiring in
30 days) which should be plenty to experiment with the services.

Head to [Microsoft Azure][3] and register a new account.

### Install Azure CLI
Strictly speaking, this step is optional, since you can use [Azure Cloud Shell][4], which is a
web-based CLI, but I personally find it much more convenient to be able to run all my commands from
one shell, without having to switch between my browser and terminal.

Go to [Install Azure CLI][5] page, select your platform (Windows, Linux or macOS) and follow the
instructions.

### Login to Azure from the command line
Skip this step if you are using Azure Cloud Shell, as you will be already logged in. For your local
Azure CLI, you need to login into your account first. In your shell, run

`az login`

which will open a new tab in your browser and take you through the login process. After that, you
should be able to run Azure commands in your shell.

### Select a geographic location
Given that Azure is a global cloud service, you need to decide which datacentre is the closest to
you. To see all available locations, run the following command:

`az account list-locations -o table`

which will print out something like this:

```
DisplayName               Name                 RegionalDisplayName
------------------------  -------------------  -------------------------------------
East US                   eastus               (US) East US
East US 2                 eastus2              (US) East US 2
South Central US          southcentralus       (US) South Central US
West US 2                 westus2              (US) West US 2
Australia East            australiaeast        (Asia Pacific) Australia East
Southeast Asia            southeastasia        (Asia Pacific) Southeast Asia
North Europe              northeurope          (Europe) North Europe

...many more lines...

```

To minimise the latency, you may want to pick a location that's closest to you or most of your
app's users.

### Create a Resource Group
Microsoft Azure uses Resource Groups to, well, group resources related to a given solution. For the
time being you don't need to worry too much about what those do, just go ahead and create one, so
that you can later create a Key Vault in that Resource Group.

Run the following command from your shell / Azure Cloud Shell. Replace
`<your-resource-group-name>` with whatever makes sense for you, like
"MyTikTokKillerAppResourceGroup". Also, replace `<your-location>` with whatever location you
selected from the `Name` column in the previous step.

`az group create --name <your-resource-group-name> --location <your-location>`

which will print out a bunch of JSON output in case it succeeds. Make sure that `provisioningState`
is set to `Succeeded`, like the following:

```
"properties": {
    "provisioningState": "Succeeded"
  },
```

### Create a Key Vault
Hang in there, champions! We're getting close to the crux of this whole article. Now you're going
to create a Key Vault.

__There's one very important caveat.__ Key Vault names are globally unique. Which means that all those
`Test`, `MyVault` and `123test` names are probably taken already, so you'd better prefix your Key
Vault name with the name of your app and/or company name, a-la `ACME-TikTokKiller-KeyVault`.

Now with your favourite location and the name of newly created Resource Group in mind, run the
following command:

`az keyvault create --name <your-key-vault-name> --resource-group <your-resource-group-name> --location <your-location>`

### Set up access credentials
Now your app needs access credentials to access this newly created Key Vault. In Microsoft-speak
that is called "Service Principal", so let's go ahead and create one. Replace `<your-app-name>` with
the correct value.

`az ad sp create-for-rbac -n <your-app-name> --skip-assignment`

__Here's a really important bit.__ This command will output three very important values you want to
save. I added comments next to each value to help you navigate:

```
{
  "appId": "24a1e1d1-fa3d-39b3-9a41-f2d2fdcf4637",  // this is your AZURE_CLIENT_ID
  "displayName": "<your-app-name>",
  "name": "http://your-app-name",
  "password": "o4DSXiIGv_4ULhq7q407gx~27Qw5M7YfD3", // this is your AZURE_CLIENT_SECRET
  "tenant": "73d69d55-3593-7e33-5b6b-0b001b4f3583"  // this is your AZURE_TENANT_ID
}
```

Now you need to allow this Service Principal to access the Key Vault. Run the following command,
replacing the values. As before, make sure that `provisioningState` is set to `Succeeded` in the
output JSON.

```
az keyvault set-policy --name <your-key-vault-name> --spn <AZURE_CLIENT_ID> --secret-permissions backup delete get list set
```

### Create & read a secret using the command line

Now you're all set, let's write some secrets to that freshly minted Key Vault! Run this command,
replacing the values in angle brackets:

```
az keyvault secret set --value <your-secret-password> --name <name-of-the-secret> --vault-name <your-key-vault-name>
```

You can easily verify that value has been set by going to Azure web console, under "Key Vaults",
selecting your Key Vault, then clicking on "Secrets", selecting your secret and then clicking on
"Show Secret Value".

![Show secret value in Azure Key Vault][6]

You can also read the value of that secret using the following command:

```
az keyvault secret show --name <name-of-the-secret> --vault-name <your-key-vault-name>
```

### Retrieve a secret using C#

To retrieve secrets from Azure Key Vault from your C# app, you are going to need two packages:
`Azure.Identity` and `Azure.Security.KeyVault.Secrets`. You can add them to your project from the
command line:

{% highlight shell %}
dotnet add package Azure.Identity
dotnet add package Azure.Security.KeyVault.Secrets
{% endhighlight %}

After that retrieving the secret is easy:

{% highlight csharp %}
var keyVaultUrl = "https://<your-key-vault-name>.vault.azure.net/";

var credential =  new DefaultAzureCredential();

var client = new SecretClient(vaultUri: new Uri(keyVaultUrl), credential);

KeyVaultSecret secret = client.GetSecret("<your-secret-name>");

Console.WriteLine($"{secret.Name}: {secret.Value}");
{% endhighlight %}
It is important to note, that use of [`DefaultAzureCredential`][7] requires an active Azure session
(see [step #3][9] of this tutorial). That class tries to retrieve credentials from multiple sources, such
as environment variables, Azure Cloud Shell data etc. Use that class with env vars when deploying
your web app to your hosting.

If you want to specify `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET` and `AZURE_TENANT_ID` manually, you
need to use [`ClientSecretCredential`][8] class. To see where to get those values, refer to 
[step #6][10] of this tutorial.

{% highlight csharp %}
var credential = new ClientSecretCredential(
    "AZURE_TENANT_ID",  // use value from "tenant"
    "AZURE_CLIENT_ID", //  use value from "appId"
    "AZURE_CLIENT_SECRET" // use value from "password"
);
var client = new SecretClient(vaultUri: new Uri(keyVaultUrl), credential);
{% endhighlight %}

If you want to download complete & working source code for this example, just put your email address
in the form below & you will get an email with a link to that source code.

## Conclusion
Hopefully, this article helped you to see why you should not be storing passwords with your app (even
encrypted!), as well as showing you how to use Azure Key Vault to store and retrieve applications
secrets, such as passwords. 

Let me know if you have any issues with anything in this article and I'll do my best to help. I read
and reply to all emails.

{% include code-download-cta.html %}

[1]:https://docs.microsoft.com/en-us/aspnet/core/fundamentals/configuration/?view=aspnetcore-3.1#evcp
[2]:{% post_url 2019-07-11-how-to-use-aws-secret-manager-secrets-in-dotnet-core-application %}
[3]:https://azure.microsoft.com/en-us/
[4]:https://docs.microsoft.com/en-us/azure/cloud-shell/overview?view=azure-cli-latest
[5]:https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest
[6]:/img/azure-show-secret-value.png
[7]:https://docs.microsoft.com/en-us/dotnet/api/azure.identity.defaultazurecredential?view=azure-dotnet
[8]:https://docs.microsoft.com/en-us/dotnet/api/azure.identity.clientsecretcredential?view=azure-dotnet
[9]:#login-to-azure-from-the-command-line
[10]:#create-a-key-vault
[11]:#register-for-an-azure-account
[12]:#install-azure-cli
[13]:#select-a-geographic-location
[14]:#create-a-resource-group
[15]:#set-up-access-credentials
[16]:#create--read-a-secret-using-the-command-line
[17]:#retrieve-a-secret-using-c
