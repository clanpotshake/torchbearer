// SPDX-FileCopyrightText: 2021 Johannes Loher
//
// SPDX-License-Identifier: MIT

import { TBItem } from './item/TBItem';
import { TBActor } from './actor/TBActor';
import { getGame } from './helpers';

declare global {
  interface DocumentClassConfig {
    ActiveEffect: typeof TBActiveEffect;
  }
}

type PromisedType<T> = T extends Promise<infer U> ? U : T;

export class TBActiveEffect extends ActiveEffect {
  /**
   * A fallback icon that can be used if no icon is defined for the effect.
   */
  static FALLBACK_ICON = 'icons/svg/aura.svg';

  /**
   * A cached reference to the source document to avoid recurring database lookups
   */
  protected source: PromisedType<ReturnType<typeof fromUuid>> | undefined = undefined;

  /**
   * Whether or not this effect is currently suppressed.
   */
  get isSuppressed(): boolean {
    // const originatingItem = this.originatingItem;
    // if (!originatingItem) {
    //   return false;
    // }
    // return originatingItem.isNonEquippedEuipable();
    return false;
  }

  /**
   * The item which this effect originates from if it has been transferred from an item to an actor.
   */
  get originatingItem(): TBItem | undefined {
    if (!(this.parent instanceof TBActor)) {
      return;
    }
    const itemIdRegex = /Item\.([a-zA-Z0-9]+)/;
    const itemId = this.data.origin?.match(itemIdRegex)?.[1];
    if (!itemId) {
      return;
    }
    return this.parent.items.get(itemId);
  }

  /**
   * The number of times this effect should be applied.
   */
  get factor(): number {
    return 1;
    // return this.originatingItem?.activeEffectFactor ?? 1;
  }

  /** @override */
  apply(actor: TBActor, change: foundry.data.ActiveEffectData['changes'][number]): unknown {
    change.value = Roll.replaceFormulaData(change.value, actor.data);
    try {
      change.value = Roll.safeEval(change.value).toString();
    } catch (e) {
      // this is a valid case, e.g., if the effect change simply is a string
    }
    return super.apply(actor, change);
  }

  /**
   * Gets the current source name based on the cached source object.
   */
  async getCurrentSourceName(): Promise<string> {
    const game = getGame();
    const origin = await this.getSource();
    if (origin === null) return game.i18n.localize('None');
    return origin.name ?? game.i18n.localize('Unknown');
  }

  /**
   * Gets the source document for this effect. Uses the cached {@link TBActiveEffect#origin} if it has already been
   * set.
   */
  protected async getSource(): ReturnType<typeof fromUuid> {
    if (this.source === undefined) {
      this.source = this.data.origin !== undefined ? await fromUuid(this.data.origin) : null;
    }
    return this.source;
  }

  /**
   * Create a new {@link TBActiveEffect} using default data.
   *
   * @param parent The parent {@link DS4Actor} or {@link DS4Item} of the effect.
   * @returns A promise that resolved to the created effect or udifined of the creation was prevented.
   */
  static async createDefault(parent: TBActor | TBItem): Promise<TBActiveEffect | undefined> {
    const createData = {
      label: getGame().i18n.localize(`TB2.NewEffectLabel`),
      icon: this.FALLBACK_ICON,
    };

    return this.create(createData, { parent, pack: parent.pack ?? undefined });
  }
}
