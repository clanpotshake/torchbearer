import { TB } from '../config';
import { getGame } from '../helpers';

export default function registerSetupHooks(): void {
  Hooks.once('setup', () => {
    localizeAndSortConfig();
  });
}

function localizeAndSortConfig() {
  const nosort = [''];
  const localizeObject = <T extends { [s: string]: string }>(obj: T, sort = true): T => {
    const localized = Object.entries(obj).map(([key, value]): [string, string] => {
      return [key, getGame().i18n.localize(value)];
    });
    if (sort) localized.sort((a, b) => a[1].localeCompare(b[1]));
    return Object.fromEntries(localized) as T;
  };

  TB.i18n = Object.fromEntries(
    Object.entries(TB.i18n).map(([key, value]) => {
      return [key, localizeObject(value, !nosort.includes(key))];
    }),
  ) as typeof TB.i18n;
}
