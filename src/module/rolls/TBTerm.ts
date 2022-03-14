import { getGame } from '../helpers';

/**
 * Implements TB2 skill and ability tests as an emulated "dice throw".
 *
 * @example
 * - Roll a test with 5 dice against a Obstacle of 4: `/r 5ds4`
 * - Roll an opposed test with 3 dice against 4 dice: `/r 3dsv4`
 */
export class TBTerm extends DiceTerm {
  rerollableSixes = 0;
  rerollableFails = 0;
  successes = 0;
  ob = 0;
  opposedRoll = false;
  constructor({ number = 1, modifiers = [], results = [], options }: Partial<DiceTerm.TermData>) {
    super({
      number: number,
      faces: 6,
      results,
      modifiers,
      options,
    });
    logger.info('TBTerm.constructor', this);
    const checkTargetNumberModifier = this.modifiers.filter((m) => m[0] === 'v')[0];
    const ctnRgx = new RegExp('(v?)([0-9]+)?');
    const ctnMatch = checkTargetNumberModifier?.match(ctnRgx);
    if (ctnMatch) {
      const [ob] = checkTargetNumberModifier.slice(2);
      this.ob = ob ? parseInt(ob) : TBTerm.DEFAULT_OB;
      this.opposedRoll = ctnMatch[1] == 's';
    }

    if (this.results.length > 0) {
      this.evaluateResults();
    }
  }

  /** @override */
  get expression(): string {
    // TODO gotta figure out how foundry wants to see dice
    return `${this.number}ds${this.ob}`;
    // return `${this.number}ds${this.modifiers.join('')}`;
    return `${this.number}d6${this.modifiers.join('')}`;
  }
  /** @override */
  get total(): string | number | null | undefined {
    return this.successes;
  }

  /** @override */
  roll({ minimize = false, maximize = false } = {}): DiceTerm.Result {
    logger.info('in TBTerm.roll');
    const res = super.roll({ minimize: false, maximize: maximize });
    // this.evaluateResults();

    return {
      ...res,
      result: this.successes,
      success: true, // TODO
    };
  }
  evaluateResults(): void {
    const dice = this.results.map((die) => die.result);
    this.results = evaluateTest(dice, this.ob);
    // logger.info('found sixes:', this.rerollableSixes);
    // logger.info('found fails:', this.rerollableFails);
    // logger.info('found successes:', this.successes);
    logger.info('results: ', this.results);
  }
  /**
   * @override
   * @remarks "min" and "max" are filtered out because they are irrelevant for
   * {@link TBTerm}s and only result in some dice rolls being highlighted
   * incorrectly.
   */
  getResultCSS(result: DiceTerm.Result): (string | null)[] {
    return super.getResultCSS(result).filter((cssClass) => cssClass !== 'min');
  }
  /** @override */
  _evaluateSync({ minimize = false, maximize = false } = {}): this {
    super._evaluateSync({ minimize, maximize });
    this.evaluateResults();
    return this;
  }
  static DENOMINATION = 's';
  static DEFAULT_OB = 2;
  static MODIFIERS = {
    // TODO use these for opposed etc
    c: (): void => undefined, // Modifier is consumed in constructor for maximumCoupResult / minimumFumbleResult
    v: (): void => undefined, // Modifier is consumed in constructor for checkTargetNumber
    n: (): void => undefined, // Modifier is consumed in constructor for canFumble
  };
}

export function evaluateTest(
  dice: number[],
  ob: number,
  {
    heroic = false, // successes on 3+ instead of 4+
  }: { heroic?: boolean } = {},
): SubCheckResult[] {
  if (dice.length < 1) {
    throw new Error(getGame().i18n.localize('TB2.ErrorInvalidNumberOfDice'));
  }
  let passes = 0;
  let sixes = 0;
  let fails = 0;
  const minimumSuccessFace = heroic ? 3 : 4;
  dice.map((die) => {
    if (die == 6) sixes++;
    if (die >= minimumSuccessFace) {
      passes++;
    } else {
      fails++;
    }
  });
  const result = {
    sixes: sixes,
    fails: fails,
    result: passes,
    success: passes >= ob,
    testOb: ob,
  };
  return [result];
}
interface DieWithSubCheck {
  result: number;
  testOb: number;
}

interface SubCheckResult extends DieWithSubCheck, DiceTerm.Result {}
