// snippet-server/server.js

const he = require('he');
const express = require('express');
const fs = require('fs').promises; // Use the promise-based version of fs
const path = require('path');

// --- Mock Database ---
// In a real app, this would connect to a real database.
const users = {
  "abc123_free_token": { id: 1, name: "Free User", plan: "free" },
  "xyz789_pro_token": { id: 2, name: "Pro User", plan: "pro" },
};

function findUserByToken(token) {
  return users[token];
}
// --- End Mock Database ---

// --- Snippet Configuration ---
// Load the configuration from the dedicated config file.
const snippetConfig = require('./snippetConfig');
// --- End Snippet Configuration ---


/**
 * Processes query parameters for 'pro' plan users to generate template data and dynamic styles.
 * @param {object} queryParams - The query parameters from the request.
 * @param {object} config - The snippet configuration for the current snippet.
 * @returns {{templateData: object, dynamicStyles: string}}
 */
function processProParams(queryParams, config) {
  const templateData = { ...config.pro };
  let dynamicStyles = '';

  for (const param of config.pro_params) {
    if (queryParams[param]) {
      const key = param.toUpperCase();
      const value = queryParams[param];

      if (key === 'FEATURES') {
        templateData.FEATURES_LIST = value.split(',')
          .map(f => `<li><i class="fas fa-check-circle"></i> ${he.encode(f.trim())}</li>`)
          .join('\n');
      } else if (key === 'HIGHLIGHTED') {
        templateData.HIGHLIGHT_CLASS = value === 'true' ? 'highlighted' : '';
      } else if (key.endsWith('_COLOR')) {
        // Basic validation for hex color codes
        if (/^[0-9A-F]{3,6}$/i.test(value)) {
          const cssVar = `--${param.replace(/_/g, '-')}`;
          dynamicStyles += `${cssVar}: #${value};\n`;
        }
      } else {
        templateData[key] = he.encode(value); // Sanitize all other text inputs
      }
    }
  }
  return { templateData, dynamicStyles };
}

const app = express();

// A single, dynamic endpoint for all snippets
app.get('/:snippetName', async (req, res) => {
  const { snippetName } = req.params;
  const { token, ...queryParams } = req.query;

  const config = snippetConfig[snippetName];
  if (!config || !config.template) {
    return res.status(404).send(`Snippet '${snippetName}' not found.`);
  }

  const user = findUserByToken(token);
  const plan = user ? user.plan : 'free';

  const { templateData, dynamicStyles } = (plan === 'pro' && config.pro_params)
    ? processProParams(queryParams, config)
    : { templateData: { ...config.free }, dynamicStyles: '' };

  // Use process.cwd() for a reliable path to the project root on Vercel.
  const templatePath = path.join(process.cwd(), 'project', 'public', 'snippets', 'web-theme', config.template);

  try {
    const html = await fs.readFile(templatePath, 'utf8');

    let renderedHtml = html;
    for (const key in templateData) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      renderedHtml = renderedHtml.replace(regex, templateData[key]);
    }
    // Remove any un-replaced placeholders
    renderedHtml = renderedHtml.replace(/\{\{[A-Z_]+\}\}/g, '');

    if (dynamicStyles) {
      const styleTag = `<style>:root { ${dynamicStyles} }</style>`;
      renderedHtml = renderedHtml.replace('</head>', `${styleTag}</head>`);
    }
    res.setHeader('Content-Type', 'text/html');
    res.send(renderedHtml);
  } catch (err) {
    console.error(`Error rendering snippet '${snippetName}':`, err);
    return res.status(500).send('Error rendering snippet.');
  }
});

// Vercel handles the server creation, so we just need to export the app.
module.exports = app;
