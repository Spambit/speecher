import {
  Component,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Note } from '@services/filter.result';
import { createInstanceOfClass } from 'src/app/utils';
import { NavConfig } from '@components/speecher-nav/speecher-nav.component';
import { Template } from '@angular/compiler/src/render3/r3_ast';
import { TemplateService } from '@services/template.service';
import { AccordianComponent } from '@components/accordian/accordian.component';

@Component({
  selector: 'speecher-allnotes',
  templateUrl: 'allnotes.component.html',
  styleUrls: ['allnotes.component.scss'],
})
export class AllNotesComponent implements OnInit {
  navConfig: NavConfig = {
    header: 'All Stories',
    button: { show: false },
  };
  notes: Note[] = [];
  selectedItem: HTMLElement;
  contentTemplate: TemplateRef<any>;
  constructor(
    private templateService: TemplateService,
    private viewRef: ViewContainerRef
  ) {}
  listClick(event: Event, listItem: HTMLElement) {
    this.selectedItem = listItem;
  }
  ngOnInit() {
    this.templateService
      .getTemplateContent(this.viewRef, AccordianComponent)
      .then((ref) => {
        this.contentTemplate = ref;
      });
    for (let i = 0; i < 5; i++) {
      this.notes.push(
        createInstanceOfClass(Note, {
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
  }

  identify(index: number) {
    return index;
  }
}
