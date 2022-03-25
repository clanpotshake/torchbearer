import { TBItem } from '../item/TBItem';
import { utilities } from '../util/utilities';
import { AllSlots, SlotType, TB } from '../config';

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
  allSlots: (): SlotType[] => AllSlots,
  ifIn: (input: Array<unknown> | null | undefined, elem: unknown): boolean =>
    input?.includes(elem) || false,
  times: (input: number, repeatMe: string | null | undefined): string => {
    logger.info(`in times with, repeating ${repeatMe} ${input} times`);
    return repeatMe?.repeat(input) || '';
  },
  compareItemSlot: (input: SlotType | undefined, slot: SlotType): boolean => {
    logger.info(`item is in slot ${input}, comparing against ${slot}`);
    return input !== undefined || input === slot;
  },
};
