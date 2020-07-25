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
import { LocalStorageService } from '@services/store.service';

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
    private viewRef: ViewContainerRef,
    private storeService: LocalStorageService,
  ) {}
  async ngOnInit() {
    this.templateService
      .getTemplateContent(this.viewRef, AccordianComponent)
      .then((ref) => {
        this.contentTemplate = ref;
      });

    this.notes = await this.storeService.allNotes<Note>();
  }

  identify(index: number) {
    return index;
  }
}
