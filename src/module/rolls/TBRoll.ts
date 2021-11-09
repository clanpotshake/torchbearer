import { getGame } from '../helpers';
import { TBTest } from './TBTest';

export class TBRoll<D extends Record<string, unknown> = Record<string, unknown>> extends Roll<D> {
  static CHAT_TEMPLATE = 'systems/torchbearer/templates/dice/dice/roll.hbs';

  /**
   * @override
   */
  async render(chatOptions: Parameters<Roll['render']>[0] = {}): Promise<string> {
    logger.info('TBRoll.render', this);
    chatOptions = foundry.utils.mergeObject(
      {
        user: getGame().user?.id,
        flavor: null,
        template: TBRoll.CHAT_TEMPLATE,
        blind: false,
      },
      chatOptions,
    );
    const isPrivate = chatOptions.isPrivate;

    // Execute the roll, if needed
    if (!this._evaluated) this.evaluate();

    let sixes = 0;
    let fails = 0;
    let totalPasses = 0;
    this.dice.flatMap((die) =>
      die.results.map((face) => {
        if (face.result == 6) {
          sixes++;
          totalPasses++;
        } else if (face.result <= 3) {
          fails++;
        } else {
          totalPasses++;
        }
      }),
    );
    const isFail = false;

    const chatData = {
      formula: isPrivate ? '???' : this._formula,
      flavor: isPrivate ? null : chatOptions.flavor,
      user: chatOptions.user,
      tooltip: isPrivate ? '' : await this.getTooltip(),
      sixes: sixes,
      fails: fails,
      isFail: isFail,
      isSuccess: !isFail,
      totalPasses: totalPasses,
    };
    return renderTemplate(chatOptions.template ?? '', chatData);
  }
}
