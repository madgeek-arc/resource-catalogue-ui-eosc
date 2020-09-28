import {Component, Injector, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {Service} from '../../domain/eic-model';
import {ServiceFormComponent} from './service-form.component';
import {AuthenticationService} from '../../services/authentication.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-service-upload',
  templateUrl: './service-form.component.html'
})
export class ServiceUploadComponent extends ServiceFormComponent implements OnInit {
  private sub: Subscription;

  constructor(protected injector: Injector,
              protected authenticationService: AuthenticationService,
              protected route: ActivatedRoute) {
    super(injector, authenticationService, route);
    this.editMode = false;
  }

  ngOnInit() {
    super.ngOnInit();
  }

  onSuccess(service) {
    this.successMessage = 'Resource uploaded successfully!';
  }

  onSubmit(service: Service, tempSave: boolean) {
    super.onSubmit(service, tempSave);
  }

}
