import { Injectable } from '@angular/core';
import { CanActivate, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { ComponentCanDeactivate } from './component-can-deactivate'

@Injectable({
  providedIn: 'root'
})
export class CanActivatePageGuard implements CanDeactivate<ComponentCanDeactivate> {
    canDeactivate(component: ComponentCanDeactivate): boolean {
        if(!component.canDeactivate()){
            if (confirm("Upload is in progress. Please do not redirect to another page!")) {
                return true;
            } else {
                return false;
            }
        }
        return true;
    }
  
}
