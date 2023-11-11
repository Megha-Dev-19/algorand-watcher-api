# Algorand Watcher API

This repository contains a Node.js application with an Express API that allows users to track Algorand accounts and receive notifications when the state or balance of the tracked accounts changes.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Megha-Dev-19/algorand-watcher-api.git
   cd algorand-watcher-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

## Usage

### Add an Algorand Account to the Watcher List

```bash
POST /accounts/:address
```

Add an Algorand account to the watcher list. If the account is already in the list, a success message is returned.

### Check State Change of Tracked Accounts

```bash
GET /tracked-accounts/state-change
```

Check if the state of any tracked accounts has changed. If a change is detected, a notification is logged.

### Check Balance Change of Tracked Accounts

```bash
GET /tracked-accounts/balance-change
```

Check if the balance of any tracked accounts has changed. If a change is detected, a notification is logged.

### List Tracked Accounts

```bash
GET /tracked-accounts
```

Retrieve a list of all tracked accounts with their state information.

## Deployment

To deploy the Algorand Watcher API, follow these steps:

1. **Choose a Hosting Provider:**
   - Select a hosting provider such as AWS, Heroku, or DigitalOcean.

2. **Build and Deploy:**
   - Build and deploy the application to your chosen hosting provider.
   - Refer to the documentation of your hosting provider for specific deployment instructions.

## Tests

```bash
npm test
```

Run tests to ensure the proper functioning of the API.

Note: This project runs a cron to execute state change and balance change APIs every 60 seconds.
