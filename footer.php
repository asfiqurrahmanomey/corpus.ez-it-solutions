 
  <!-- Footer Start -->
  <footer id="global-footer" class="global-footer">
    <div class="global-footer-container">
      <div class="row">
        <div class="medium-6 columns mobile-white-border clearfix">
          <form class="enews-signup-form" type="get" action="https://www.visitcorpuschristitx.org/NewsletterSignup.aspx">
            <label for="enews-signup">GET eNEWS</label>
            <input id="enews-signup" type="email" name="email" placeholder="email address" required="true" />
            <button type="submit" data-category="eNews" data-action="Footer" data-label="Email Submit">Submit</button>
          </form>
        </div>
        <div class="medium-6 columns mobile-white-border">
          <ul class="footer-links clearfix">
            <li>
              <a href="about/index.html" title="About the Corpus Christi CVB">About Us</a>
            </li>
              <li>
                <a href="contact-us/index.html" title="Contact the Corpus Christi CVB">Contact Us</a>
              </li>
              <li>
                <a href="RequestGuide.html" title="Request a Corpus Christi Visitor Guide">Request Guide</a>
              </li>
              <li>
                <a href="media/index.html" title="Media">Media</a>
              </li>
              <li>
                <a href="vcca/index.html" title="VCCA Program">VCCA Program</a>
              </li>
              <li>
                <a href="meetings/index.html" title="Sports Planners">Sports Planners</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="row">
          <div class="medium-6 columns mobile-white-border clearfix">
          <ul class="social-icons">
              <a href="http://www.facebook.com/visitcorpuschristi"  title="Like us on Facebook" target="_blank" data-category="Social" data-action="Exit" data-label="Facebook"><img src="<?php echo get_template_directory_uri(); ?>/asset/img/yt1.png" alt="" width="60px" height="60px" style="margin-left: 15px; margin-top: 1px;"/><a/>
              </ul>
              <ul class="social-icons">
              <a href="http://www.facebook.com/visitcorpuschristi"  title="Like us on Facebook" target="_blank" data-category="Social" data-action="Exit" data-label="Facebook"><img src="<?php echo get_template_directory_uri(); ?>/asset/img/fb.png" alt="" width="60px" height="60px50px" style="margin-left: 15px; margin-top: 1px;"/><a/>
              </ul>
              <ul class="social-icons">
              <a href="http://www.facebook.com/visitcorpuschristi"  title="Like us on Facebook" target="_blank" data-category="Social" data-action="Exit" data-label="Facebook"><img src="<?php echo get_template_directory_uri(); ?>/asset/img/twi1.png" alt="" width="60px" height="60px50px" style="margin-top: 1px;" /><a/>
              </ul>
          </div>
          <div class="medium-6 columns mobile-white-border clearfix">
            <a href="https://www.tripadvisor.com/Tourism-g60927-Corpus_Christi_Texas-Vacations.html" target="_blank" title="More information about Corpus Christi on Trip Advisor (link opens in a new browser tab or window)" class="trip-advisor-link" data-category="Trip Advisor" data-action="Exit">
              <img src="<?php echo get_template_directory_uri(); ?>/asset/img/trip-advisor.png" alt="Trip Advisor Logo" width="250" height="59" /></a>
            </div>
          </div>
          <p class="contact">Corpus Christi Visitor Info Center: 309 N. Water St., Ste. D (Located in Water Street Market)
            <span class="separator">|</span>
            <span class="green-text">
              <a href="tel:8007662322" title="Call the Corpus Christi CVB toll-free at 800-766-2322" data-category="Call" data-action="Footer" data-label="Number Used">1-800-766-2322</a></span>
              <span class="separator">|</span>
              <span class="green-text">
                <a href="tel:3615612000" title="Call the Corpus Christi CVB at 361-561-2000" data-category="Call" data-action="Footer" data-label="Number Used">361-561-2000</a>
              </span></p>
              <p class="copyright">© 2021 Corpus Christi CVB. <a href="privacy-policy/index.html" title="Corpus Christi CVB Privacy Policy">Privacy Policy</a>
              </p>
            </div>
          </footer>
          <!-- Footer End -->
          
          
          
<script src="<?php echo get_template_directory_uri(); ?>/https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous">
</script>
<script>try{Typekit.load();}catch(e){}</script>
  <script src="<?php echo get_template_directory_uri(); ?>/asset/js/main30f4.js?v=3"></script>
    <script type="text/javascript" language="javascript">
    $(function(){
      $.get('/gettransform.ashx', {'templateid' : "116"}, function(data){
        $('.weather-btn-label').html(data);
      });
    });
    </script>  
      <script src="<?php echo get_template_directory_uri(); ?>/asset/js/home.js"></script>

<?php wp_footer(); ?>
</body>
</html>