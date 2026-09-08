// Language selector (AR/EN/FR), menu toggle, year, and basic form feedback.
// Handles hiding/showing elements with [data-lang] and options with data-lang attribute.
document.addEventListener('DOMContentLoaded', function(){
  var menuToggle = document.getElementById('menuToggle');
  var nav = document.getElementById('nav');
  menuToggle && menuToggle.addEventListener('click', function(){
    if(nav.style.display === 'flex') nav.style.display = 'none';
    else nav.style.display = 'flex';
  });

  // Year in footer
  var yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Language buttons
  var langButtons = document.querySelectorAll('.lang-btn');

  // Get saved language or default to Arabic
  var currentLang = localStorage.getItem('imbs_lang') || 'ar';
  setLanguage(currentLang, false);

  langButtons.forEach(function(btn){
    btn.addEventListener('click', function(){
      var lang = btn.getAttribute('data-lang-val');
      setLanguage(lang, true);
      localStorage.setItem('imbs_lang', lang);
    });
  });

  function setLanguage(lang, updateButtons){
    // set html attributes
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';

    // update visible text nodes
    var els = document.querySelectorAll('[data-lang]');
    els.forEach(function(el){
      var attr = el.getAttribute('data-lang');
      if(!attr){
        // for elements that have multiple spans with data-lang (we used spans), handle via tag
        // if element itself is span with data-lang, handled below
        return;
      }
    });

    // We used multiple spans with data-lang attributes; show/hide them:
    var spans = document.querySelectorAll('[data-lang]');
    spans.forEach(function(s){
      if(s.getAttribute('data-lang') === lang){
        s.hidden = false;
      } else {
        s.hidden = true;
      }
    });

    // Handle <option data-lang="..."> visibility (for some browsers hidden on option is supported)
    var selects = document.querySelectorAll('select');
    selects.forEach(function(sel){
      Array.from(sel.options).forEach(function(opt){
        var optLang = opt.getAttribute('data-lang');
        if(optLang){
          opt.hidden = (optLang !== lang);
        } else {
          // options without data-lang are considered language-neutral (like numeric ranges), keep visible
          opt.hidden = false;
        }
      });
    });

    // Update active state on buttons
    if(updateButtons){
      langButtons.forEach(function(b){
        var is = b.getAttribute('data-lang-val') === lang;
        b.setAttribute('aria-pressed', is ? 'true' : 'false');
      });
    } else {
      // initial set
      langButtons.forEach(function(b){
        var is = b.getAttribute('data-lang-val') === lang;
        b.setAttribute('aria-pressed', is ? 'true' : 'false');
      });
    }
  }

  // Basic form submission feedback (language-aware)
  var form = document.getElementById('contactForm');
  form && form.addEventListener('submit', function(e){
    // allow actual submission to action endpoint; show user notification
    var lang = document.documentElement.lang || 'ar';
    if(lang === 'ar') alert('شكرًا! طلبك قيد الإرسال. سنعاود التواصل معكم قريباً.');
    else if(lang === 'fr') alert('Merci ! Votre demande est en cours d\'envoi. Nous vous contacterons sous peu.');
    else alert('Thank you! Your request is being submitted. We will contact you shortly.');
  });
});
