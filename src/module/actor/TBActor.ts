import { DisplayClass } from '../item/TBItem';

export class TBActor extends Actor {
  prepareData(): void {
    super.prepareData();
  }
}

export interface TracksTests {
  passes: number;
  fails: number;
}
export interface Ability extends TracksTests, DisplayClass {
  foo: number;
}
export interface DisplayClass {
  cssClass?: string;
}
