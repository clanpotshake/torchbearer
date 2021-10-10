import { getGame } from '../helpers';
import { Check } from './TBActorDataProperties';
import { createCheckRoll } from '../rolls/CheckFactory';
import { TB } from '../config';

declare global {
  interface DocumentClassConfig {
    Actor: typeof TBActor;
  }
}
export class TBActor extends Actor {
  prepareData(): void {
    super.prepareData();
    this.prepareBaseData();
    this.prepareEmbeddedEntities();
    this.applyActiveEffectsToBaseData();
    this.prepareDerivedData();
    this.applyActiveEffectsToDerivedData();
  }

  /**
   * Apply transformations to the Actor data after effects have been applied to the base data.
   * @override
   */
  prepareDerivedData(): void {
    // this.prepareCombatValues();
    this.prepareChecks();
  }
  /**
   * Prepares the check target numbers of checks for the actor.
   */
  protected prepareChecks(): void {
    const data = this.data.data;
    data.checks = {
      // alchemist: data.attributes.alchemist;
      alchemist: 0,
    };
  }

  /**
   * Roll for a given check.
   * @param check - The check to perform
   * @param options - Additional options to customize the roll
   */
  async rollCheck(
    check: Check,
    options: { speaker?: { token?: TokenDocument; alias?: string } } = {},
  ): Promise<void> {
    const speaker = ChatMessage.getSpeaker({ actor: this, ...options.speaker });
    await createCheckRoll(this.data.data.checks[check], {
      rollMode: getGame().settings.get('core', 'rollMode'),
      maximumCoupResult: this.data.data.rolling.maximumCoupResult,
      minimumFumbleResult: this.data.data.rolling.minimumFumbleResult,
      flavor: 'TB2.ActorCheckFlavor',
      flavorData: { actor: speaker.alias ?? this.name, check: TB.i18nKeys.checks[check] },
      speaker,
    });
  }

  applyActiveEffectsToBaseData(): void {
    // reset overrides because our variant of applying active effects does not set them, it only adds overrides
    this.overrides = {};
    this.applyActiveEffectsFiltered(
      (change) =>
        !this.derivedDataProperties.includes(change.key) &&
        !this.finalDerivedDataProperties.includes(change.key),
    );
  }

  /**
   * The list of properties that are derived from others, given in dot notation.
   */
  get derivedDataProperties(): Array<string> {
    return [];
  }

  /**
   * The list of properties that are completely derived (i.e. {@link ActiveEffect}s cannot be applied to them),
   * given in dot notation.
   */
  get finalDerivedDataProperties(): string[] {
    return [];
  }

  applyActiveEffectsToDerivedData(): void {
    this.applyActiveEffectsFiltered((change) => this.derivedDataProperties.includes(change.key));
  }
  /**
   * Apply ActiveEffectChanges to the Actor data which are caused by ActiveEffects and satisfy the given predicate.
   *
   * @param predicate - The predicate that ActiveEffectChanges need to satisfy in order to be applied
   */
  applyActiveEffectsFiltered(
    predicate: (change: foundry.data.ActiveEffectData['changes'][number]) => boolean,
  ): void {
    const overrides: Record<string, unknown> = {};

    // Organize non-disabled and -suppressed effects by their application priority
    const changes: (foundry.data.ActiveEffectData['changes'][number] & { effect: ActiveEffect })[] =
      this.effects.reduce(
        (
          changes: (foundry.data.ActiveEffectData['changes'][number] & { effect: ActiveEffect })[],
          e,
        ) => {
          if (e.data.disabled || e.isSuppressed) return changes;

          const newChanges = e.data.changes.filter(predicate).flatMap((c) => {
            const changeSource = c.toObject();
            changeSource.priority = changeSource.priority ?? changeSource.mode * 10;
            return Array(e.factor).fill({ ...changeSource, effect: e });
          });

          return changes.concat(newChanges);
        },
        [],
      );
    changes.sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));

    // Apply all changes
    for (const change of changes) {
      const result = change.effect.apply(this, change);
      if (result !== null) overrides[change.key] = result;
    }

    // Expand the set of final overrides
    this.overrides = foundry.utils.expandObject({
      ...foundry.utils.flattenObject(this.overrides),
      ...overrides,
    });
  }
}

export interface TracksTests {
  passes: number;
  fails: number;
}
export interface Ability extends TracksTests, DisplayClass {
  foo: number;
}
export interface DisplayClass {
  cssClass?: string;
}
