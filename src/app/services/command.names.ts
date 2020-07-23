import { ICommand, Filters } from './filter.result';

export const COMMANDS: ICommand[] = [
  { id: Filters.start, names: ['command'] },
  { id: Filters.comma, names: ['coma', 'comma'], replaceWith: ', ' },
  {
    id: Filters.savenote,
    names: [
      'save note',
      'save this note',
      'create note',
      'create this note',
      'create a note',
      'create a note of it',
    ],
  },
  { id: Filters.dot, names: ['dot'], replaceWith: '. ' },
  {
    id: Filters.newpara,
    names: ['new para', 'new paida'],
    replaceWith: '\n\n\t\t',
  },
  {
    id: Filters.createword,
    names: [
      'add the word',
      'create the word',
      'at the word',
      'at a word',
      'create word',
      'add word',
      'adwords'
    ],
    replaceWith: '',
  },
];
