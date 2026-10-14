export * from './rbm.schema';
export * from './rbm.serializer';
export * from './rbm.parser';

import { Block } from './rbm.schema';
import { isRbmCell, parseRbm } from './rbm.parser';

export function getBlocks(value: any): Block[] | null {
  if (!value) return null;
  if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && 'type' in value[0]) {
    return value as Block[];
  }
  if (typeof value === 'string' && isRbmCell(value)) {
    return parseRbm(value);
  }
  return null;
}
