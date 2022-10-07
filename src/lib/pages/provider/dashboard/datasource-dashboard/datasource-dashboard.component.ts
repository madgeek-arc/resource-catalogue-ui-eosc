import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AuthenticationService} from '../../../../services/authentication.service';
import {ResourceService} from '../../../../services/resource.service';
import {DatasourceService} from "../../../../services/datasource.service";
import {ServiceExtensionsService} from '../../../../services/service-extensions.service';
import {NavigationService} from '../../../../services/navigation.service';
import {environment} from '../../../../../environments/environment';


@Component({
  selector: 'app-resource-dashboard',
  templateUrl: './datasource-dashboard.component.html',
})
export class DatasourceDashboardComponent implements OnInit {

  _marketplaceDatasourcesURL = environment.marketplaceDatasourcesURL;

  catalogueId: string;
  providerId: string;
  datasourceId: string;
  monitoringId: string;
  helpdeskId: string;

  constructor(public authenticationService: AuthenticationService,
              public resourceService: ResourceService,
              public datasourceService: DatasourceService,
              public serviceExtensionsService: ServiceExtensionsService,
              public router: NavigationService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.catalogueId = this.route.snapshot.paramMap.get('catalogueId');
    this.providerId = this.route.snapshot.paramMap.get('providerId');
    this.datasourceId = this.route.snapshot.paramMap.get('datasourceId');
    // TODO: revisit to update when new methods are ready
    // this.serviceExtensionsService.getMonitoringByServiceId(this.datasourceId).subscribe(
    //   res => { if (res!=null) this.monitoringId = res.id } //id not used atm
    // );
    // this.serviceExtensionsService.getHelpdeskByServiceId(this.datasourceId).subscribe(
    //   res => { if (res!=null) this.helpdeskId = res.id } //id not used atm
    // );
  }
}