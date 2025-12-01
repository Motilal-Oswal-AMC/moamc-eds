// code move to Script
import { initObserver } from '../../scripts/scripts.js';
import decodeblock from '../decoding-qglp/decoding-qglp.js';

export default function decorate(block) {
  initObserver(block, () => {
    decodeblock(block);
  });
}
