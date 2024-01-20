export type TEntityUniqueKey = Symbol | string | number;

export type TEntityPayload<T> = {
  id: TEntityUniqueKey;
  change: Partial<T>;
};

export type EntityState<T> = {
  ids: Set<TEntityUniqueKey>;
  entities: Map<TEntityUniqueKey, T>;
};

export interface Patch<TEntity> {
  addOne: (state: EntityState<TEntity>, entity: TEntity) => void;
  addMany: (state: EntityState<TEntity>, entity: TEntity[]) => void;
  setOne: (state: EntityState<TEntity>, entity: TEntity) => void;
  setMany: (state: EntityState<TEntity>, entity: TEntity[]) => void;
  removeOne: (state: EntityState<TEntity>, id: TEntityUniqueKey) => void;
  removeAll: (state: EntityState<TEntity>, ids: TEntityUniqueKey[]) => void;
  updateOne: (
    state: EntityState<TEntity>,
    entity: TEntityPayload<TEntity>
  ) => void;
  updateMany: (
    state: EntityState<TEntity>,
    entity: TEntityPayload<TEntity>[]
  ) => void;
}
