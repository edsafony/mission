const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', require('./routes/health'));
app.use('/api/mission', require('./routes/mission'));
app.use('/api/roles', require('./routes/roles'));
app.use('/api/weeks', require('./routes/weeks'));

module.exports = app;

if (require.main === module) {
  require('./db');
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
