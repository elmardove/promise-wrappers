const one = true;
const two = true;
const tri = true;
const interrupt = false;

/**
 * DynamicPromise definition
 */
class DynamicPromise {
  constructor() { this.dynamicPromise = Promise.resolve(); }

  addThen(fn) {
    this.dynamicPromise = this.dynamicPromise.then(fn);
    return this;
  }

  addThenIf(fn, condition) {
    if (condition) this.addThen(fn);
    return this;
  }

  addCatch(fn) {
    this.dynamicPromise = this.dynamicPromise.catch(fn);
    return this;
  }

  addCatchIf(fn, condition) {
    if (condition) this.addCatch(fn);
    return this;
  }

  then(fn) { return this.dynamicPromise.then(fn); }

  catch(fn) { return this.dynamicPromise.catch(fn); }

  toPromise() { return this.dynamicPromise; }
}


/**
 * DynamicPromise usage with if statement
 */
const dynamicPromise = new DynamicPromise();
if (one) dynamicPromise.addThen(() => console.log('ONE'));
if (two) dynamicPromise.addThen(() => console.log('TWO'));
if (tri) dynamicPromise.addThen(() => console.log('THREE'));

/**
 * DynamicPromise usage with addThenIf
 */
new DynamicPromise()
    .addThenIf(() => console.log('ONE with addThenIf'), one)
    .addThenIf(() => console.log('TWO with addThenIf'), two)
    .addThenIf(() => console.log('THREE with addThenIf'), tri)
    .then(() => console.log('DynamicPromise unwrap Promise here'));


/**
 * InterruptibleDynamicPromise definition
 */
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


/**
 * InterruptibleDynamicPromise usage with internal interruption
 */
new InterruptibleDynamicPromise()
    .addThen((flow) => {
      console.log(`ONE interruptible, interruption here expected: ${interrupt}`);
      if (interrupt) flow.stop();
    })
    .addThen(() => console.log('TWO interruptible'));


/**
 * InterruptibleDynamicPromise usage with external interruption
 * store flow to variable
 */
let interruptibleDynamicPromiseFlow;
new InterruptibleDynamicPromise()
    .addThen((flow) => {
      console.log(`ONE interruptible external with flow, interruption here expected: ${interrupt}`);
      interruptibleDynamicPromiseFlow = flow;
    })
    .addThen(() => new Promise(resolve => setTimeout(resolve, 200)))
    .addThen((flow) => console.log('TWO interruptible external with flow'));

setTimeout(() => interrupt ? interruptibleDynamicPromiseFlow.stop() : true, 100);

/**
 * InterruptibleDynamicPromise usage with external interruption
 * store instance to variable
 */
const interruptibleDynamicPromise = new InterruptibleDynamicPromise();

interruptibleDynamicPromise
    .addThen(() => console.log(`ONE interruptible external with instance, interruption here expected: ${interrupt}`))
    .addThen(() => new Promise(resolve => setTimeout(resolve, 200)))
    .addThen(() => console.log('TWO interruptible external with instance'));

setTimeout(() => interrupt ? interruptibleDynamicPromise.stop() : true, 100);
