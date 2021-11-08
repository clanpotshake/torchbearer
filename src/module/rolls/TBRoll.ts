import { getGame } from '../helpers';

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

    const chatData = {
      formula: isPrivate ? '???' : this._formula,
      flavor: isPrivate ? null : chatOptions.flavor,
      user: chatOptions.user,
      tooltip: isPrivate ? '' : await this.getTooltip(),
      total: isPrivate ? '?' : Math.round((this.total ?? 0) * 100) / 100,
    };
    return renderTemplate(chatOptions.template ?? '', chatData);
  }
}
