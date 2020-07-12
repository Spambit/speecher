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

export interface Note {
  note: string;
  when: string;
  drive: {
    dest: string;
  };
  name: string;
}

export const CreateNote = ({
  note = '',
  name = '',
  timeNow = '',
  driveParentFolderId = '',
}) => {
  return {
    note,
    when: timeNow,
    drive: {
      dest: driveParentFolderId,
    },
    name,
  };
};

export enum Filters {
  comma,
  savenote,
  start,
  dot,
  newpara,
  createword
}
