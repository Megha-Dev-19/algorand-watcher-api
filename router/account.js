const express = require('express');
const router = new express.Router();
const fs = require('fs');
const _ = require('lodash');
const {
  getWatcherList,
  getAccountInformation,
  getWatcherState,
  getWatcherBalance,
} = require('../lib/common');

router.post('/accounts/:address', async (req, res) => {
  try {
    const watcherList = getWatcherList();
    const address = req.params.address;
    const addressAlreadyExists = watcherList.includes(address);
    if (addressAlreadyExists) {
      res.status(200).json({
        success: true,
        message: 'Account already exists in watcher list.',
      });
      return;
    }
    // verify that account is valid
    const accountData = await getAccountInformation(address).catch((error) => {
      throw new Error(error);
    });
    const updatedList = [...watcherList, address];

    fs.writeFile(
      'watcherList.json',
      JSON.stringify(updatedList, null, 2),
      (err) => {
        if (err) throw new Error(err);
      }
    );
    res
      .status(200)
      .json({ success: true, message: 'Account information stored.' });
  } catch (error) {
    console.error(
      'Error occured while accepting Algorand address:',
      error.message
    );
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.get('/tracked-accounts/state-change', async (req, res) => {
  try {
    const watcherState = getWatcherState();
    const watcherList = getWatcherList();
    const data = [];
    // using watcher list to make sure we fetch for all the latest addresses added to list
    for (const address of watcherList) {
      const accountData = await getAccountInformation(address).catch(
        (error) => {
          throw new Error(error);
        }
      );
      data.push(accountData);
    }

    for (const account of data) {
      const lastState = watcherState?.find(
        (b) => b.address === account.address
      );
      if (
        lastState &&
        !_.isEqual(account['apps-local-state'], lastState['apps-local-state'])
      ) {
        console.log(`Account ${account.address} state has changed.`);
      }
    }
    // if we expect the size of watcher list to increase we can move to different storage options like Database or Persistent Storage, Caching System
    fs.writeFile('watcherState.json', JSON.stringify(data, null, 2), (err) => {
      if (err) throw new Error(err);
    });
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error(
      'Error occured while checking state of tracked accounts:',
      error.message
    );
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.get('/tracked-accounts/balance-change', async (req, res) => {
  try {
    const watcherBalance = getWatcherBalance();
    const watcherList = getWatcherList();
    const data = [];
    // using watcher list to make sure we fetch for all the latest addresses added to list
    for (const address of watcherList) {
      const accountData = await getAccountInformation(address).catch(
        (error) => {
          throw new Error(error);
        }
      );
      data.push({ address: accountData.address, amount: accountData.amount });
    }

    for (const account of data) {
      const lastState = watcherBalance?.find(
        (b) => b.address === account.address
      );
      if (lastState && !_.isEqual(account.amount, lastState.amount)) {
        console.log(
          `Notification: Account ${account.address} balance has changed from ${lastState.amount} to ${account.amount}`
        );
      }
    }

    // if we expect the size of watcher list to increase we can move to different storage options like Database or Persistent Storage, Caching System
    fs.writeFile(
      'watcherBalance.json',
      JSON.stringify(data, null, 2),
      (err) => {
        if (err) throw new Error(err);
      }
    );
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error(
      'Error occured while checking balance of tracked accounts:',
      error.message
    );
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.get('/tracked-accounts', async (req, res) => {
  try {
    const watcherList = getWatcherList();
    const data = [];
    for (const item of watcherList) {
      const accountData = await getAccountInformation(item).catch((error) => {
        throw new Error(error);
      });
      data.push(accountData);
    }
    res.status(200).json({
      success: true,
      message: 'Watcher List retrieved.',
      data: data,
    });
  } catch (error) {
    console.error(
      'Error occured while listing tracked accounts:',
      error.message
    );
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
