// In the future I can create a @types/jsonl-db package, but for now this is enough
declare module "jsonl-db" {
  interface JsonlFile<T> {
    add(o: T): Promise<void>;
    addMany(os: T[]): Promise<void>;
    first(): Promise<T | undefined>;
    last(): Promise<T | undefined>;
    read(onLine: (line: T) => Promise<boolean> | boolean): Promise<void>;
    readByBatch(
      onBatch: (batch: T[]) => Promise<boolean> | boolean,
      batchSize: number,
    ): Promise<void>;
    findWhere<K extends keyof T>(
      attribute: K,
      value: T[K],
    ): Promise<T | undefined>;
    findMatch(matchFn: (line: T) => Promise<boolean> | boolean): Promise<T[]>;
    count(): Promise<number>;
    countMatch(
      matchFn: (line: T) => Promise<boolean> | boolean,
    ): Promise<number>;
    updateWhere<K extends keyof T>(
      attribute: K,
      value: T[K],
      updateFn: (line: T) => Promise<T>,
    ): Promise<void>;
    updateMatch(
      matchFn: (line: T) => Promise<boolean> | boolean,
      updateFn: (line: T) => Promise<T>,
    ): Promise<void>;
    deleteWhere<K extends keyof T>(attribute: K, value: T[K]): Promise<void>;
    deleteMatch(
      matchFn: (line: T) => Promise<boolean> | boolean,
    ): Promise<void>;
    deleteFile(): Promise<void>;
  }

  function jsonlFile<T>(path: string): JsonlFile<T>;

  export = jsonlFile;
}
