# NG State Adapter

State management made easier, add, set, update and remove entries from state easily with well optimized dsa and functions

## Usage with Pinia

```ts
import { createEntityAdapter, reducer, Status } from "ng-state-adapter";

const userAdapter = createEntityAdapter<User>({
    getSelectorId: (instance) => instance.id
});

type UserState = {
    state: "idle" | "pending" | "rejected" | "resolved",
    currentUser: User | null
}

export const useUserStore = defineStore({
    state: () => userAdapter.getInitialState<UserState>({
        state: "idle",
        currentUser: null,
    }),
    actions: {
        fetchUser(){
            return reducer(Api.instance.userProvider.currentUser())
            .addCase(Status.pending, () => {
                this.state = "pending";
            })
            .addCase(Status.rejected, () => {
                this.state = "rejected";
            })
            .addCase(Status.resolved, ({ data }) => {
                this.state = "resolved";
                this.currentUser = data;
            }).execute();
        },
        fetchUsers(){
            return reducer(Api.instance.userProvider.list())
            .addCase(Status.pending, () => {
                this.state = "pending";
            })
            .addCase(Status.rejected, () => {
                this.state = "rejected";
            })
            .addCase(Status.resolved, ({ data }) => {
                this.state = "resolved";
                userAdapter.addMany(this, data);
            }).execute();
        },
        async updateUser(id: number){
            const { data } = await Api.instance.userProvider.update({ path: id });
            userAdapter.updateOne(this, {id, change: data });
        }
    },
})
```

## reducer

A state machine for promise values

```ts
/// return an object with
// addCase and execute function
reducer<T>(value: Promise<T>)
```

### addCase

```ts
addCase(Status, callback: () => void);
```

## addOne

Add a single entity if not exist

```ts
addOne(state: EntityState<T>, payload: T) : void
```

## addMany

Add multiple entity if not exist

```ts
addMany(state: EntityState<T>, payload: Array<T>) : void
```

## setOne

Set a single entity if already exist

```ts
setOne(state: EntityState<T>, payload: T) : void
```

## setMany

Set multiple entity if already exist

```ts
setMany(state: EntityState<T>, payload: Array<T>): void
```

## updateOne

Update single entity if exist

```ts
updateOne(state: EntityState<T>, payload: payload: {id: TEntityUniqueKey, change: Partial<T>}) : void
```

## updateMany

Update multiple entity if exist

```ts
adapter.updateMany(state: EntityState<T>, payload: Array<{id: EntityUniqueKey, change: Partial<T>}>): void
```

## removeOne

Remove single entity if exist

```ts
removeOne(state: EntityState<T>, payload: TEntityUniqueKey): void
```

## removeMany

Remove multiple entity if exist

```ts
removeMany(state: EntityState<T>, payload: TEntityUniqueKey[]): void
```
