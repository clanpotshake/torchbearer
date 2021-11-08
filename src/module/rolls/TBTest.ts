export class TBTest extends DiceTerm {
  constructor({ modifiers = [], results = [], options }: Partial<DiceTerm.TermData>) {
    logger.info('roll constructor', results);
    super({
      faces: 6,
      results,
      modifiers,
      options,
    });
    // if (this.results.length > 0) {
    //   this.evaluateResults();
    // }
  }

  /** @override */
  roll({ minimize = false, maximize = false } = {}): DiceTerm.Result {
    logger.info('roll', this);
    // Swap minimize / maximize because in DS4, the best possible roll is a 1 and the worst possible roll is a 20
    const x = super.roll({ minimize: maximize, maximize: minimize });
    return x;
  }
}
