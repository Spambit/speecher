export interface IFilterResult {
  command: ICommand;
  indices: { start: number, end: number}[];
  selectedname: string;
}

export interface ICommand {
  id: number ;
  names: string[];
  replaceWith?: string;
}

export enum Filters {
  comma,
  createnote,
  start,
  dot,
  newpara
}
