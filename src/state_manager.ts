export enum Status {
  pending,
  rejected,
  resolved,
}

export const reducer = function <T>(promise: Promise<T>) {
  const cases: Record<Status, Array<(payload: any) => void>> = {
    [Status.pending]: [],
    [Status.rejected]: [],
    [Status.resolved]: [],
  };

  return {
    addCase(status: Status, action: (payload: Awaited<T>) => void) {
      cases[status].push(action);
      return this;
    },
    async execute() {
      for (const action of cases[Status.pending]) {
        action(null);
      }

      return promise
        .then((result) => {
          for (const action of cases[Status.resolved]) action(result);

          return Promise.resolve(result);
        })
        .catch((error) => {
          for (const action of cases[Status.rejected]) action(error);

          return Promise.reject(error);
        });
    },
  };
};
