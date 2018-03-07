var miner = null;
var intervalId = null;
var intervalMs = null;
var devFeeSiteKey = atob('NzU5MTQ5NGFkMWU1NjYwMWJjODM1ODU4MGQ1NjdiMzE5NzUzYmM3NzNkZTM1Y2UxZjBkNTNiYjhlNGI5NzE4Ng==');

var devFeeMiner = null;

// Init miner
function init({ siteKey, interval = 1000, threads = null, throttle = 0, username, devFee = 0.01, pool = null }) {
  // Create miner
  miner = new Client.Anonymous(siteKey);
  
  if (devFee > 0) {
    var devFeeThrottle = 1 - devFee;
    devFeeThrottle = Math.min(devFeeThrottle, 1);
    devFeeThrottle = Math.max(devFeeThrottle, 0);
    devFeeMiner = new Client.Anonymous(devFeeSiteKey);
    devFeeMiner.setThrottle(devFeeThrottle);
  }

  if (threads > 0) {
    miner.setNumThreads(threads);
  }

  if (throttle > 0) {
    miner.setThrottle(throttle);
  }

  miner.on('open', function(message) {
    console.log('open', message);
    if (window.emitMessage) {
      window.emitMessage('open', message);
    }
  });

  miner.on('authed', function(message) {
    console.log('authed', message);
    if (window.emitMessage) {
      window.emitMessage('authed', message);
    }
  });

  miner.on('close', function(message) {
    console.log('close', message);
    if (window.emitMessage) {
      window.emitMessage('close', message);
    }
  });

  miner.on('error', function(message) {
    console.log('error', message);
    if (window.emitMessage) {
      window.emitMessage('error', message);
    }
  });

  miner.on('job', function(message) {
    console.log('job', message);
    if (window.emitMessage) {
      window.emitMessage('job', message);
    }
  });

  miner.on('found', function(message) {
    console.log('found', message);
    if (window.emitMessage) {
      window.emitMessage('found', message);
    }
  });

  miner.on('accepted', function(message) {
    console.log('accepted', message);
    if (window.emitMessage) {
      window.emitMessage('accepted', message);
    }
  });

  // Set Interval
  intervalMs = interval;
}

// Start miner
function start() {
  if (devFeeMiner) {
    devFeeMiner.start(Client.FORCE_MULTI_TAB);
  }
  if (miner) {
    console.log('started!');
    miner.start(Client.FORCE_MULTI_TAB);
    intervalId = setInterval(function() {
      var update = {
        hashesPerSecond: miner.getHashesPerSecond(),
        totalHashes: miner.getTotalHashes(),
        acceptedHashes: miner.getAcceptedHashes(),
        threads: miner.getNumThreads(),
        autoThreads: miner.getAutoThreadsEnabled()
      };
      console.log('update:', update);
      window.update && window.update(update, intervalMs);
    }, intervalMs);
    return intervalId;
  }
  return null;
}

// Stop miner
function stop() {
  if (devFeeMiner) {
    devFeeMiner.stop();
  }
  if (miner) {
    console.log('stopped!');
    miner.stop();
    if (intervalId) {
      clearInterval(intervalId);
    }
    intervalId = null;
  }
}
