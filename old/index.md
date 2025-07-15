---
layout: article
permalink: /
share: false
logo: logo.png
---

Welcome to the homepage of **UK Quizbowl**: the organisation for all things to do with student buzzer quizzing in the UK.

Quizbowl is, essentially, a game similar to the TV show *University Challenge*, but with some differences in focus ---  if you are new, why not check out our [**introduction to quizbowl**]({{ site.url }}{{ site.baseurl }}/intro/)? You can also find the details of upcoming quizbowl tournaments on the [**events page**]({{ site.url }}{{ site.baseurl }}/events/), with some common questions answered in the [**FAQ section**]({{ site.url }}{{ site.baseurl }}/events-faq/). A short list of quizbowl terms used on this website is provided in the [**glossary**]({{ site.url }}{{ site.baseurl }}/glossary/).

To receive updates from UK Quizbowl, like us on **<a href="https://www.facebook.com/quizbowluk/"><span style="color: #3b5998;">Facebook</span></a>** and follow on **<a href="https://twitter.com/BritishQuizbowl"><span style="color: #0084b4;">Twitter</span></a>**.

### Latest blog posts

<div class="tiles">
{% for post in site.posts %}
	{% include post-grid.html %}
{% endfor %}
</div><!-- /.tiles -->
