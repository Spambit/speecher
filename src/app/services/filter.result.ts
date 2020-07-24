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
  words: IWord[];
}

export enum Filter {
  comma,
  savenote,
  start,
  dot,
  newpara,
  createword,
  wordname,
  wordmeaning,
  wordexample,
  wordclose,
}

export interface IWord {
  name: string;
  meaning: string;
  example: string[];
}

export enum SpeechEvent {
  didStartCaptureAudio,
  didEndCaptureAudio,
  didStopListening,
  noMatchAnyGrammer,
  didDetectSound,
  didStopDetectingSound,
  didDetectRecognizableSound,
  didStartListening,
  didReceiveResult,
  didRequestStop,
  didStartSpeaking,
  didStopSpeaking,
}

export interface ISpeechError {
  reason: string;
  original: any;
}
