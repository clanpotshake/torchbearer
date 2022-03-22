import { getGame } from '../helpers';
import { TBTerm } from './TBTerm';
import logger from '../logger';

export class TBRoll<D extends Record<string, unknown> = Record<string, unknown>> extends Roll<D> {
  constructor(formula: string, data?: D, options?: Roll['options']) {
    console.log('TBRoll constructor, formula: ' + formula);
    super(formula, data, options);
  }
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

    const firstDiceTerm = this.dice[0];
    const successes = firstDiceTerm instanceof TBTerm ? firstDiceTerm.successes : 0;
    const sixes = firstDiceTerm instanceof TBTerm ? firstDiceTerm.rerollableSixes : 0;
    const fails = firstDiceTerm instanceof TBTerm ? firstDiceTerm.rerollableFails : 0;
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
      total: successes,
      totalSuccesses: successes,
    };
    logger.info('TBRoll.render.chatData', chatData);
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
