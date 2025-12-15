// snippet-server/snippetConfig.js

const config = {
  /**
   * Configuration for the 'pricing-card' snippet.
   */
  'pricing-card': {
    template: 'pricing-card.html',
    // Default values for a FREE user. These are fixed.
    free: {
      PLAN_NAME: 'Basic Plan',
      PRICE: '$10',
      INTERVAL: '/mo',
      CTA_TEXT: 'Get Started',
      CTA_HREF: '#',
      FEATURES_LIST: '<li><i class="fas fa-check-circle"></i> 1 Project</li>\n<li><i class="fas fa-check-circle"></i> Basic Support</li>',
      HIGHLIGHT_CLASS: '',
    },
    // Default values for a PRO user. These can be overridden by URL params.
    pro: {
      PLAN_NAME: 'Pro Plan',
      PRICE: '$99',
      INTERVAL: '/mo',
      CTA_TEXT: 'Choose Plan',
      CTA_HREF: '#',
      FEATURES_LIST: '<li><i class="fas fa-check-circle"></i> Unlimited Projects</li>\n<li><i class="fas fa-check-circle"></i> Priority Support</li>',
      HIGHLIGHT_CLASS: 'highlighted',
    },
    // List of URL parameters that a PRO user is allowed to provide.
    pro_params: ['plan_name', 'price', 'interval', 'cta_text', 'cta_href', 'features', 'highlighted', 'primary_color', 'accent_color'],
  },

  /**
   * Configuration for the 'testimonial' snippet.
   * (This is just an example of how easily you can add another one)
   */
  'testimonial': {
    template: 'testimonial.html', // Assumes you have a testimonial.html template
    free: {
      QUOTE: 'This service is great.',
      AUTHOR: 'Valued Customer',
      TITLE: 'End User',
    },
    pro: {
      QUOTE: 'This service completely transformed our business!',
      AUTHOR: 'Jane Doe',
      TITLE: 'CEO, Pro Inc.',
    },
    pro_params: ['quote', 'author', 'title', 'accent_color'],
  },
  // ... You can add 'accordion', 'hero', 'tabs', etc. here following the same structure.
};

module.exports = config;