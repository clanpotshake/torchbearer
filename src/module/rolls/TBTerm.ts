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
    logger.info('TBTest.constructor', results);
  }
  rerollableSixes = 0;
  rerollableFails = 0;
  successes = 0;

  /** @override */
  get expression(): string {
    return `d6${this.modifiers.join('')}`;
  }
  /** @override */
  get total(): string | number | null | undefined {
    return this.successes;
  }

  /** @override */
  roll({ minimize = false, maximize = false } = {}): DiceTerm.Result {
    logger.info('in TBTest.roll');
    // if (!this._evaluated) {
    //   logger.info('roll not yet evaluated, doing so...');
    //   super.roll({ minimize: false, maximize: maximize });
    //   this.evaluateResults();
    // }
    return {
      ...super.roll({ minimize, maximize }),
      result: this.successes,
      success: true,
    };
  }
  // evaluateResults(): void {
  //   this.rerollableFails = 0;
  //   this.rerollableSixes = 0;
  //   this.results.map((die) => {
  //     if (die.result == 6) {
  //       this.rerollableSixes++;
  //     }
  //     // TODO mastery here
  //     if (die.result < 4) {
  //       this.rerollableFails++;
  //     } else {
  //       this.successes++;
  //     }
  //   });
  //   logger.info('found sixes:', this.rerollableSixes);
  //   logger.info('found fails:', this.rerollableFails);
  //   logger.info('found successes:', this.successes);
  // }
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
    return super._evaluateSync({ minimize, maximize });
    // this.evaluateResults();
    // return this;
  }
  static DENOMINATION = 's';
  static MODIFIERS = {
    // TODO use these for opposed etc
    c: (): void => undefined, // Modifier is consumed in constructor for maximumCoupResult / minimumFumbleResult
    v: (): void => undefined, // Modifier is consumed in constructor for checkTargetNumber
    n: (): void => undefined, // Modifier is consumed in constructor for canFumble
  };
}
