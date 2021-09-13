import { HostListener, Component, Directive } from '@angular/core';

@Directive()

export abstract class ComponentCanDeactivate {
  abstract canDeactivate(): boolean;

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (!this.canDeactivate()) {
        $event.returnValue = "Upload is in progress. Please do not refresh or close the page!";
    }
  }
}