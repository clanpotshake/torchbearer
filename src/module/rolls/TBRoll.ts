import { getGame } from '../helpers';
import { TBTest } from './TBTest';
import logger from '../logger';

export class TBRoll<D extends Record<string, unknown> = Record<string, unknown>> extends Roll<D> {
  static CHAT_TEMPLATE = 'systems/torchbearer/templates/dice/dice/roll.hbs';
  static TOOLTIP_TEMPLATE = 'systems/torchbearer/templates/dice/dice/dice-tooltip.hbs';

  /**
   * @override
   */
  async render(chatOptions: Parameters<Roll['render']>[0] = {}): Promise<string> {
    logger.info('TBRoll.render', this);
    const x = await super.getTooltip();
    logger.info('tooltip is', x);
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
    let successes = 0;
    this.dice.flatMap((die) =>
      die.results.map((face) => {
        if (face.result == 6) {
          sixes++;
          successes++;
        } else if (face.result <= 3) {
          fails++;
        } else {
          successes++;
        }
      }),
    );
    const isFail = false;

    const chatData = {
      formula: isPrivate ? '???' : this._formula,
      flavor: isPrivate ? null : chatOptions.flavor,
      user: chatOptions.user,
      tooltip: isPrivate ? '' : await this.getTooltip(), // this is where the dice face display comes from
      sixes: sixes,
      fails: fails,
      isFail: isFail,
      isSuccess: !isFail,
      totalSuccesses: successes,
    };
    return renderTemplate(chatOptions.template ?? '', chatData);
  }

  /**
   * @override
   */
  getTooltip(): Promise<string> {
    // dice highlighting css comes out of this
    return super.getTooltip();
  }
}
