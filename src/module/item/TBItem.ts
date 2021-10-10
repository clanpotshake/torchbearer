declare global {
  interface DocumentClassConfig {
    Item: typeof TBItem;
  }
}
export class TBItem extends Item {
  /** @override */
  prepareData(): void {
    super.prepareData();
  }
  /** @override */
  prepareDerivedData(): void {
    super.prepareDerivedData();
  }
}
