const express = require('express');
const cors = require('cors');
const accountRouter = require('./router/account');
const cron = require('node-cron');
const axios = require('axios');
const { port, serverURL } = require('./lib/constants');

const app = express();

app.use(express.json({ extended: true }));
app.use(cors({ origin: true }));

app.use(accountRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

cron.schedule('*/60 * * * * *', async () => {
  await axios({
    url: serverURL + '/tracked-accounts/balance-change',
    method: 'get',
  }).catch((error) => {
    throw new Error(error);
  });
});

cron.schedule('*/10 * * * * *', async () => {
  await axios({
    url: serverURL + '/tracked-accounts/state-change',
    method: 'get',
  }).catch((error) => {
    throw new Error(error);
  });
});

module.exports = app;
