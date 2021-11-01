import { TB } from '../../config';
import { getGame } from '../../helpers';
import { TBActiveEffect } from '../../ActiveEffect';

export class TBItemSheet extends ItemSheet<ItemSheet.Options, TBItemSheetData> {
  /** @override */
  static get defaultOptions(): ItemSheet.Options {
    return foundry.utils.mergeObject(super.defaultOptions, {
      width: 540,
      height: 400,
      classes: ['tb2', 'sheet', 'item'],
      tabs: [
        { navSelector: '.sheet-tabs', contentSelector: '.sheet-body', initial: 'description' },
      ],
      scrollY: ['.tab.description', '.tab.effects', '.tab.details'],
    });
  }

  /** @override */
  get template(): string {
    const basePath = 'systems/tb2/templates/sheets/item';
    return `${basePath}/${this.item.data.type}-sheet.hbs`;
  }

  /** @override */
  async getData(): Promise<TBItemSheetData> {
    const data = {
      ...(await super.getData()),
      config: TB,
      isOwned: this.item.isOwned,
      actor: this.item.actor,
    };
    return data;
  }

  /** @override */
  setPosition(
    options: Partial<Application.Position> = {},
  ): (Application.Position & { height: number }) | void {
    const position = super.setPosition(options);
    if (position) {
      const sheetBody = this.element.find('.sheet-body');
      const bodyHeight = position.height - 192;
      sheetBody.css('height', bodyHeight);
    }

    return position;
  }

  /** @override */
  activateListeners(html: JQuery): void {
    super.activateListeners(html);

    if (!this.options.editable) return;

    html.find('.effect-control').on('click', this._onManageActiveEffect.bind(this));
  }

  /**
   * Handle management of ActiveEffects.
   * @param event - he originating click event
   */
  protected async _onManageActiveEffect(event: JQuery.ClickEvent): Promise<unknown> {
    event.preventDefault();

    if (this.item.isOwned) {
      // return notifications.warn(
      //   getGame().i18n.localize('DS4.WarningManageActiveEffectOnOwnedItem'),
      // );
    }
    const a = event.currentTarget;
    const li = $(a).parents('.effect');

    switch (a.dataset['action']) {
      case 'create':
        return this.createActiveEffect();
      case 'edit':
        const id = li.data('effectId');
        const effect = this.item.effects.get(id);
        if (!effect) {
          throw new Error(
            getGame().i18n.format('DS4.ErrorItemDoesNotHaveEffect', { id, item: this.item.name }),
          );
        }
        return effect.sheet.render(true);
      case 'delete': {
        return this.item.deleteEmbeddedDocuments('ActiveEffect', [li.data('effectId')]);
      }
    }
  }
  protected createActiveEffect(): void {
    TBActiveEffect.createDefault(this.item);
  }
}

interface TBItemSheetData extends ItemSheet.Data<ItemSheet.Options> {
  config: typeof TB;
  isOwned: boolean;
  actor: TBItemSheet['item']['actor'];
}
