export class TBTest extends DiceTerm {
  constructor({ modifiers = [], results = [], options }: Partial<DiceTerm.TermData>) {
    super({
      faces: 6,
      results,
      modifiers,
      options,
    });
    logger.info('TBTest.constructor', results);
    if (this.results.length > 0) {
      this.evaluateResults();
    }
  }
  rerollableSixes = 0;
  rerollableFails = 0;

  /** @override */
  roll({ minimize = false, maximize = false } = {}): DiceTerm.Result {
    logger.info('TBTest.roll', this);
    const x = super.roll({ minimize: minimize, maximize: maximize });
    return x;
  }
  evaluateResults(): void {
    this.rerollableFails = 0;
    this.rerollableSixes = 0;
    this.results.map((die) => {
      if (die.result == 6) {
        this.rerollableSixes++;
      }
      // TODO mastery here
      if (die.result <= 4) {
        this.rerollableFails++;
      }
    });
    logger.info('found sixes:', this.rerollableSixes);
    logger.info('found fails:', this.rerollableFails);
  }
  /**
   * @override
   * @remarks "min" and "max" are filtered out because they are irrelevant for
   * {@link DS4Check}s and only result in some dice rolls being highlighted
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
}
