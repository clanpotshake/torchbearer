export class TBTerm extends DiceTerm {
  constructor({
    number: number,
    modifiers = [],
    results = [],
    options,
  }: Partial<DiceTerm.TermData>) {
    super({
      number: number,
      faces: 6,
      results,
      modifiers,
      options,
    });
    logger.info('TBTest.constructor', this);
    // 5dsv4 = 5 dice, ob4
    // 6dsvs3 = 6 dice opposed roll against 3
    const checkTargetNumberModifier = this.modifiers.filter((m) => m[0] === 'v')[0];
    const ctnRgx = new RegExp('vs?([0-9]+)?');
    const ctnMatch = checkTargetNumberModifier?.match(ctnRgx);

    if (this.results.length > 0) {
      this.evaluateResults();
    }
  }
  rerollableSixes = 0;
  rerollableFails = 0;
  successes = 0;
  ob = 0;
  opposedRoll = false;

  /** @override */
  get expression(): string {
    return `${this.number}d6${this.modifiers.join('')}`;
  }
  /** @override */
  get total(): string | number | null | undefined {
    return this.successes;
  }

  /** @override */
  roll({ minimize = false, maximize = false } = {}): DiceTerm.Result {
    logger.info('in TBTest.roll');
    if (!this._evaluated) {
      logger.info('roll not yet evaluated, doing so...');
      super.roll({ minimize: false, maximize: maximize });
      this.evaluateResults();
    }
    return {
      ...super.roll({ minimize, maximize }),
      result: this.successes,
      success: true,
    };
  }
  evaluateResults(): void {
    const res = evaluateTest(
      this.results.map((die) => die.result),
      this.ob,
    );
    this.results = res;
    logger.info('found sixes:', this.rerollableSixes);
    logger.info('found fails:', this.rerollableFails);
    logger.info('found successes:', this.successes);
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
    super._evaluateSync({ minimize: false, maximize: false });
    this.evaluateResults();
    return this;
  }
  static DENOMINATION = 's';
  static MODIFIERS = {
    // TODO use these for opposed etc
    c: (): void => undefined, // Modifier is consumed in constructor for maximumCoupResult / minimumFumbleResult
    v: (): void => undefined, // Modifier is consumed in constructor for checkTargetNumber
    n: (): void => undefined, // Modifier is consumed in constructor for canFumble
  };
}

export function evaluateTest(dice: number[], ob: number): SubCheckResult[] {
  if (dice.length < 1) {
    throw new Error(getGame().i18n.localize('TB2.ErrorInvalidNumberOfDice'));
  }
  let passes = 0;
  let sixes = 0;
  let fails = 0;
  dice.map((die) => {
    if (die == 6) sixes++;
    if (die >= 4) {
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
  };
  return [result];
}

interface SubCheckResult extends DiceTerm.Result {
  // TODO do i need anything in here?
  foo?: number;
}
