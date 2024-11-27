export type StorageOptions = {
  autoSave?: false | number;
};

export class LocalStorageManager {
  _items = new Map();

  constructor({ autoSave = false }: StorageOptions) {
    if (autoSave)
      setInterval(() => {
        this.saveItems();
      }, autoSave);
  }

  setItem(key: string, value: object) {
    this._items.set(key, value);
  }

  getItem<T>(key: string, initialize?: (...args: unknown[]) => T) {
    let item = this._items.get(key);

    if (item) return item;

    const json = window.localStorage.getItem(key);

    const serialized = json && JSON.parse(json);

    if (initialize) item = initialize(serialized);
    else item = serialized;

    if (item) this._items.set(key, item);

    return item;
  }

  saveItems() {
    for (const [key, value] of this._items.entries()) {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  }
}
