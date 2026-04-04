const Trigger = require('../models/Trigger');
const payoutEngine = require('./payoutEngine');

/**
 * Simulated data feeds (in production: real APIs)
 */
const getSimulatedFeeds = () => ({
  uberUptime: 0.96 + Math.random() * 0.04,
  swiggyUptime: 0.94 + Math.random() * 0.05,
  rainfallMm: Math.random() * 30,
  demandIndex: 0.5 + Math.random() * 0.5,
  incomeDropPercent: Math.random() * 40
});

const evaluateTrigger = (trigger, feeds) => {
  switch (trigger.type) {
    case 'platform_downtime':
      return feeds.uberUptime < 0.95;
    case 'weather':
      return feeds.rainfallMm > 20;
    case 'income_drop':
      return feeds.incomeDropPercent > 30;
    case 'low_demand':
      return feeds.demandIndex < 0.5;
    default:
      return false;
  }
};

const runAll = async () => {
  try {
    const activeTriggers = await Trigger.find({ isActive: true, status: { $in: ['armed', 'monitoring'] } });
    const feeds = getSimulatedFeeds();

    console.log(`[TRIGGER MONITOR] Evaluating ${activeTriggers.length} triggers...`);

    for (const trigger of activeTriggers) {
      const shouldFire = evaluateTrigger(trigger, feeds);

      if (shouldFire) {
        console.log(`[TRIGGER FIRE] ${trigger.name} for user ${trigger.user}`);
        const result = await payoutEngine.executePayout({
          userId: trigger.user,
          triggerId: trigger._id,
          triggerType: trigger.type,
          platform: trigger.platform,
          amount: trigger.payoutAmount,
          description: `Auto-payout: ${trigger.name}`
        });

        if (result.success) {
          trigger.status = 'fired';
          trigger.lastFired = new Date();
          trigger.fireCount += 1;
          await trigger.save();
          // Re-arm after 30 min
          setTimeout(async () => {
            trigger.status = 'armed';
            await trigger.save();
          }, 30 * 60 * 1000);
        }
      }
    }
  } catch (err) {
    console.error('[TRIGGER MONITOR ERROR]', err.message);
  }
};

module.exports = { runAll, evaluateTrigger, getSimulatedFeeds };
