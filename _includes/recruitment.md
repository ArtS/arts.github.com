<ul id="ulLinks">
  <li><a href="/recruiter-interviews-are-they-a-waste-of-time/">Recruiter interviews - are they a waste of time?</a></li>
  <li><a href="/never-trust-what-recruiters-say/">Never Trust What Recruiters Say</a></li>
  <li><a href="/how-to-deal-with-recruiters-salary-related-questions/">How to Deal with Recruiters: Salary Related Questions</a></li>
  <li><a href="/you-should-be-doing-more-job-interviews/">You should be doing more job interviews</a></li>
  <li><a href="/resume-trawling-job-ads/">Resume trawling job ads</a></li>
</ul>
<script>
  window.addEventListener('DOMContentLoaded', function() {
    (function($) { 
      $('#ulLinks li').each(function(i, elem) {
        var href = $(elem).find('a')[0];
        if(href.pathname === window.location.pathname) {
          $(elem).hide();
        }
      });
    })(jQuery);
  });
</script>
