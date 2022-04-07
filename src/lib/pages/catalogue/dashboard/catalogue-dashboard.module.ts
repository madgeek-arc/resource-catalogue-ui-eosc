import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../../shared/shared.module';
import {ReusableComponentsModule} from '../../../shared/reusablecomponents/reusable-components.module';
// import {ProviderStatsComponent} from './providerStats/provider-stats.component';
import {CatalogueInfoComponent} from './catalogueInfo/catalogue-info.component';
// import {ServicesComponent} from './services/services.component';
// import {ServiceStatsComponent} from './resource-dashboard/service-stats.component';
import {MarkdownModule} from 'ngx-markdown';
// import {ProviderHistoryComponent} from './providerHistory/provider-history.component';
// import {ProviderFullHistoryComponent} from './providerHistory/provider-full-history.component';
import {HighchartsChartModule} from "highcharts-angular";
import {CatalogueDashboardComponent} from "./catalogue-dashboard.component";
import {CatalogueDashboardRouting} from "./catalogue-dashboard.routing";

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CatalogueDashboardRouting,
    ReusableComponentsModule,
    HighchartsChartModule,
    MarkdownModule.forChild(),

  ],
  declarations: [
    CatalogueDashboardComponent,
    // ProviderStatsComponent,
    // ProviderHistoryComponent,
    // ProviderFullHistoryComponent,
    CatalogueInfoComponent,
    // ServicesComponent,
    // ServiceStatsComponent
  ]
})

export class CatalogueDashboardModule {
}
