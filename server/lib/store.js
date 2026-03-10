class Store {
  constructor() {
    this.reset();
  }

  reset() {
    this.cart = { items: [], discount: null };
  }
}

export const store = new Store();
