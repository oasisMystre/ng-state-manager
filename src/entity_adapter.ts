import type {
  EntityState,
  Patch,
  TEntityPayload,
  TEntityUniqueKey,
} from "./core/patch";

type TCreateEntityAdapterParam<T> = {
  sortBy?(a: T, b: T): number;
  getSelectorId(instance: T): TEntityUniqueKey;
};

export class EntityAdapter<T> implements Patch<T> {
  constructor(private params: TCreateEntityAdapterParam<T>) {}

  getSelectorId(instance: T) {
    return this.params.getSelectorId(instance);
  }

  addOne(state: EntityState<T>, entity: T) {
    const id = this.getSelectorId(entity);
    state.ids.add(id);
    state.entities.set(id, entity);
  }

  addMany(state: EntityState<T>, entities: T[]) {
    const ids = new Set();
    const payload = new Map();

    /// add entities once instead of using addOne func
    /// To prevent dom flicking when entity are added one by one
    for (const entity of entities) {
      const id = this.getSelectorId(entity);
      ids.add(id);
      payload.set(id, entity);
    }

    state.entities = payload;
  }

  setOne(state: EntityState<T>, entity: T) {
    const id = this.getSelectorId(entity);
    if (state.entities.has(id)) state.entities.set(id, entity);
  }

  setMany(state: EntityState<T>, entities: T[]) {
    for (const entity of entities) {
      /// ignore flicking, since item suppose to exist in dom
      this.setOne(state, entity);
    }
  }

  removeOne(state: EntityState<T>, id: TEntityUniqueKey) {
    state.ids.delete(id);
    state.entities.delete(id);
  }

  /// Todo better way to bulk remove?
  removeAll(state: EntityState<T>, ids: TEntityUniqueKey[]) {
    for (const id of ids) {
      state.ids.delete(id);
      state.entities.delete(id);
    }
  }

  updateOne(state: EntityState<T>, payload: TEntityPayload<T>) {
    const value = state.entities.get(payload.id);

    if (!value) return;

    Object.assign(value, payload.change);
    state.entities.set(payload.id, value);
  }

  updateMany(state: EntityState<T>, entities: TEntityPayload<T>[]) {
    for (const entity of entities) {
      this.updateOne(state, entity);
    }
  }

  getInitialState<V>(defaultState: V) {
    return {
      ...defaultState,
      ids: new Set<TEntityUniqueKey>(),
      entities: new Map<TEntityUniqueKey, T>(),
    };
  }

  getSelector(state: EntityState<T>) {
    return {
      selectAll: () => {
        const values = Array.from(state.entities.values());
        if (this.params.sortBy) return values.sort(this.params.sortBy);
        return values;
      },

      selectOne(id: TEntityUniqueKey) {
        return state.entities.get(id)!;
      },

      getIds() {
        return Array.from(state.ids.values());
      },
    };
  }
}

export function createEntityAdapter<T>(params: TCreateEntityAdapterParam<T>) {
  return new EntityAdapter(params);
}
