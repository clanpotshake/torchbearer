export interface ModifiableData<T> {
  mod: T;
}

export interface HasBase<T> {
  base: T;
}
export interface HasTotal<T> {
  total: T;
}
export interface ModifiableDataBase<T> extends ModifiableData<T>, HasBase<T> {}
export interface ModifiableDataBaseTotal<T> extends ModifiableDataBase<T>, HasTotal<T> {}
