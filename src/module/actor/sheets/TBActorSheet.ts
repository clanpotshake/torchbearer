import { TB } from '../../config';
import { getTBSettings, TBSettings } from '../../settings';
import { TBActiveEffect } from '../../ActiveEffect';
import { enforce, getGame } from '../../helpers';
import notifications from '../../ui/notifications';

export class TBActorSheet extends ActorSheet<ActorSheet.Options, TBActorSheetData> {
  /** @override */
  static get defaultOptions(): ActorSheet.Options {
    return foundry.utils.mergeObject(super.defaultOptions, {
      // TODO position and stuff
      classes: ['tb2', 'sheet', 'actor'],
      height: 620,
      width: 650,
      scrollY: ['values'],
      tabs: [{ navSelector: '.sheet-tabs', contentSelector: '.sheet-body', initial: 'values' }],
      dragDrop: [
        { dragSelector: '.item-list', dropSelector: null },
        { dragSelector: '.effect-list', dropSelector: null },
        { dragSelector: '.tb-test', dropSelector: null },
      ],
    });
  }

  /** @override */
  get template(): string {
    const basePath = 'systems/torchbearer/templates/sheets/actor';
    return `${basePath}/${this.actor.data.type}-sheet.hbs`;
  }

  /** @override */
  async getData(): Promise<TBActorSheetData> {
    const itemsByType = Object.fromEntries(
      Object.entries(this.actor.itemTypes).map(([itemType, items]) => {
        return [
          itemType,
          items.map((item) => item.data).sort((a, b) => (a.sort || 0) - (b.sort || 0)),
        ];
      }),
    );
    const gearBySlot = Object.fromEntries(
      Object.keys(TB.i18nKeys.slots).map((slot) => {
        const itemsInSlot = this.actor.items
          .filter((item) => {
            return item.data.type === 'gear' && item.data.data.containedIn === slot;
          })
          .map((item) => item.data);
        return [slot, itemsInSlot];
      }),
    );
    const ghostGear = this.actor.items
      .filter((item) => {
        return item.data.type === 'gear' && !item.data.data.containedIn;
      })
      .map((item) => item.data);

    const containers = this.actor.items.filter((item) => {
      return (
        item.data.type === 'gear' &&
        Object.values(item.data.data.capacity).some((slot) => {
          return slot > 0;
        })
      );
      // TODO isContainer isn't getting set properly, use it when the bug is fixed
      // return item.data.type === 'gear' && item.data.data.isContainer;
    });

    const enrichedEffectPromises = this.actor.effects.map(async (effect) => {
      return {
        ...effect.toObject(),
        icon: effect.data.icon ?? TBActiveEffect.FALLBACK_ICON,
        sourceName: await effect.getCurrentSourceName(),
        factor: effect.factor,
        isEffectivelyEnabled: !effect.data.disabled && !effect.isSuppressed,
      };
    });
    const enrichedEffects = await Promise.all(enrichedEffectPromises);

    const data = {
      ...this.addTooltipsToData(await super.getData()),
      config: TB,
      itemsByType,
      gearBySlot,
      containers,
      ghostGear,
      enrichedEffects,
      settings: getTBSettings(),
    };
    return data;
  }

  /**
   * Adds tooltips to the attributes, traits, and combatValues of the actor data of the given {@link ActorSheet.Data}.
   */
  protected addTooltipsToData(data: ActorSheet.Data): ActorSheet.Data {
    // const valueGroups = [data.data.data.attributes, data.data.data.traits, data.data.data.combatValues];

    // valueGroups.forEach((valueGroup) => {
    //   Object.values(valueGroup).forEach((attribute: ModifiableDataBaseTotal<number> & { tooltip?: string }) => {
    //     attribute.tooltip = this.getTooltipForValue(attribute);
    //   });
    // });
    return data;
  }

  /** @override */
  activateListeners(html: JQuery): void {
    super.activateListeners(html);

    if (!this.options.editable) return;
    // logger.info('actor is editable, registering listeners...');

    html.find('.control-item').on('click', this.onControlItem.bind(this));
    html.find('.change-item').on('change', this.onChangeItem.bind(this));

    html.find('.control-effect').on('click', this.onControlEffect.bind(this));
    html.find('.change-effect').on('change', this.onChangeEffect.bind(this));

    html.find('.rollable-item').on('click', this.onRollItem.bind(this));
    html.find('.rollable-check').on('click', this.onRollCheck.bind(this));
  }

  /**
   * Handles a click on an element of this sheet to control an embedded item of the actor corresponding to this sheet.
   *
   * @param event - The originating click event
   */
  protected onControlItem(event: JQuery.ClickEvent): void {
    logger.info('in onControlItem');
    event.preventDefault();
    const a = event.currentTarget;
    switch (a.dataset['action']) {
      case 'create':
        return this.onCreateItem(event);
      case 'edit':
        return this.onEditItem(event);
      case 'delete':
        return this.onDeleteItem(event);
    }
  }
  /**
   * Creates a new embedded item using the initial data defined in the HTML dataset of the clicked element.
   *
   * @param event - The originating click event
   */
  protected onCreateItem(event: JQuery.ClickEvent): void {
    logger.info('in onCreateItem');
    // TODO item limit validation goes here
    const { type, ...data } = foundry.utils.deepClone(event.currentTarget.dataset);
    const name = getGame().i18n.localize(`TB2.New${type.capitalize()}Name`);
    const itemData = {
      name: name,
      type: type,
      data: data,
    };
    Item.create(itemData, { parent: this.actor });
  }
  /**
   * Opens the sheet of the embedded item corresponding to the clicked element.
   *
   * @param event - The originating click event
   */
  protected onEditItem(event: JQuery.ClickEvent): void {
    logger.info('in onEditItem');
    const id = $(event.currentTarget)
      .parents(embeddedDocumentListEntryProperties.Item.selector)
      .data(embeddedDocumentListEntryProperties.Item.idDataAttribute);
    const item = this.actor.items.get(id);
    enforce(
      item,
      getGame().i18n.format('TB2.ErrorActorDoesNotHaveItem', { id, actor: this.actor.name }),
    );
    enforce(item.sheet);
    item.sheet.render(true);
  }

  /**
   * Applies a change to a property of an embedded item depending on the `data-property` attribute of the
   * {@link HTMLInputElement} that has been changed and its new value.
   *
   * @param event - The originating change event
   */
  protected onChangeItem(event: JQuery.ChangeEvent): void {
    const target = event.target;
    const data = event.data;
    logger.info('onChangeItem.target', target);
    logger.info('onChangeItem.data', data);
    return this.onChangeEmbeddedDocument(event, 'Item');
  }
  /**
   * Handles a click on an element of this sheet to control an embedded effect of the actor corresponding to this
   * sheet.
   *
   * @param event - The originating click event
   */
  protected onControlEffect(event: JQuery.ClickEvent): void {
    logger.info('in onControlEffect');
    event.preventDefault();
    const a = event.currentTarget;
    switch (a.dataset['action']) {
      case 'create':
        return this.onCreateEffect();
      case 'edit':
        return this.onEditEffect(event);
      case 'delete':
        return this.onDeleteEffect(event);
    }
  }

  /**
   * Creates a new embedded effect.
   */
  protected onCreateEffect(): void {
    logger.info('in onCreateEffect');
    TBActiveEffect.createDefault(this.actor);
  }

  /**
   * Opens the sheet of the embedded effect corresponding to the clicked element.
   *
   * @param event - The originating click event
   */
  protected onEditEffect(event: JQuery.ClickEvent): void {
    logger.info('in onEditEffect');
    const id = $(event.currentTarget)
      .parents(embeddedDocumentListEntryProperties.ActiveEffect.selector)
      .data(embeddedDocumentListEntryProperties.ActiveEffect.idDataAttribute);
    const effect = this.actor.effects.get(id);
    enforce(
      effect,
      getGame().i18n.format('TB2.ErrorActorDoesNotHaveEffect', { id, actor: this.actor.name }),
    );
    effect.sheet.render(true);
  }

  /**
   * Handle clickable check rolls.
   * @param event - The originating click event
   */
  protected onRollCheck(event: JQuery.ClickEvent): void {
    logger.info('in onRollCheck');
    event.preventDefault();
    const check = event.currentTarget.dataset['check'];
    this.actor.rollCheck(check).catch((e) => notifications.error(e, { log: true }));
  }

  /**
   * Handle clickable item rolls.
   * @param event - The originating click event
   */
  protected onRollItem(event: JQuery.ClickEvent): void {
    logger.info('in onRollItem');
    event.preventDefault();
    const id = $(event.currentTarget)
      .parents(embeddedDocumentListEntryProperties.Item.selector)
      .data(embeddedDocumentListEntryProperties.Item.idDataAttribute);
    const item = this.actor.items.get(id);
    enforce(
      item,
      getGame().i18n.format('TB2.ErrorActorDoesNotHaveItem', { id, actor: this.actor.name }),
    );
    item.roll().catch((e) => notifications.error(e, { log: true }));
  }

  /**
   * Deletes the embedded item corresponding to the clicked element.
   *
   * @param event - The originating click event
   */
  protected onDeleteItem(event: JQuery.ClickEvent): void {
    const li = $(event.currentTarget).parents(embeddedDocumentListEntryProperties.Item.selector);
    this.actor.deleteEmbeddedDocuments('Item', [
      li.data(embeddedDocumentListEntryProperties.Item.idDataAttribute),
    ]);
    li.slideUp(200, () => this.render(false));
  }
  /**
   * Deletes the embedded item corresponding to the clicked element.
   *
   * @param event - The originating click event
   */
  protected onDeleteEffect(event: JQuery.ClickEvent): void {
    const li = $(event.currentTarget).parents(
      embeddedDocumentListEntryProperties.ActiveEffect.selector,
    );
    const id = li.data(embeddedDocumentListEntryProperties.ActiveEffect.idDataAttribute);
    this.actor.deleteEmbeddedDocuments('ActiveEffect', [id]);
    li.slideUp(200, () => this.render(false));
  }

  /**
   * Applies a change to a property of an embedded effect depending on the `data-property` attribute of the
   * {@link HTMLInputElement} that has been changed and its new value.
   *
   * @param event - The originating change event
   */
  protected onChangeEffect(event: JQuery.ChangeEvent): void {
    logger.info('in onChangeEffect');
    return this.onChangeEmbeddedDocument(event, 'ActiveEffect');
  }

  /**
   * Applies a change to a property of an embedded document of the actor belonging to this sheet. The change depends
   * on the `data-property` attribute of the {@link HTMLInputElement} that has been changed and its new value.
   *
   * @param event - The originating change event
   * @param documentName - The name of the embedded document to be changed.
   */
  protected onChangeEmbeddedDocument(
    event: JQuery.ChangeEvent,
    documentName: 'Item' | 'ActiveEffect',
  ): void {
    logger.info('in onChangeEmbeddedDocument');
    event.preventDefault();
    const element = $(event.currentTarget).get(0);
    const isValid: boolean =
      element instanceof HTMLInputElement || element instanceof HTMLSelectElement;
    enforce(isValid);
    if (element.disabled) return;

    const effectElement = element.closest(
      embeddedDocumentListEntryProperties[documentName].selector,
    );
    enforce(effectElement instanceof HTMLElement);
    const id =
      effectElement.dataset[embeddedDocumentListEntryProperties[documentName].idDataAttribute];
    const property = element.dataset['property'];
    enforce(
      property !== undefined,
      TypeError("HTML element does not provide 'data-property' attribute"),
    );

    const newValue = this.parseValue(element);
    this.actor.updateEmbeddedDocuments(documentName, [{ _id: id, [property]: newValue }]);
  }
  /**
   * Parses the value of the given {@link HTMLInputElement} depending on the element's type
   * The value is parsed to:
   * - checkbox: `boolean`, if the attribute `data-inverted` is set to a truthy value, the parsed value is inverted
   * - text input: `string`
   * - number: `number`
   *
   * @param element - The input element to parse the value from
   */
  protected parseValue(element: HTMLInputElement): boolean | string | number {
    switch (element.type) {
      case 'checkbox': {
        const inverted = Boolean(element.dataset['inverted']);
        const value: boolean = element.checked;
        return inverted ? !value : value;
      }
      case 'text': {
        const value: string = element.value;
        return value;
      }
      case 'number': {
        const value = Number(element.value.trim());
        return value;
      }
      case 'select-one': {
        const value = element.value;
        return value;
      }
      default: {
        throw new TypeError(
          'Binding of item property to this type of HTML element not supported; given: ' + element,
        );
      }
    }
  }
}

interface TBActorSheetData extends ActorSheet.Data<ActorSheet.Options> {
  config: typeof TB;
  itemsByType: Record<string, foundry.data.ItemData[]>;
  gearBySlot: Record<string, foundry.data.ItemData[]>;
  enrichedEffects: EnrichedActiveEffectDataSource[];
  settings: TBSettings;
}
type ActiveEffectDataSource = foundry.data.ActiveEffectData['_source'];

interface EnrichedActiveEffectDataSource extends ActiveEffectDataSource {
  icon: string;
  sourceName: string;
}

/**
 * This object contains information about specific properties embedded
 * document list entries for each different type.
 */
const embeddedDocumentListEntryProperties = Object.freeze({
  ActiveEffect: {
    selector: '.effect',
    idDataAttribute: 'effectId',
  },
  Item: {
    selector: '.item',
    idDataAttribute: 'itemId',
  },
});
