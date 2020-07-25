import { Injectable } from '@angular/core';
import * as forage from 'localforage';
import { DateService } from './date.service';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  private stores = {} as {
    string: LocalForage;
  };
  constructor(private dateService: DateService) {
    const allTypes = StoreType.allNames();
    for (const type of allTypes) {
      this.stores[type] = this.createDb(type);
    }
  }

  private createDb(name: string) {
    return forage.createInstance({
      name: 'speecher-db',
      driver: forage.INDEXEDDB,
      storeName: name
    });
  }

  private storeOf(type: StoreType): LocalForage{
    return this.stores[type.storeName];
  }

  store(data: Array<any> |
    ArrayBuffer |
    Blob |
    Float32Array |
    Float64Array |
    Int8Array |
    Int16Array |
    Int32Array |
    number |
    object |
    Uint8Array |
    Uint8ClampedArray |
    Uint16Array |
    Uint32Array |
    // tslint:disable-next-line: align
    string, key: string, type: StoreType) {
    const store = this.storeOf(type);
    return store.setItem(key, data);
  }

  storeTodaysNote(data: any): Promise<any>{
    return this.store(data, this.dateService.today, StoreType.note);
  }


  todaysNote<T>(): Promise<T> {
    return this.storeOf(StoreType.note).getItem(this.dateService.today);
  }

  async allNotes<T>(): Promise<T[]> {
    const table = this.storeOf(StoreType.note);
    const keys = await table.keys();
    const notes: T[] = [];
    for (const key of keys) {
      notes.push(await table.getItem(key));
    }
    return notes;
  }
}

export class StoreType {
  private constructor(val: number, name: string){
    this.val = val;
    this.name = name;
  }
  static readonly note = new StoreType(0, 'speecher-note');
  static readonly story = new StoreType(1, 'speecher-story');
  static readonly words = new StoreType(2, 'speecher-words');
  private val = -1;
  private name = '';

  static allNames(): string[] {
    return [
      StoreType.note.storeName,
      StoreType.story.storeName,
      StoreType.words.storeName
    ];
  }
  get storeName(){
     return this.name;
  }
}
