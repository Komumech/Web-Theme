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

  /**
   * Configuration for the 'accordion' snippet.
   */
  'accordion': {
    template: 'accordion.html',
    free: {
      HEADER_1: 'What is dynamic embedding?',
      CONTENT_1: "It's a modern technique using iframes to embed UI components.",
      HEADER_2: 'Is this compatible with WordPress?',
      CONTENT_2: 'Yes, it works on any platform that allows custom HTML.',
      // Item 3 is hidden for free users
      ITEM_3_STYLE: 'display: none;',
    },
    pro: {
      HEADER_1: 'What is dynamic embedding?',
      CONTENT_1: "It's a modern technique using iframes and PostMessage to embed complex UI components that automatically resize and update without affecting the parent website's security or performance.",
      HEADER_2: 'Is this compatible with WordPress?',
      CONTENT_2: 'Yes, completely. Since the component is hosted externally and embedded via a simple HTML iframe tag, it works on any platform that allows custom HTML, including WordPress, Shopify, and React apps.',
      HEADER_3: 'How do I change the colors?',
      CONTENT_3: "You change colors by modifying the data- attributes on the iframe tag itself. Our universal handler script automatically reads these parameters and applies them to the component's CSS variables.",
      ITEM_3_STYLE: '', // Show item 3 for pro users
    },
    pro_params: ['header_1', 'content_1', 'header_2', 'content_2', 'header_3', 'content_3', 'accent_color', 'bg_color', 'text_color', 'content_bg_color', 'hover_bg'],
  },

  /**
   * Configuration for the 'features' snippet.
   */
  'features': {
    template: 'features.html',
    free: {
      HEADLINE: 'Core Features',
      TAGLINE: 'Discover the powerful features included in our platform.',
      CARD1_TITLE: 'Easy Integration',
      CARD1_CONTENT: 'Get started in minutes with a simple copy-paste.',
      CARD2_TITLE: 'Responsive Design',
      CARD2_CONTENT: 'Looks great on all devices, from mobile to desktop.',
      CARD3_TITLE: 'Good Support',
      CARD3_CONTENT: 'Get help from our team when you need it.',
    },
    pro: {
      // Pro users can customize everything, so we only need to list the allowed params.
    },
    pro_params: ['headline', 'tagline', 'primary_color', 'accent_color', 'card1_title', 'card1_content', 'card2_title', 'card2_content', 'card3_title', 'card3_content'],
  },
  // ... You can add 'accordion', 'hero', 'tabs', etc. here following the same structure.
};

module.exports = config;