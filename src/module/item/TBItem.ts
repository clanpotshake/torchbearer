import { getGame } from '../helpers';
import { createTestRoll } from '../rolls/CheckFactory';
import { TB } from '../config';

declare global {
  interface DocumentClassConfig {
    Item: typeof TBItem;
  }
}
export class TBItem extends Item {
  /** @override */
  prepareData(): void {
    super.prepareData();
  }
  /** @override */
  prepareDerivedData(): void {
    super.prepareDerivedData();
    if (this.data.type == 'belief') {
    }
  }
  async roll(options: { speaker?: { token?: TokenDocument; alias?: string } } = {}): Promise<void> {
    switch (this.data.type) {
      case 'skill':
        return this.rollSkill(options);
      default:
        throw new Error(
          getGame().i18n.format('TB2.ErrorRollingForItemTypeNotPossible', { type: this.data.type }),
        );
    }
  }

  protected async rollSkill(
    options: { speaker?: { token?: TokenDocument; alias?: string } } = {},
  ): Promise<void> {
    if (this.data.type != 'skill') {
      throw new Error(
        getGame().i18n.format('TB2.ErrorWrongItemType', {
          actualType: this.data.type,
          expectedType: 'skill',
          id: this.id,
          name: this.name,
        }),
      );
    }

    if (!this.actor) {
      throw new Error(
        getGame().i18n.format('TB2.ErrorCannotRollUnownedItem', { name: this.name, id: this.id }),
      );
    }
    const ob = await this.getTestObValue();
    const speaker = ChatMessage.getSpeaker({ actor: this.actor, ...options.speaker });
    await createTestRoll(ob, {
      rollMode: getGame().settings.get('core', 'rollMode'),
      flavor: 'TB2.ItemWeaponCheckFlavor',
      flavorData: { actor: speaker.alias ?? this.actor.name, weapon: this.name },
      speaker,
    });
  }

  // TODO probably don't need this, see checkfactory
  protected async getTestObValue(): Promise<number> {
    const identifier = 'test-ob-input';
    return Dialog.prompt({
      title: getGame().i18n.localize('TB2.DialogSkillTestObInputTitle'),
      content: await renderTemplate(
        'systems/torchbearer/templates/dialogs/simple-select-form.hbs',
        {
          selects: [
            {
              label: getGame().i18n.localize('TB2.TestOb'),
              identifier,
              options: {},
            },
          ],
        },
      ),
      label: getGame().i18n.localize('TB2.GenericOkButton'),
      callback: (html) => {
        const inputVal = html.find(`#${identifier}`).val();
        if (Number.isNumeric(inputVal)) {
          throw new Error(
            getGame().i18n.format('TB2.ErrorInvalidInputType', {
              actualType: inputVal,
              expectedTypes: 'number',
            }),
          );
        }
        return Number(inputVal);
      },
    });
  }
}
