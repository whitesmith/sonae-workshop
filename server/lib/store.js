class Store {
  constructor() {
    this.reset();
  }

  reset() {
    this.cart = { items: [], discount: null };
    this.favorites = [];
  }
}

export const store = new Store();
