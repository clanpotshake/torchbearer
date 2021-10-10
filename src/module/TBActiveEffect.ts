import { TBActor } from './actor/TBActor';
import { TBItem } from './item/TBItem';
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
  protected source: PromisedType<ReturnType<typeof fromUuid>> | undefined = undefined;
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
   * Create a new {@link TBActiveEffect} using default data.
   *
   * @param context The context for the creation of the effect, requiring a parent {@link TBActor} or {@link TBItem}.
   * @returns A promise that resolved to the created effect or udifined of the creation was prevented.
   */
  static async createDefault(
    context: DocumentModificationContext & { parent: TBActor | TBItem },
  ): Promise<TBActiveEffect | undefined> {
    const createData = {
      label: getGame().i18n.localize(`TB2.NewEffectLabel`),
      icon: this.FALLBACK_ICON,
    };

    return this.create(createData, context);
  }
}
