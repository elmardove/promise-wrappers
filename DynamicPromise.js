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

module.exports = DynamicPromise;
