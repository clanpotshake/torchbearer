// SPDX-FileCopyrightText: 2021 Johannes Loher
// SPDX-FileCopyrightText: 2021 Oliver Rümpelein
//
// SPDX-License-Identifier: MIT

import { getGame } from '../helpers';

/**
 * Provides default values for all arguments the `CheckFactory` expects.
 */
class DefaultCheckOptions implements TBCheckFactoryOptions {
  readonly takeCheck: boolean = false;
  readonly useTrait: boolean = false;
  readonly channelNature: boolean = false;
  readonly successMod: number = 0;
  readonly purchasedDice: number = 0;
  readonly helpAndGear: number = 0;
  readonly applyBulky: boolean = false;
  readonly applyWeary: boolean = false;
  readonly applyHometown: boolean = false;

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
  constructor(
    private obstacle: number,
    private diePool: number,
    options: Partial<TBCheckFactoryOptions> = {},
  ) {
    this.options = defaultCheckOptions.mergeWith(options);
  }

  private options: TBCheckFactoryOptions;

  async execute(): Promise<ChatMessage | undefined> {
    const innerFormula = [`${this.obstacle}d6`].filterJoin('');
    // const innerFormula = ['ds', this.createCheckTargetNumberModifier()].filterJoin('');
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
}

/**
 * Asks the user for all unknown/necessary information and passes them on to perform a roll.
 * @param checkTargetNumber - The Check Target Number ("CTN")
 * @param options           - Options changing the behavior of the roll and message.
 */
export async function createTestRoll(
  checkTargetNumber: number,
  options: Partial<TBCheckFactoryOptions> = {},
): Promise<ChatMessage | unknown> {
  // Ask for additional required data;
  const gmModifierData = await askGmModifier(checkTargetNumber, options);

  const newTargetValue = checkTargetNumber;
  const gmModifier = gmModifierData.obstacle ?? 0;
  const newOptions: Partial<TBCheckFactoryOptions> = {
    applyBulky: options.applyBulky,
    applyHometown: options.applyHometown,
    applyWeary: options.applyWeary,
    channelNature: options.channelNature,
    helpAndGear: options.helpAndGear,
    purchasedDice: options.purchasedDice,
    successMod: options.successMod,
    takeCheck: options.takeCheck,
    useTrait: options.useTrait,
    rollMode: gmModifierData.rollMode ?? options.rollMode,
    flavor: options.flavor,
    flavorData: options.flavorData,
    speaker: options.speaker,
  };

  // Create Factory
  const cf = new CheckFactory(newTargetValue, gmModifier, newOptions);

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
async function askGmModifier(
  checkTargetNumber: number,
  options: Partial<TBCheckFactoryOptions> = {},
  { template, title }: { template?: string; title?: string } = {},
): Promise<Partial<DiceRollInfo>> {
  const usedTemplate = template ?? 'systems/torchbearer/templates/dialogs/roll-options.hbs';
  const usedTitle = title ?? getGame().i18n.localize('TB2.DialogRollOptionsDefaultTitle');
  const templateData = {
    title: usedTitle,
    checkTargetNumber: checkTargetNumber,
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
  // const chosenCheckTargetNumber = parseInt(formData['check-target-number']?.value);
  // const chosenGMModifier = parseInt(formData['gm-modifier']?.value);
  const chosenRollMode = formData['roll-mode']?.value;
  const chosenApplyBulky = formData['apply-bulky']?.value;
  const chosenApplyHometown = formData['apply-hometown']?.value;
  const chosenApplyWeary = formData['apply-weary']?.value;
  const chosenHelpGear = formData['help-gear']?.value;
  const chosenMight = formData['might']?.value;
  const chosenPrecedence = formData['precedence']?.value;
  const chosenObstacle = formData['check-target-number']?.value;
  const chosenSkillRank = formData['skill-rank']?.value;
  const chosenSuccessMod = formData['success-mod']?.value;
  const chosenTraitCheck = formData['check-trait']?.value;
  const chosenTraitHelp = formData['help-trait']?.value;
  const chosenPersonaDice = formData['persona-buy']?.value;

  return {
    applyBulky: chosenApplyBulky,
    applyHometown: chosenApplyHometown,
    applyWeary: chosenApplyWeary,
    helpGear: chosenHelpGear,
    might: chosenMight,
    obstacle: chosenObstacle,
    purchasedDice: chosenPersonaDice,
    precedence: chosenPrecedence,
    skillRank: chosenSkillRank,
    successMod: chosenSuccessMod,
    traitCheck: chosenTraitCheck,
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
  might: number;
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
  takeCheck: boolean;
  useTrait: boolean;
  channelNature: boolean;
  purchasedDice: number; // dice purchased with persona
  successMod: number;
  helpAndGear: number;
  applyBulky: boolean;
  applyWeary: boolean;
  applyHometown: boolean;
  rollMode: foundry.CONST.DiceRollMode;
  flavor?: string;
  flavorData?: Record<string, string | number | null>;
  speaker?: ReturnType<typeof ChatMessage.getSpeaker>;
}
