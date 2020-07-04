import { Injectable } from '@angular/core';
import { IFilterResult, ICommand, Filters } from './filter.result';

@Injectable({
  providedIn: 'root',
})
export class CommandService {
  readonly commands: ICommand[] = [
    { id: Filters.start, names: ['command'] },
    { id: Filters.comma, names: ['coma', 'comma'], replaceWith: ', ' },
    { id: Filters.createnote, names: ['create note'] },
    { id: Filters.dot, names: ['dot'], replaceWith: '. ' },
  ];
  constructor() {}
  filter(str: string, filters: Filters[] = []): IFilterResult[] {
    const filteredCommands =
      filters.length === 0
        ? this.commands
        : this.commands.filter((item) => filters.includes(item.id));
    const extractedCommands: IFilterResult[] = [];
    filteredCommands.forEach((command) => {
      command.names.forEach((name) => {
        const indices = this.findAll(str, name);
        if (indices.length !== 0){
          const foundCommand = { command, indices, selectedname: name };
          extractedCommands.push(foundCommand);
        }
      });
    });
    return extractedCommands;
  }

  process(filterResult: IFilterResult[], str: string): string {
    for (const result of filterResult) {
      const regexp = new RegExp(result.selectedname, 'g');
      str = str.replace(regexp, result.command.replaceWith || '');
    }
    return str;
  }

  private findAll(str: string, search: string): { start: number, end: number }[] {
    const regexp = new RegExp(search, 'g');
    let match;
    const arr: {start: number, end: number}[] = [];
    // tslint:disable-next-line: no-conditional-assignment
    while ((match = regexp.exec(str)) !== null) {
      arr.push({ start: match.index, end: regexp.lastIndex });
    }
    return arr;
  }
}
