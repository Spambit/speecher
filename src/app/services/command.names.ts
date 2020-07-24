import { ICommand, Filter } from './filter.result';

export const COMMANDS: ICommand[] = [
  { id: Filter.start, names: ['command'] },
  { id: Filter.comma, names: ['coma', 'comma'], replaceWith: ', ' },
  {
    id: Filter.savenote,
    names: [
      'save note',
      'save this note',
      'create note',
      'create this note',
      'create a note',
      'create a note of it',
    ],
  },
  { id: Filter.dot, names: ['dot'], replaceWith: '. ' },
  {
    id: Filter.newpara,
    names: ['new para', 'new paida'],
    replaceWith: '\n\n\t\t',
  },
  {
    id: Filter.createword,
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
  {
    id: Filter.wordname,
    names: [
      'add name',
      'adname',
    ],
    replaceWith: '',
  },
  {
    id: Filter.wordexample,
    names: [
      'add example',
    ],
    replaceWith: '',
  },
  {
    id: Filter.wordmeaning,
    names: [
      'ad meaning',
      'add meaning',
    ],
    replaceWith: '',
  },
];
