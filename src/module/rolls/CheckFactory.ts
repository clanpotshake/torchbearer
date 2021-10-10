// SPDX-FileCopyrightText: 2021 Johannes Loher
// SPDX-FileCopyrightText: 2021 Oliver Rümpelein
//
// SPDX-License-Identifier: MIT

import { getGame } from '../helpers';

/**
 * Provides default values for all arguments the `CheckFactory` expects.
 */
class DefaultCheckOptions implements TBCheckFactoryOptions {
  readonly maximumCoupResult = 1;
  readonly minimumFumbleResult = 20;
  readonly useSlayingDice = false;
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
    private checkTargetNumber: number,
    private gmModifier: number,
    options: Partial<TBCheckFactoryOptions> = {},
  ) {
    this.options = defaultCheckOptions.mergeWith(options);
  }

  private options: TBCheckFactoryOptions;

  async execute(): Promise<ChatMessage | undefined> {
    const innerFormula = [
      'ds',
      this.createCheckTargetNumberModifier(),
      this.createCoupFumbleModifier(),
    ].filterJoin('');
    const formula = this.options.useSlayingDice ? `{${innerFormula}}x` : innerFormula;
    const roll = Roll.create(formula);
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

  createCheckTargetNumberModifier(): string {
    const totalCheckTargetNumber = Math.max(this.checkTargetNumber + this.gmModifier, 0);
    return `v${totalCheckTargetNumber}`;
  }

  createCoupFumbleModifier(): string | null {
    const isMinimumFumbleResultRequired =
      this.options.minimumFumbleResult !== defaultCheckOptions.minimumFumbleResult;
    const isMaximumCoupResultRequired =
      this.options.maximumCoupResult !== defaultCheckOptions.maximumCoupResult;

    if (isMinimumFumbleResultRequired || isMaximumCoupResultRequired) {
      return `c${this.options.maximumCoupResult ?? ''}:${this.options.minimumFumbleResult ?? ''}`;
    } else {
      return null;
    }
  }
}

/**
 * Asks the user for all unknown/necessary information and passes them on to perform a roll.
 * @param checkTargetNumber - The Check Target Number ("CTN")
 * @param options           - Options changing the behavior of the roll and message.
 */
export async function createCheckRoll(
  checkTargetNumber: number,
  options: Partial<TBCheckFactoryOptions> = {},
): Promise<ChatMessage | unknown> {
  // Ask for additional required data;
  const gmModifierData = await askGmModifier(checkTargetNumber, options);

  const newTargetValue = gmModifierData.checkTargetNumber ?? checkTargetNumber;
  const gmModifier = gmModifierData.gmModifier ?? 0;
  const newOptions: Partial<TBCheckFactoryOptions> = {
    maximumCoupResult: gmModifierData.maximumCoupResult ?? options.maximumCoupResult,
    minimumFumbleResult: gmModifierData.minimumFumbleResult ?? options.minimumFumbleResult,
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
 * Responsible for rendering the modal interface asking for the modifier specified by GM and (currently) additional data.
 *
 * @notes
 * At the moment, this asks for more data than it will do after some iterations.
 *
 * @returns The data given by the user.
 */
async function askGmModifier(
  checkTargetNumber: number,
  options: Partial<TBCheckFactoryOptions> = {},
  { template, title }: { template?: string; title?: string } = {},
): Promise<Partial<IntermediateGmModifierData>> {
  const usedTemplate = template ?? 'systems/tb2/templates/dialogs/roll-options.hbs';
  const usedTitle = title ?? getGame().i18n.localize('TB2.DialogRollOptionsDefaultTitle');
  const templateData = {
    title: usedTitle,
    checkTargetNumber: checkTargetNumber,
    maximumCoupResult: options.maximumCoupResult ?? defaultCheckOptions.maximumCoupResult,
    minimumFumbleResult: options.minimumFumbleResult ?? defaultCheckOptions.minimumFumbleResult,
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
 * @param formData - The filed dialog
 */
function parseDialogFormData(formData: HTMLFormElement): Partial<IntermediateGmModifierData> {
  const chosenCheckTargetNumber = parseInt(formData['check-target-number']?.value);
  const chosenGMModifier = parseInt(formData['gm-modifier']?.value);
  const chosenMaximumCoupResult = parseInt(formData['maximum-coup-result']?.value);
  const chosenMinimumFumbleResult = parseInt(formData['minimum-fumble-result']?.value);
  const chosenRollMode = formData['roll-mode']?.value;

  return {
    checkTargetNumber: Number.isSafeInteger(chosenCheckTargetNumber)
      ? chosenCheckTargetNumber
      : undefined,
    gmModifier: Number.isSafeInteger(chosenGMModifier) ? chosenGMModifier : undefined,
    maximumCoupResult: Number.isSafeInteger(chosenMaximumCoupResult)
      ? chosenMaximumCoupResult
      : undefined,
    minimumFumbleResult: Number.isSafeInteger(chosenMinimumFumbleResult)
      ? chosenMinimumFumbleResult
      : undefined,
    rollMode: Object.values(CONST.DICE_ROLL_MODES).includes(chosenRollMode)
      ? chosenRollMode
      : undefined,
  };
}

/**
 * Contains data that needs retrieval from an interactive Dialog.
 */
interface GmModifierData {
  gmModifier: number;
  rollMode: foundry.CONST.DiceRollMode;
}

/**
 * Contains *CURRENTLY* necessary Data for drafting a roll.
 *
 * @deprecated
 * Quite a lot of this information is requested due to a lack of automation:
 *  - maximumCoupResult
 *  - minimumFumbleResult
 *  - useSlayingDice
 *  - checkTargetNumber
 *
 * They will and should be removed once effects and data retrieval is in place.
 * If a "raw" roll dialog is necessary, create another pre-processing Dialog
 * class asking for the required information.
 * This interface should then be replaced with the `GmModifierData`.
 */
interface IntermediateGmModifierData extends GmModifierData {
  checkTargetNumber: number;
  maximumCoupResult: number;
  minimumFumbleResult: number;
}

/**
 * The minimum behavioral options that need to be passed to the factory.
 */
export interface TBCheckFactoryOptions {
  maximumCoupResult: number;
  minimumFumbleResult: number;
  useSlayingDice: boolean;
  rollMode: foundry.CONST.DiceRollMode;
  flavor?: string;
  flavorData?: Record<string, string | number | null>;
  speaker?: ReturnType<typeof ChatMessage.getSpeaker>;
}
