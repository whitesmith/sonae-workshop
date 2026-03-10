import { beforeEach } from 'vitest';
import { store } from '../server/lib/store.js';

beforeEach(() => {
  store.reset();
});
