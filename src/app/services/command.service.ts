import { Injectable } from '@angular/core';
import { IFilterResult, ICommand, Filter } from './filter.result';
import { COMMANDS } from './command.names';

@Injectable({
  providedIn: 'root',
})
export class CommandService {
  constructor() {}
  filter(str: string, filters: Filter[] = []): IFilterResult[] {
    str = str.toLowerCase();
    const filteredCommands =
      filters.length === 0
        ? COMMANDS
        : COMMANDS.filter((item) => filters.includes(item.id));
    const extractedCommands: IFilterResult[] = [];
    filteredCommands.forEach((command) => {
      command.names.forEach((name) => {
        const indices = this.findAll(str, name);
        if (indices.length !== 0) {
          const foundCommand = { command, indices, selectedname: name };
          extractedCommands.push(foundCommand);
        }
      });
    });
    return extractedCommands;
  }

  process(filterResult: IFilterResult[], str: string): string {
    str = str.toLowerCase();
    for (const result of filterResult) {
      const regexp = new RegExp(result.selectedname, 'g');
      str = str.replace(regexp, result.command.replaceWith || '');
    }
    return str;
  }

  private findAll(
    str: string,
    search: string
  ): { start: number; end: number }[] {
    str = str.toLowerCase();
    const regexp = new RegExp(search, 'g');
    let match;
    const arr: { start: number; end: number }[] = [];
    // tslint:disable-next-line: no-conditional-assignment
    while ((match = regexp.exec(str)) !== null) {
      arr.push({ start: match.index, end: regexp.lastIndex });
    }
    return arr;
  }
}
