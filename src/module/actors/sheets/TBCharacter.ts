import { Common, DisplayProps, TBActor, TBActorData, TracksTests } from '../TBActor';
import { canAdvance, TestString, updateTestsNeeded } from "../../helpers";

export class TBCharacter extends TBActor<CharacterDataRoot> {
  data: CharacterDataRoot;

  prepareData(): void {
    super.prepareData();

    this._calculatePtgs();

    updateTestsNeeded(this.data.data.will);
    updateTestsNeeded(this.data.data.health);
    updateTestsNeeded(this.data.data.circles);
    updateTestsNeeded(this.data.data.resources);
    updateTestsNeeded(this.data.data.custom1);
    updateTestsNeeded(this.data.data.custom2);

    this.data.successOnlyRolls = (this.data.data.settings.onlySuccessesCount || '')
      .split(',')
      .map((s) => s.trim().toLowerCase());
  }
  async addStatTest(
    stat: TracksTests,
    name: string,
    accessor: string,
    difficultyGroup: TestString,
    isSuccessful: boolean,
    routinesNeeded = false,
    force = false,
  ): Promise<void> {
    // if the stat should not advance on failure, back out immediately.
    name = name.toLowerCase();
    const onlySuccessCounts = this.data.successOnlyRolls.indexOf(name) !== -1;
    if (onlySuccessCounts && !isSuccessful) {
      return;
    }

    // if the test should be tracked but we're doing deferred tracking do that now.
    const difficultyDialog = game.torchbearer.gmDifficulty;
    if (!force && difficultyDialog?.extendedTest) {
      difficultyDialog?.addDeferredTest({
        actor: this,
        path: accessor,
        difficulty: difficultyGroup,
        name,
      });
      return;
    }

    // if the test should be tracked and we're not deferring track the test.
    this._addTestToStat(stat, accessor, difficultyGroup);
    if (canAdvance(stat)) {
      Dialog.confirm({
        title: `Advance ${name}?`,
        content: `<p>${name} is ready to advance. Go ahead?</p>`,
        yes: () => this._advanceStat(accessor, stat.exp + 1),
        no: () => {
          return;
        },
        defaultYes: true,
      });
    }
  }

  async addAttributeTest(
    stat: TracksTests,
    name: string,
    accessor: string,
    difficultyGroup: TestString,
    isSuccessful: boolean,
    force = false,
  ): Promise<void> {
    return this.addStatTest(stat, name, accessor, difficultyGroup, isSuccessful, true, force);
  }

  public updateArthaForSkill(skillId: string, persona: number, deeds: number): void {
    this.update({
      'data.deeds': this.data.data.deeds - deeds,
      'data.persona': this.data.data.persona - persona,
    });
    const skill = this.items.get(skillId) as Skill;
    skill.update(
      {
        'data.deeds': deeds ? (skill.data.data.deeds || 0) + 1 : undefined,
        'data.persona': skill.data.data.persona + persona,
      },
      {},
    );
  }

  public updateArthaForStat(accessor: string, persona: number, deeds: number): void {
    const stat = getProperty(this.data, accessor) as Ability;
    const updateData = {
      'data.deeds': this.data.data.deeds - (deeds ? 1 : 0),
      'data.persona': this.data.data.persona - persona,
    };
    updateData[`${accessor}.deeds`] = deeds ? (stat.deeds || 0) + 1 : undefined;
    updateData[`${accessor}.persona`] = (stat.persona || 0) + persona;
    this.update(updateData);
  }

  private async _addTestToStat(stat: TracksTests, accessor: string, difficultyGroup: TestString) {
    let testNumber = 0;
    const updateData = {};
    switch (difficultyGroup) {
      case 'Challenging':
        testNumber = stat.challenging;
        if (testNumber < (stat.challengingNeeded || 0)) {
          updateData[`${accessor}.challenging`] = testNumber + 1;
          stat.challenging = testNumber + 1;
          return this.update(updateData, {});
        }
        break;
      case 'Difficult':
        testNumber = stat.difficult;
        if (testNumber < (stat.difficultNeeded || 0)) {
          updateData[`${accessor}.difficult`] = testNumber + 1;
          stat.difficult = testNumber + 1;
          return this.update(updateData, {});
        }
        break;
      case 'Routine':
        testNumber = stat.routine;
        if (testNumber < (stat.routineNeeded || 0)) {
          updateData[`${accessor}.routine`] = testNumber + 1;
          stat.routine = testNumber;
          return this.update(updateData, {});
        }
        break;
      case 'Routine/Difficult':
        testNumber = stat.difficult;
        if (testNumber < (stat.difficultNeeded || 0)) {
          updateData[`${accessor}.difficult`] = testNumber + 1;
          stat.difficult = testNumber + 1;
          return this.update(updateData, {});
        } else {
          testNumber = stat.routine;
          if (testNumber < (stat.routineNeeded || 0)) {
            updateData[`${accessor}.routine`] = testNumber + 1;
            stat.routine = testNumber + 1;
            return this.update(updateData, {});
          }
        }
        break;
    }
  }

  taxResources(amount: number, maxFundLoss: number): void {
    const updateData = {};
    let resourcesTax = parseInt(this.data.data.resourcesTax.toString()) || 0;
    const resourceExp = this.data.data.resources.exp || 0;
    const fundDice = this.data.data.funds || 0;
    if (amount <= maxFundLoss) {
      updateData['data.funds'] = fundDice - amount;
    } else {
      updateData['data.funds'] = 0;
      amount -= maxFundLoss;
      resourcesTax = Math.min(resourceExp, amount + resourcesTax);
      updateData['data.resourcesTax'] = resourcesTax;
      if (resourcesTax === resourceExp) {
        // you taxed all your resources away, they degrade
        new Dialog({
          title: 'Overtaxed Resources!',
          content: '<p>Tax has reduced your resources exponent to 0.</p><hr>',
          buttons: {
            reduce: {
              label: 'Reduce exponent by 1',
              callback: () => {
                resourcesTax--;
                this.update({
                  'data.resourcesTax': resourcesTax,
                  'data.resources.exp': resourcesTax,
                  'data.resources.routine': 0,
                  'data.resources.difficult': 0,
                  'data.resources.challenging': 0,
                });
              },
            },
            ignore: {
              label: 'Ignore for now',
            },
          },
          default: 'reduce',
        }).render(true);
      }
    }
    this.update(updateData);
  }

  private async _advanceStat(accessor: string, newExp: number) {
    const updateData = {};
    updateData[`${accessor}.routine`] = 0;
    updateData[`${accessor}.difficult`] = 0;
    updateData[`${accessor}.challenging`] = 0;
    updateData[`${accessor}.exp`] = newExp;
    return this.update(updateData);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  _onCreate(data: any, options: any, userId: string): void {
    if (game.userId !== userId) {
      return;
    }
    super._onCreate(data, options, userId);
    setTimeout(() => {
      if (this.data.data.settings.showBurner) {
        new Dialog({
          title: 'Launch Burner?',
          content: 'This is a new character. Would you like to launch the character burner?',
          buttons: {
            yes: {
              label: 'Yes',
              callback: () => {
                CharacterBurnerDialog.Open(this);
              },
            },
            later: {
              label: 'Later',
            },
            never: {
              label: 'No',
              callback: () => {
                this.update({ 'data.settings.showBurner': false });
              },
            },
          },
          default: 'yes',
        }).render(true);
      }
    }, 500);
  }

  async createEmbeddedDocuments(
    type: FoundryDocument.Types,
    data: Partial<FoundryDocument.Data>[],
    options?: FoundryDocument.ModificationContext,
  ): Promise<FoundryDocument[]> {
    data = data.filter((i) => i.type !== 'lifepath');
    return super.createEmbeddedDocuments(type, data, options);
  }
}

export interface CharacterDataRoot extends TBActorData<TBCharacterData> {
  type: 'character';
}

export interface TBCharacterData extends Common, DisplayProps, SpellsMaintainedInfo {
  stock: string;
  age: number;
  alias: string;
  homeland: string;
  features: string;
  settings: CharacterSettings;
}

export interface CharacterSettings {
  showSettings: boolean;
  showBurner: boolean;

  roundUpMortalWound: boolean;
  roundUpHealth: boolean;
  roundUpReflexes: boolean;
  onlySuccessesCount: string;
  armorTrained: boolean;
  ignoreSuperficialWounds: boolean;
}

export interface SpellsMaintainedInfo {
  sustainedSpell1: string;
  sustainedSpell1Ob: number;
  sustainedSpell2: string;
  sustainedSpell2Ob: number;
  sustainedSpell3: string;
  sustainedSpell3Ob: number;
  sustainedSpell4: string;
  sustainedSpell5: string;

  maxSustained?: number;
  maxObSustained?: number;
}
