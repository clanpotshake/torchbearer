// SPDX-FileCopyrightText: 2021 Johannes Loher
// SPDX-FileCopyrightText: 2021 Oliver Rümpelein
//
// SPDX-License-Identifier: MIT

import { getGame } from '../helpers';
import { utilities } from '../util/utilities';
import { TBRoll } from './TBRoll';

/**
 * Provides default values for all arguments the `CheckFactory` expects.
 */
class DefaultCheckOptions implements TBCheckFactoryOptions {
  readonly dicePool: number = 0;
  readonly obstacle: number = 0;
  readonly beginnersLuck: boolean = false;
  readonly successMod: number = 0;

  readonly rollMode: foundry.CONST.DiceRollMode = 'roll';
  readonly flavor: undefined;

  mergeWith(other: Partial<TBCheckFactoryOptions>): TBCheckFactoryOptions {
    return { ...this, ...other };
  }
}

/**
 * Singleton reference for default value extraction.
 */
const defaultCheckOptions = new DefaultCheckOptions();

/**
 * Most basic class responsible for generating the chat formula and passing it to the chat as roll.
 */
class CheckFactory {
  constructor(options: Partial<TBCheckFactoryOptions> = {}) {
    this.options = defaultCheckOptions.mergeWith(options);
  }

  private options: TBCheckFactoryOptions;

  async execute(): Promise<ChatMessage | undefined> {
    logger.info('executing roll...', this.options);
    const innerFormula = this.rollFormula();
    logger.info('formula is', innerFormula);
    // TODO roll.create is breaking on the formula, defaulting to 1d
    const roll = Roll.create(innerFormula);
    const speaker = this.options.speaker ?? ChatMessage.getSpeaker();
    return roll.toMessage(
      {
        speaker,
        flavor: this.options.flavor,
        flags: this.options.flavorData
          ? { tb: { flavorData: this.options.flavorData } }
          : undefined,
      },
      { rollMode: this.options.rollMode, create: true },
    );
  }
  private rollFormula(): string {
    const diePool = this.options.dicePool;
    // const successes =
    //   this.options.successMod >= 0 ? `+${this.options.successMod}` : `${this.options.successMod}`;
    // TODO need to parse results manually before applying successes
    return `${diePool}ds`;
  }
}

/**
 * Asks the user for all unknown/necessary information and passes them on to perform a roll.
 * @param skillName
 * @param skillRank - The Actor's rating in the rolling skill
 * @param nature
 * @param might
 * @param precedence
 * @param options   - Options changing the behavior of the roll and message.
 */
export async function createTestRoll(
  skillName: string,
  skillRank: number,
  nature: number,
  might: number,
  precedence: number,
  options: Partial<TBCheckFactoryOptions> = {},
): Promise<ChatMessage | unknown> {
  // Ask for additional required data;
  const dialogOptions = await askRollOptions(
    skillName,
    skillRank,
    nature,
    might,
    precedence,
    options,
  );
  function add(accumulator: number, a: number) {
    return accumulator + a;
  }

  // Total up the dice for the ability, wises, help, supplies and gear,
  // divide that by half and round up.
  // Then add traits, persona points, channeled Nature, the fresh condition and any
  // other special or magic bonus dice.
  // If an ability is at zero due to injury or sickness, you cannot test it using
  // Beginner’s Luck. You must roll your Nature until you’ve recovered.
  const luckFactor = dialogOptions.luck ? 0.5 : 1.0;
  const skill = dialogOptions.skillRank ?? 0; // if luck, skillrank is ability rank
  const help = dialogOptions.helpGear ?? 0;
  const luckPool = Math.ceil((skill + help) * luckFactor);
  const traitDie = dialogOptions.traitHelp ? 1 : dialogOptions.traitCheck ? -1 : 0;
  const freshDie = dialogOptions.fresh ? 1 : 0;
  const personaDie = dialogOptions.purchasedDice ?? 0;
  const natureDice = dialogOptions.nature ?? 0;
  const successMod = dialogOptions.successMod ?? 0;
  // TODO bulky et al only apply to specific skill tests, not yet implemented

  const finalDicePool = [luckPool, traitDie, freshDie, personaDie /* , natureDice */].reduce(
    add,
    0,
  );

  const newOptions: Partial<TBCheckFactoryOptions> = {
    dicePool: finalDicePool,
    obstacle: dialogOptions.obstacle ?? 0,
    successMod: successMod,
    beginnersLuck: dialogOptions.luck ?? false,
    rollMode: dialogOptions.rollMode ?? dialogOptions.rollMode,
    flavor: options.flavor,
    flavorData: options.flavorData,
    speaker: options.speaker,
  };

  // Create Factory
  const cf = new CheckFactory(newOptions);

  // Possibly additional processing

  // Execute roll
  return cf.execute();
}

/**
 * Responsible for rendering the modal interface asking for the modifier
 * specified by GM and (currently) additional data.
 *
 * @returns The data given by the user.
 */
async function askRollOptions(
  skillName: string,
  skillRank: number,
  nature: number,
  might: number,
  precedence: number,
  options: Partial<TBCheckFactoryOptions> = {},
  { template, title }: { template?: string; title?: string } = {},
): Promise<Partial<DiceRollInfo>> {
  const usedTemplate = template ?? 'systems/torchbearer/templates/dialogs/roll-options.hbs';
  const nString = utilities.startsWithVowel(skillName) ? 'n' : '';

  const fullTitle = utilities.interpolate(
    getGame().i18n.localize('TB2.DialogRollOptionsDefaultTitle'),
    nString,
    [skillName],
  );
  const usedTitle = title ?? fullTitle;
  const templateData = {
    title: usedTitle,
    skillRank: skillRank,
    nature: nature,
    might: might,
    precedence: precedence,
    rollMode: options.rollMode ?? getGame().settings.get('core', 'rollMode'),
    rollModes: CONFIG.Dice.rollModes,
  };
  const renderedHtml = await renderTemplate(usedTemplate, templateData);

  const dialogPromise = new Promise<HTMLFormElement>((resolve) => {
    new Dialog({
      title: usedTitle,
      content: renderedHtml,
      buttons: {
        ok: {
          icon: '<i class="fas fa-check"></i>',
          label: getGame().i18n.localize('TB2.GenericOkButton'),
          callback: (html) => {
            if (!('jquery' in html)) {
              throw new Error(
                getGame().i18n.format('TB2.ErrorUnexpectedHtmlType', {
                  exType: 'JQuery',
                  realType: 'HTMLElement',
                }),
              );
            } else {
              const innerForm = html[0]?.querySelector('form');
              if (!innerForm) {
                throw new Error(
                  getGame().i18n.format('TB2.ErrorCouldNotFindHtmlElement', {
                    htmlElement: 'form',
                  }),
                );
              }
              resolve(innerForm);
            }
          },
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: getGame().i18n.localize('TB2.GenericCancelButton'),
        },
      },
      default: 'ok',
    }).render(true);
  });
  const dialogForm = await dialogPromise;
  return parseDialogFormData(dialogForm);
}

/**
 * Extracts Dialog data from the returned DOM element.
 * @param formData - The filled dialog
 */
function parseDialogFormData(formData: HTMLFormElement): Partial<DiceRollInfo> {
  function handyParse(input: number | string | undefined | null, radix: number): number {
    if (!input) return 0;
    if (typeof input === 'number') return input;
    return parseInt(input, radix);
  }
  const chosenRollMode = formData['roll-mode']?.value;
  // TODO this is "on" and not a boolean
  const chosenApplyBulky = formData['apply-bulky']?.value;
  const chosenApplyHometown = formData['apply-hometown']?.value;
  const chosenApplyWeary = formData['apply-weary']?.value;
  const chosenHelpGear = handyParse(formData['help-gear']?.value, 10);
  const chosenMight = handyParse(formData['might']?.value, 10);
  const chosenPrecedence = handyParse(formData['precedence']?.value, 10);
  const chosenObstacle = handyParse(formData['check-target-number']?.value, 10);
  const chosenSkillRank = handyParse(formData['skill-rank']?.value, 10);
  const chosenSuccessMod = handyParse(formData['success-mod']?.value, 10);
  let chosenTraitHelp = false;
  switch (formData['use-trait']?.value) {
    case 'help':
      chosenTraitHelp = true;
      break;
    case 'check':
    case 'none':
      chosenTraitHelp = false;
      break;
  }
  const chosenPersonaDice = handyParse(formData['persona-buy']?.value, 10);
  const chosenFresh = formData['fresh-die']?.value;
  const chosenLuck = formData['luck-roll']?.value;
  // TODO this is NaN
  const chosenNature = handyParse(formData['nature-channel']?.value, 10);

  return {
    applyBulky: chosenApplyBulky,
    applyHometown: chosenApplyHometown,
    applyWeary: chosenApplyWeary,
    helpGear: chosenHelpGear,
    fresh: chosenFresh,
    luck: chosenLuck,
    nature: chosenNature,
    might: chosenMight,
    obstacle: chosenObstacle,
    purchasedDice: chosenPersonaDice,
    precedence: chosenPrecedence,
    skillRank: chosenSkillRank,
    successMod: chosenSuccessMod,
    traitCheck: false, // TODO how this behaves depends on the kind of roll
    traitHelp: chosenTraitHelp,
    rollMode: Object.values(CONST.DICE_ROLL_MODES).includes(chosenRollMode)
      ? chosenRollMode
      : undefined,
  };
}

/**
 * Contains data that needs retrieval from an interactive Dialog.
 */
interface DiceRollInfo {
  obstacle: number;
  skillRank: number;
  nature: number;
  might: number;
  luck: boolean;
  fresh: boolean;
  purchasedDice: number;
  precedence: number;
  helpGear: number;
  traitHelp: boolean;
  traitCheck: boolean;
  successMod: number;
  applyBulky: boolean;
  applyWeary: boolean;
  applyHometown: boolean;
  rollMode: foundry.CONST.DiceRollMode;
}

/**
 * The minimum behavioral options that need to be passed to the factory.
 */
export interface TBCheckFactoryOptions {
  dicePool: number;
  obstacle: number;
  beginnersLuck: boolean;
  successMod: number;
  rollMode: foundry.CONST.DiceRollMode;
  flavor?: string;
  flavorData?: Record<string, string | number | null>;
  speaker?: ReturnType<typeof ChatMessage.getSpeaker>;
}
