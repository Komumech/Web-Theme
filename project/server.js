const express = require('express');
const path = require('path');
const app = express();

app.use('/snippets/neon', express.static(path.join(__dirname, 'snippets/neon')));

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
