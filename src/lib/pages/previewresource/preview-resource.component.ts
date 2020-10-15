import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChange, SimpleChanges} from '@angular/core';
import {RichService, Service, Vocabulary} from '../../domain/eic-model';
import {Subscription} from 'rxjs';
import {ResourceService} from '../../services/resource.service';
import {ActivatedRoute} from '@angular/router';
import {NavigationService} from '../../services/navigation.service';

@Component({
    selector: 'app-preview-resource',
    templateUrl: './preview-resource.component.html',
  styleUrls: ['./preview-resource.component.css']
})
export class PreviewResourceComponent implements OnInit, OnDestroy, OnChanges {

  @Input() resourceId: string;
  @Input() resource: Service;
  @Input() vocabularies: Map<string, Vocabulary[]>;

  public richResource: RichService;
  public errorMessage: string;

  services: RichService[] = [];

  serviceMapOptions: any = null;

  private sub: Subscription;


  public fundingBodyVocabulary: Vocabulary[] = null;
  public fundingProgramVocabulary: Vocabulary[] = null;
  public targetUsersVocabulary: Vocabulary[] = null;
  public accessTypesVocabulary: Vocabulary[] = null;
  public accessModesVocabulary: Vocabulary[] = null;
  public orderTypeVocabulary: Vocabulary[] = null;
  public phaseVocabulary: Vocabulary[] = null;
  public trlVocabulary: Vocabulary[] = null;
  public superCategoriesVocabulary: Vocabulary[] = null;
  public categoriesVocabulary: Vocabulary[] = null;
  public subCategoriesVocabulary: Vocabulary[] = null;
  public scientificDomainVocabulary: Vocabulary[] = null;
  public scientificSubDomainVocabulary: Vocabulary[] = null;
  public placesVocabulary: Vocabulary[] = [];
  public placesVocIdArray: string[] = [];
  public geographicalVocabulary: Vocabulary[] = null;
  public languagesVocabulary: Vocabulary[] = null;
  public languagesVocIdArray: string[] = [];

  constructor(public route: ActivatedRoute,
              public router: NavigationService,
              public resourceService: ResourceService) {
  }

  ngOnInit() {
    // this.resourceService.getRichService(this.resourceId).subscribe(
    //   richResource => {
    //     this.richResource = richResource;
    //
    //     const serviceIDs = (this.richResource.service.requiredResources || []).concat(this.richResource.service.relatedResources || [])
    //       .filter((e, i, a) => a.indexOf(e) === i && e !== '');
    //     if (serviceIDs.length > 0) {
    //       this.resourceService.getSelectedServices(serviceIDs).subscribe(
    //         services => this.services = services,
    //         err => {
    //           console.log(err.error);
    //           this.errorMessage = err.error;
    //         });
    //     }
    //   }, err => {
    //     this.errorMessage = 'Error retrieving resource';
    //   }
    // );
  }

  ngOnDestroy(): void {
    // this.sub.unsubscribe();
  }

  addToFavourites() {}

  getPrettyService(id) {
    return (this.services || []).find(e => e.service.id === id);
    // || {id, name: 'Name not found!'};
  }

  ngOnChanges(changes: SimpleChanges) {

    console.log('this.vocabularies', this.vocabularies);
    
  }
}
