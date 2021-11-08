import { TBItem } from '../item/TBItem';
import { utilities } from '../util/utilities';

export default function registerHandlebarsHelpers(): void {
  Object.entries(utilities).forEach(([key, helper]) => Handlebars.registerHelper(key, helper));
  Object.entries(helpers).forEach(([key, helper]) => Handlebars.registerHelper(key, helper));
}
const helpers = {
  htmlToPlainText: (input: string | null | undefined): string | null | undefined => {
    if (!input) return;
    return $(input).text();
  },
  isEmpty: (input: Array<unknown> | null | undefined): boolean => (input?.length ?? 0) === 0,
  beginnersLuckAttributes: (): string[] => TBItem.beginnersLuckAttributes,
  ifIn: (input: Array<unknown> | null | undefined, elem: unknown): boolean =>
    input?.includes(elem) || false,
};
