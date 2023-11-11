const { default: axios } = require('axios');
const fs = require('fs');
const { testnetIndexerURL } = require('./constants');

function getWatcherList() {
  const watcherList = fs.readFileSync('watcherList.json', 'utf8');
  return JSON.parse(watcherList || '[]');
}

function getWatcherState() {
  const watcherState = fs.readFileSync('watcherState.json', 'utf8');
  return JSON.parse(watcherState || '[]');
}

function getWatcherBalance() {
  const watcherBalance = fs.readFileSync('watcherBalance.json', 'utf8');
  return JSON.parse(watcherBalance || '[]');
}

async function getAccountInformation(address) {
  return (
    await axios({
      url: testnetIndexerURL + `/accounts/${address}`,
      method: 'get',
    }).catch((error) => {
      throw new Error('Invalid algorand account address.');
    })
  )?.data?.account;
}

module.exports = {
  getWatcherList,
  getWatcherState,
  getWatcherBalance,
  getAccountInformation,
};
