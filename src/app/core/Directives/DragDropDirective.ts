import { Directive, Output, Input, EventEmitter, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appDragDrop]'
})
export class DragDropDirective {

  @Output() fileDropped = new EventEmitter<any>();

  @HostBinding('class.fileOver') fileOver = false;


  // Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(evt: any): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = true;
  }

  // Dragleave listener
  @HostListener('dragleave', ['$event']) public onDragLeave(evt: any): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
  }

  // Drop listener
  @HostListener('drop', ['$event']) public ondrop(evt: any): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
    if (evt.dataTransfer.files.length > 0) {
      this.fileDropped.emit(evt.dataTransfer);
    }
  }

}
