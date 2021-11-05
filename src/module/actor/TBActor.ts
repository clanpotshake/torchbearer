import { getGame } from '../helpers';
import { SkillTest } from './TBActorDataProperties';
import { createTestRoll } from '../rolls/CheckFactory';
import { TB } from '../config';

declare global {
  interface DocumentClassConfig {
    Actor: typeof TBActor;
  }
}
export class TBActor extends Actor {
  prepareData(): void {
    this.data.reset();
    this.prepareBaseData();
    this.prepareEmbeddedEntities();
    this.applyActiveEffectsToBaseData();
    this.prepareDerivedData();
    this.applyActiveEffectsToDerivedData();
  }
  /** @override */
  prepareBaseData(): void {
    // this.prepareTests();
  }

  /**
   * Apply transformations to the Actor data after effects have been applied to the base data.
   * @override
   */
  // prepareDerivedData(): void {}
  /**
   * Prepares the skills rollable by the actor
   */
  protected prepareTests(): void {
    const data = this.data.data;
    data.tests = {
      alchemist: data.tests.alchemist,
      arcanist: data.tests.arcanist,
      armorer: data.tests.armorer,
      beggar: data.tests.beggar,
      butcher: data.tests.butcher,
      carpenter: data.tests.carpenter,
      cartographer: data.tests.cartographer,
      commander: data.tests.commander,
      cook: data.tests.cook,
      criminal: data.tests.criminal,
      dungeoneer: data.tests.dungeoneer,
      enchanter: data.tests.enchanter,
      fighter: data.tests.fighter,
      fisher: data.tests.fisher,
      gambler: data.tests.gambler,
      haggler: data.tests.haggler,
      healer: data.tests.healer,
      hunter: data.tests.hunter,
      jeweler: data.tests.jeweler,
      laborer: data.tests.laborer,
      loremaster: data.tests.loremaster,
      manipulator: data.tests.manipulator,
      mentor: data.tests.mentor,
      orator: data.tests.orator,
      pathfinder: data.tests.pathfinder,
      peasant: data.tests.peasant,
      persuader: data.tests.persuader,
      rider: data.tests.rider,
      ritualist: data.tests.ritualist,
      sailor: data.tests.sailor,
      sapper: data.tests.sapper,
      scavenger: data.tests.scavenger,
      scholar: data.tests.scholar,
      scout: data.tests.scout,
      smith: data.tests.smith,
      steward: data.tests.steward,
      stonemason: data.tests.stonemason,
      strategist: data.tests.strategist,
      survivalist: data.tests.survivalist,
      tanner: data.tests.tanner,
      theologian: data.tests.theologian,
      weaver: data.tests.weaver,
    };
    data.attributes = {
      circles: data.attributes.circles,
      health: data.attributes.health,
      nature: data.attributes.nature,
      will: data.attributes.will,
      resources: data.attributes.resources,
    };
  }

  /**
   * Roll for a given check.
   * @param check - The check to perform
   * @param options - Additional options to customize the roll
   */
  async rollCheck(
    check: SkillTest,
    options: { speaker?: { token?: TokenDocument; alias?: string } } = {},
  ): Promise<void> {
    const speaker = ChatMessage.getSpeaker({ actor: this, ...options.speaker });
    await createTestRoll(this.data.data.tests[check], {
      rollMode: getGame().settings.get('core', 'rollMode'),
      flavor: 'TB2.ActorTestFlavor',
      flavorData: { actor: speaker.alias ?? this.name, test: TB.i18nKeys.skills[check] },
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
export interface DisplayClass {
  cssClass?: string;
}
export interface Ability extends TracksTests, DisplayClass {}
