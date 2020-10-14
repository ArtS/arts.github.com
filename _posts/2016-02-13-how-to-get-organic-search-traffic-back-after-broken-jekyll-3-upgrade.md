---
layout: post
title: How to get organic search traffic back after broken Jekyll 3 upgrade
categories:
- programming
tags:
- jekyll3
status: publish
type: post
published: true
---
It's a fine day, your site runs smoothly, thanks to Jekyll with its static HTML generation and your
clean and clever markdown. Then for some reason you decide to have a look at the Google Analytics
Organic Search report and suddenly you see that your traffic just jumped off the cliff.

<img src="/img/jekyll/drop.png" class="img-fluid" alt="Sudden drop in Google Analytics Organic Search Results">

## My traffic tanked, wtf Google?

There's a noticeable, 500% drop in the organic search traffic directed to your site. Wait a minute,
you say to yourself -- I made no big changes to the site, did none of those shady SEO tricks to get
some juice, my `analytics.js` is still in place and ticking (you can still see at least _some_
traffic directed to your site by Google). Quick look at [Google Search Console (aka Google Webmaster tools)][2] 
reveals no particularly important messages or warnings.

__Has this happened to your site? How can you get the traffic and visitors back? Read on to find out.__

## What did just happen?

It's possible that your Jekyll site got screwed up by the recent migration to Jekyll 3. You may have
upgraded it yourself, or if you're using GitHub pages, you may want to read this announcement --
[GitHub just upgraded to Jekyll 3][3].

If that's the case, these are the things you need to check first:

 - Are all pages rendering as expected (navigation elements, headers, paragraphs, code snippets etc)?
 - Are all pages loading, or are there any 404?

These would be some major turn-offs, in terms of SEO, that can move your site down in Google Search
ranks.

## How to fix it

### Broken markdown: headers

[__Kramdown__][4], the new rendering engine that Jekyll 4 uses is rather opinionated when it comes
to what it considers to be 'proper' markdown. HTML titles, in particular, caused me a lot of
pain.  You see, if you write your titles like this: '\#\#\#My lovely title', Kramdown is going to
render it just as normal text. __You need to put a space in between hashes and the title text.
So make sure you change all your titles from__

`##My lovely title` to `## My lovely title`

There can be many more problems like this, and I will keep updating this blog post as I find new
ones.  In the meantime, I encourage you to share your problems in the comments section below.

### Terrible, terrible 404
By default, Jekyll 3 generates post links with no trailing slash (see this [GitHub issue][5], there’s
quite a discussion there). So all your older links that had a slash at the end will stop working,
generating ton load of 404s and causing your Google ranking to tank.

If your site gets some 404 hits that are coming from Google search results, you will see those in
[Google Search Console][2], under [_'Crawl' -> 'Crawl errors'_][7].

<img src="/img/jekyll/404s.png" class="img-fluid" alt="Crawl Errors shows you 404s">

If you see a sudden spike, like the one on this screenshot above, you can be quite certain something
changed on your site and lots of URLs are no longer valid. Check out the details table underneath
that graph to see what are the particular missing URLs and if they have a trailing slash -- you've
hit a jackpot. Go fix them, Governor!

### How to fix 404 errors

While some people suggest using a JavaScript redirection on 404 page, that’s a terrible solution -
it will not help in recovering your Google rank because the server is still going to send HTTP 404
back to users' browsers or Google crawler.

So do the right thing and fix it properly by adding a trailing slash at the end of the `permalink`
parameter in `_config.yml`:

{% highlight markdown %}
permalink: /:categories/:year/:month/:day/:title/
{% endhighlight %}

__WARNING__: the string above is just an example, and your `permalink` value may differ -- it’s very
important to keep it as it is, adding the trailing slash __only__, otherwise all your URLs will
change and you’ll miss out on SEO juice (this is exactly what happened when your site was
regenerated with Jekyll 3)

### Replace hard links with `{% raw %}{% post_url %}{% endraw %}`
Strictly speaking, this is not needed for fixing the organic search traffic, but it's a good practice
to use `{% raw %}{% post_url %}{% endraw %}` tag for rendering links to your blog posts. Check out [Jekyll documentation][8] 
here and replace all hardcoded links with this tag.

## Testing it
Testing is a must, and apart from just looking through the posts to pick up bits of incorrect
layout and styling you also want to run a thorough check for missing links.

I recommend using this [free online tool from W3C][9], which, amongst the host of other things, can check for
broken links on your site.

<img src="/img/jekyll/w3cvalidator.png" class="img-fluid" alt="W3C Validator tool">

{% comment %}
{% include experiment.html %}
{% endcomment %}

## But Wait, There's More! {#ctaTitle}

{::options parse_block_html="true" /}
<div id="ctaCopy">
Losing traffic to your site sucks, especially when it happens due to the factors outside of your
control. I wrote this article to help you fix the problem and avoid losing time, traffic and
potentially money.

If you liked this article and want to get more helpful updates - sign up for my mailing list below. 
I never spam, period.
</div>

{% comment %}
{% include alt-cta.html %}
{% endcomment %}

{::options parse_block_html="false" /}
{% include subscription.html %}

## PS: Two words on how GitHub handled the upgrade
It's all over now, bugs are fixed and URLs are working, but I can't help but think that GitHub
could've done a better job here and let its clients know that Jekyll is getting updated and it's
likely to cause problems.

I received no emails from them and only found out about this upgrade when shit hit the fan and my site
began to lose traffic. Seriously, guys @ GitHub, you could've sent us all an email or two, is that too
much to ask?

Frankly, I am still disappointed with the lack of service and forethought.

[1]:/img/jekyll/drop.png
[2]:https://www.google.com/webmasters/tools/
[3]:https://github.com/blog/2100-github-pages-now-faster-and-simpler-with-jekyll-3-0
[4]:http://kramdown.gettalong.org
[5]:https://github.com/jekyll/jekyll/issues/4440
[6]:/img/jekyll/404s.png
[7]:https://www.google.com/webmasters/tools/crawl-errors
[8]:http://jekyllrb.com/docs/templates/#post-url
[9]:https://validator.w3.org/checklink
[10]:/img/jekyll/w3cvalidator.png
