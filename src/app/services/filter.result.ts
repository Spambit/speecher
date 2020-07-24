export interface IFilterResult {
  command: ICommand;
  indices: { start: number; end: number }[];
  selectedname: string;
}

export interface ICommand {
  id: number;
  names: string[];
  replaceWith?: string;
}

export class Note {
  note: string;
  when: string;
  drive: {
    destFolderId: string;
  };
  name: string;
  words: Word[];
}

export enum Filters {
  comma,
  savenote,
  start,
  dot,
  newpara,
  createword
}

export interface Word {
  name: string;
  meaning: string;
  example: string[];
}
