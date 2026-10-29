// T4CTILE hooks: Food Hub's "ready" for a kiosk order lights its number on the waiting screen.
import type { AppHooks } from '../hooks';
import { markReadyFromSuite } from './kiosk';

export const hooks: AppHooks = {
  async onSuiteEvent(e) {
    if (e.type !== 'order.status_changed') return;
    const o = e.data?.order ?? {};
    await markReadyFromSuite(o.cloverOrderId, o.cloverMerchantId, String(o.status ?? ''));
  },
};
