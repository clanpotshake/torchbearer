export class TBRoll<D extends Record<string, unknown> = Record<string, unknown>> extends Roll<D> {
  static CHAT_TEMPLATE = 'systems/torchbearer/templates/dice/dice/roll.hbs';

  async render(chatOptions: Parameters<Roll['render']>[0] = {}): Promise<string> {
    return super.render(chatOptions);
  }
}
