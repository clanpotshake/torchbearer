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
  // evaluate(
  //   options: Partial<RollTerm.EvaluationOptions & { async: boolean }> | undefined = {},
  // ): Promise<this> {
  //   logger.info('in TBTest.evaluate');
  //   return super.evaluate({ minimize: false, maximize: true, async: options?.async || true });
  // }
  /** @override */
  get expression(): string {
    return `ds${this.modifiers.join('')}`;
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
      result: this.successes,
      success: true,
    };
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
  static DENOMINATION = 's';
  static MODIFIERS = {
    c: (): void => undefined, // Modifier is consumed in constructor for maximumCoupResult / minimumFumbleResult
    v: (): void => undefined, // Modifier is consumed in constructor for checkTargetNumber
    n: (): void => undefined, // Modifier is consumed in constructor for canFumble
  };
}
