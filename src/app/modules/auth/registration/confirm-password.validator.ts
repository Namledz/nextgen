import { AbstractControl } from '@angular/forms';

export class ConfirmPasswordValidator {
  /**
   * Check matching password with confirm password
   * @param control AbstractControl
   */
  static MatchPassword(control: AbstractControl) {
    const password = control.get('password').value;

    const confirmPassword = control.get('cPassword').value;

    if (password !== confirmPassword) {
      control.get('cPassword').setErrors({ ConfirmPassword: true });
    } else {
      return null;
    }
  }

  static MatchPasswordEdit(control: AbstractControl) {
    var password = control.get('password').value;
    // console.log(control.get('cPassword'))
    if(control.get('cPassword').value != null) {
        var confirmPassword = control.get('cPassword').value
    } else {
        var confirmPassword = null
    }
    
    if(password == '' || password == null || password == undefined) {
        password = ''
    }  
    if ( confirmPassword == '' || confirmPassword == null || confirmPassword == undefined) {
        confirmPassword = ''
    }
    
    if ( password == confirmPassword ) {
      control.get('cPassword').setErrors(null);
      return null;
    } else {
      if( (confirmPassword != '') || (confirmPassword == '' && password != '') ) {
         control.get('cPassword').setErrors({ ConfirmPassword: true });
      } else {
         control.get('cPassword').setErrors(null);
      }
    }
  }
}
