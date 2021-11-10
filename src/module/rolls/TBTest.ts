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
    } else {
      logger.error('TBTest has empty results', this);
    }
  }
  rerollableSixes = 0;
  rerollableFails = 0;
  successes = 0;

  /** @override */
  roll({ minimize = false, maximize = false } = {}): DiceTerm.Result {
    return super.roll({ minimize: false, maximize: maximize });
  }
  evaluateResults(): void {
    this.rerollableFails = 0;
    this.rerollableSixes = 0;
    this.results.map((die) => {
      if (die.result == 6) {
        this.rerollableSixes++;
      }
      // TODO mastery here
      if (die.result < 4) {
        this.rerollableFails++;
      } else {
        this.successes++;
      }
    });
    logger.info('found sixes:', this.rerollableSixes);
    logger.info('found fails:', this.rerollableFails);
    logger.info('found successes:', this.successes);
  }
  /**
   * @override
   * @remarks "min" and "max" are filtered out because they are irrelevant for
   * {@link TBTest}s and only result in some dice rolls being highlighted
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
