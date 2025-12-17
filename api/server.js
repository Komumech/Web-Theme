const he = require('he');
const express = require('express');
const fs = require('fs').promises;
const path = require('path');

// --- Mock Database ---
const users = {
  "abc123_free_token": { id: 1, name: "Free User", plan: "free" },
  "xyz789_pro_token": { id: 2, name: "Pro User", plan: "pro" },
};

function findUserByToken(token) {
  return users[token];
}
// --- End Mock Database ---

// --- Snippet Configuration ---
// Now that snippetConfig.js is in the same folder:
const snippetConfig = require('./snippetConfig');
// --- End Snippet Configuration ---

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
        if (/^[0-9A-F]{3,6}$/i.test(value)) {
          const cssVar = `--${param.replace(/_/g, '-')}`;
          dynamicStyles += `${cssVar}: #${value};\n`;
        }
      } else {
        templateData[key] = he.encode(value);
      }
    }
  }
  return { templateData, dynamicStyles };
}

const app = express();

app.get('/:snippetName', async (req, res) => {
  const { snippetName } = req.params;
  const { token, ...queryParams } = req.query;

  if (!snippetName) {
    return res.status(400).send('Bad Request: Snippet name is required.');
  }

  const config = snippetConfig[snippetName];
  if (!config || !config.template) {
    return res.status(404).send(`Snippet '${snippetName}' not found.`);
  }

  const user = findUserByToken(token);
  const plan = user ? user.plan : 'free';

  const { templateData, dynamicStyles } = (plan === 'pro' && config.pro_params)
    ? processProParams(queryParams, config)
    : { templateData: { ...config.free }, dynamicStyles: '' };

  // Detect if rootDirectory is set to "project" in vercel.json
  const baseDir = process.env.VERCEL_ROOT_DIRECTORY === 'project'
    ? process.cwd()
    : path.join(process.cwd(), 'project');

  const templatePath = path.join(baseDir, 'public', 'snippets', 'web-theme', config.template);

  try {
    console.log('Looking for template at:', templatePath);
    const html = await fs.readFile(templatePath, 'utf8');
    let renderedHtml = html;

    for (const key in templateData) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      renderedHtml = renderedHtml.replace(regex, templateData[key]);
    }
    renderedHtml = renderedHtml.replace(/\{\{[A-Z_]+\}\}/g, '');

    if (dynamicStyles && renderedHtml.includes('</head>')) {
      const styleTag = `<style>:root { ${dynamicStyles} }</style>`;
      renderedHtml = renderedHtml.replace('</head>', `${styleTag}</head>`);
    }

    res.setHeader('Content-Type', 'text/html');
    res.send(renderedHtml);
  } catch (err) {
    console.error(`Error rendering snippet '${snippetName}' at ${templatePath}:`, err);
    return res.status(500).send('Error rendering snippet.');
  }
});

module.exports = app;
