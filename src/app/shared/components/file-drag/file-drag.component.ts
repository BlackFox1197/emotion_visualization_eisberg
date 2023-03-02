import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BackendService} from "../../../services/backend-service/backend.service";
import {ModelOutput} from "../../../entity/ModelOutput";

@Component({
  selector: 'app-file-drag',
  templateUrl: './file-drag.component.html',
  styleUrls: ['./file-drag.component.scss']
})
export class FileDragComponent implements OnInit {

  @Input() files: any = [];
  isOneFileError = false;
  isWrongFormatError = false;
  // this should be an array
  @Input() mimeTypes = ['image/*'];
  @Input() justOneFile = true;
  @Input() titleString = 'Cover';
  @Input() hideFiles = true;
  @Output() changeFile = new EventEmitter<any>();
  @Output() addFile = new EventEmitter<any>();

  constructor(private backend: BackendService) { }

  ngOnInit(): void {
  }

  uploadFile(event: any): void {
    // check if it is allowed to have more than one file if more are uploaded
    if (/*this.justOneFile &&*/ event.files.length > 1){
      this.isOneFileError = true;
      return;
    }

    for (const element of event.files) {
      // check mime type of file
      if (!this.checkMimeType(element)){
        this.isWrongFormatError = true;
        return;
      }
      // reset errors
      this.isOneFileError = false;
      this.isWrongFormatError = false;
      // push file into the file array
      if(this.justOneFile){
        this.files =[element];
      }else{
        this.files.push(element);
      }
      this.addFile.emit(element);
    }

    this.changeFile.emit(event);
  }

  // deleteAttachment(index: number): void {
  //   this.files.splice(index, 1);
  //   this.changeFile.emit(null);
  // }

  /**
   * checks if the mime type corresponds to parameters
   */
  checkMimeType(element: any): boolean{
    for (const mime of this.mimeTypes) {
      console.log(element.type)
      if (element.type.match(new RegExp(mime))) {
        return true;
      }
    }
    return false;
  }
}
