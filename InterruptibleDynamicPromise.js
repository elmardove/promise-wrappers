/**
 * InterruptibleDynamicPromise definition
 */
const DynamicPromise = require('./DynamicPromise');

class InterruptibleDynamicPromise extends DynamicPromise {
  constructor() {
    super().continue = true;
    this.flow = {};
    this.flow.stop = this.stop.bind(this);
  }

  stop() { this.continue = false; }

  addThen(fn) {
    this.dynamicPromise = this.dynamicPromise.then(args => args || []).then(args => this.continue ? fn(this.flow, ...args) : false);
    return this;
  }
}

module.exports = InterruptibleDynamicPromise;
