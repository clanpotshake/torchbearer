import { getGame } from '../helpers';
import { createTestRoll } from '../rolls/CheckFactory';
import { TB } from '../config';
import { AttributeType, ClassType, ItemType } from './ItemDataSource';
import { utilities } from '../util/utilities';

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
    this.prepareSkillThings();
    this.data.data.hasMemoryPalace =
      this.data.type === 'class'
        ? TBItem.classesWithMemoryPalace.includes(this.data.data.classType)
        : false;
    this.data.data.hasUrdr =
      this.data.type === 'class'
        ? TBItem.classesWithUrdr.includes(this.data.data.classType)
        : false;
    if (this.data.type === 'gear') {
      this.data.data.isContainer = Object.values(this.data.data.capacity).some((slot) => {
        return slot > 0;
      });
    }
  }
  protected prepareSkillThings(): void {
    this.data.data.rollable = TBItem.rollableItemTypes.includes(this.type);
    if (this.data.type === 'skill') {
      this.data.data.learning = this.data.data.rank == 0 && this.data.data.attempts >= 1;
      this.data.data.passes = 0;
      this.data.data.fails = 0;
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
    logger.info('in rollSkill', this);
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
    const speaker = ChatMessage.getSpeaker({ actor: this.actor, ...options.speaker });
    const might = this.actor.data.data.might;
    const precedence = this.actor.data.data.precedence;
    const nature = this.actor.data.data.abilities.nature.current;
    const nString = utilities.startsWithVowel(this.name) ? 'n' : '';
    const flavor = utilities.interpolate(getGame().i18n.localize('TB2.SkillCheckFlavor'), nString, [
      this.actor.name || 'ERROR_NO_ACTOR',
      'tests',
      this.data.name,
    ]);
    const x = await createTestRoll(this.data.name, this.data.data.rank, nature, might, precedence, {
      rollMode: getGame().settings.get('core', 'rollMode'),
      flavor: flavor,
      flavorData: { actor: speaker.alias ?? this.actor.name, skill: this.name },
      speaker,
    });
    logger.info('test result is', x);
  }

  /**
   * The list of item types that are rollable.
   */
  static get rollableItemTypes(): ItemType[] {
    return ['skill'];
  }
  static get classesWithMemoryPalace(): ClassType[] {
    return ['magician', 'dreamwalker'];
  }
  static get classesWithUrdr(): ClassType[] {
    return ['theurge', 'shaman'];
  }
  static get beginnersLuckAttributes(): AttributeType[] {
    return ['health', 'will'];
  }
}
