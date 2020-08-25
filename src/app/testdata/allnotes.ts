import { createInstanceOfClass } from '../utils';
import { Note, IAccordianContext, WordSection } from '@services/filter.result';

export class MockData {
  static notes(howmany: number): Note[] {
    const notes: Note[] = [];
    for (let i = 0; i < howmany; i++) {
      notes.push(
        createInstanceOfClass(Note, {
          when: '20-8-2020',
          words: [
            {
              name: 'Go',
              meaning: 'Move or make movement',
              example: [
                'I go now.',
                'He goes to park.',
                'I am going to start.',
              ],
            },
            {
              name: 'Go',
              meaning: 'Move or make movement',
              example: [
                'I go now.',
                'He goes to park.',
                'I am going to start.',
              ],
            },
            {
              name: 'Go',
              meaning: 'Move or make movement',
              example: [
                'I go now.',
                'He goes to park.',
                'I am going to start.',
              ],
            },
          ],
          name: `${i}-th-Note`,
          note: `Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia
      aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor,
      sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica,
      craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings
      occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus
      labore sustainable VHS.`,
        })
      );
    }
    return notes;
  }

  static wordPanelData(): { context: IAccordianContext } {
    const note = this.notes(1)[0];
    return {
      context: {
        word: {
          ...note.words[0],
          ...{
            dirtySection: WordSection.name,
            onClose: () => {},
            onChange: (event: Event) => {},
          },
        },
      },
    };
  }
}
