export class Subscriber {
  private observers: Set<any>;
  public value: null;
  public subscribed: boolean;
  public subscribeOnce: boolean;

  constructor(subscribeOnce: boolean = false) {
    this.observers = new Set();
    this.value = null;
    this.subscribed = false;
    this.subscribeOnce = subscribeOnce;
  }

  subscribe(value = null): void {
    if (this.subscribeOnce && this.subscribed) {
      return;
    }
    this.value = value;
    this.subscribed = true;
    this.observers.forEach(observer => observer(this.value));
  }

  observedBy(observer: CallableFunction): void {
    if (this.subscribed) {
      observer(this.value);
    }
    this.observers.add(observer);
  }
}

