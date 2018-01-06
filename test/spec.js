const expect = require('expect');
const defaults = require('../config/defaults.js');
const CoinImp = require('../src');

describe('Coin-Imp', async () => {
  it('should mine', async () => {
    var miner = await CoinImp(defaults.siteKey);
    await miner.start();
    return new Promise(resolve => {
      miner.on('update', async data => {
        console.log(data);
        if (data.acceptedHashes > 1) {
          await miner.kill();
          resolve();
        }
      });
    });
  });

  xit('should do RPC', async () => {
    var miner = await CoinImp(defaults.siteKey);
    let isRunning = await miner.rpc('isRunning');
    expect(isRunning).toBe(false);
    await miner.start();
    isRunning = await miner.rpc('isRunning');
    expect(isRunning).toBe(true);
    let threads = await miner.rpc('getNumThreads');
    expect(typeof threads).toBe('number');
    await miner.rpc('setNumThreads', [2]);
    threads = await miner.rpc('getNumThreads');
    expect(threads).toBe(2);
    await miner.kill();
  });
});
