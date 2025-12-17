// snippet-server/server.js

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
const snippetConfig = require('../snippet-server/snippetConfig');
// --- End Snippet Configuration ---


const app = express();

// A single, dynamic endpoint for all snippets
app.get('/render/:snippetName', async (req, res) => {
  const { snippetName } = req.params;
  const { token, ...queryParams } = req.query;

  const config = snippetConfig[snippetName];
  if (!config) {
    return res.status(404).send(`Snippet '${snippetName}' not found.`);
  }

  const user = findUserByToken(token);
  const plan = user ? user.plan : 'free';

  let templateData = {};
  let dynamicStyles = '';

  if (plan === 'pro') {
    templateData = { ...config.pro };
    for (const param of config.pro_params) {
      if (queryParams[param]) {
        const key = param.toUpperCase();
        const value = queryParams[param];

        if (key === 'FEATURES') {
          templateData.FEATURES_LIST = value.split(',')
            .map(f => `<li><i class="fas fa-check-circle"></i> ${f.trim()}</li>`)
            .join('\n');
        } else if (key === 'HIGHLIGHTED') {
          templateData.HIGHLIGHT_CLASS = value === 'true' ? 'highlighted' : '';
        } else if (key.endsWith('_COLOR')) {
          const cssVar = `--${param.replace(/_/g, '-')}`;
          dynamicStyles += `${cssVar}: #${value};\n`;
        } else {
          templateData[key] = value;
        }
      }
    }
  } else {
    templateData = { ...config.free };
  }

  // Construct path relative to the current file's directory for robustness.
  const templatePath = path.join(__dirname, '..', 'project', 'public', 'snippets', 'web-theme', config.template);

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
    console.error("Error reading template file:", err);
    return res.status(500).send('Error rendering snippet.');
  }
});

// Vercel handles the server creation, so we just need to export the app.
module.exports = app;
