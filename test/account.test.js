const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const expect = chai.expect;
const fs = require('fs');

chai.use(chaiHttp);

describe('Accounts API', () => {
  it('should accept algorand address and add to watcher list', async () => {
    fs.openSync('watcherList.json', 'w');
    const res = await chai
      .request(app)
      .post(
        '/accounts/2UBZKFR6RCZL7R24ZG327VKPTPJUPFM6WTG7PJG2ZJLU234F5RGXFLTAKA'
      );
    expect(res).to.have.status(200);
    expect(res.body.message).to.be.equal('Account information stored.');
  });

  it('should throw error while accepting algorand address', async () => {
    const res = await chai.request(app).post('/accounts/WRONG-ADDRESS');
    expect(res).to.have.status(500);
  });

  it('should list all tracked accounts and their states', async () => {
    const res = await chai.request(app).get('/tracked-accounts');
    expect(res).to.have.status(200);
    expect(res.body.data).to.be.an('array');
  });

  it('should log a notifications when a change in the balance of a watched account is detected,', async () => {
    const res = await chai.request(app).get('/tracked-accounts/balance-change');
    expect(res).to.have.status(200);
  });

  it('should check the state of each account in the watcher list', async () => {
    const res = await chai.request(app).get('/tracked-accounts/balance-change');
    expect(res).to.have.status(200);
  });
});
