import {NgModule} from '@angular/core';
import {JoinPipe} from './pipes/join.pipe';
import {KeysPipe} from './pipes/keys.pipe';
import {LookUpPipe} from './pipes/lookup.pipe';
import {PremiumSortFacetsPipe, PremiumSortPipe} from './pipes/premium-sort.pipe';
import {SafePipe} from './pipes/safe.pipe';
import {StringArraySortPipe} from './pipes/sort.pipe';
import {ValuesPipe} from './pipes/getValues.pipe';
import { ForbiddenPageComponent } from './forbidden-page/forbidden-page.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { EmailModalComponent } from './email-modal/email-modal.component';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {BreadcrumbsComponent} from './breadcrumbs/breadcrumbs.component';
import {RouterModule} from '@angular/router';
import {PendingServicesComponent} from '../pages/provider/dashboard/pendingservices/pending-services.component';
import {SharedServicesComponent} from "../pages/provider/dashboard/sharedServices/shared-services.component";
import {RejectedServicesComponent} from '../pages/provider/dashboard/rejectedServices/rejected-services.component';
import {RejectedTrainingResourcesComponent} from "../pages/provider/dashboard/rejectedTrainingResources/rejected-training-resources.component";
import {PreviewResourceComponent} from '../pages/previewresource/preview-resource.component';
import { HighchartsChartModule } from 'highcharts-angular';
import {DashboardBreadcrumbsComponent} from "./breadcrumbs/dashboard-breadcrumbs.component";
import {MarkdownModule} from "ngx-markdown";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    HighchartsChartModule,
    MarkdownModule
  ],
  declarations: [
    JoinPipe,
    KeysPipe,
    StringArraySortPipe,
    LookUpPipe,
    PremiumSortPipe,
    PremiumSortFacetsPipe,
    SafePipe,
    ValuesPipe,
    ForbiddenPageComponent,
    NotFoundPageComponent,
    EmailModalComponent,
    BreadcrumbsComponent,
    DashboardBreadcrumbsComponent,
    PendingServicesComponent,
    SharedServicesComponent,
    RejectedServicesComponent,
    RejectedTrainingResourcesComponent,
    PreviewResourceComponent
  ],
  exports: [
    JoinPipe,
    KeysPipe,
    StringArraySortPipe,
    LookUpPipe,
    PremiumSortPipe,
    PremiumSortFacetsPipe,
    SafePipe,
    ValuesPipe,
    EmailModalComponent,
    BreadcrumbsComponent,
    DashboardBreadcrumbsComponent,
    PendingServicesComponent,
    SharedServicesComponent,
    RejectedServicesComponent,
    RejectedTrainingResourcesComponent,
    PreviewResourceComponent
  ]
})
export class SharedModule {
}
