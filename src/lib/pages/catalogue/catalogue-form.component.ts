import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import * as sd from '../provider-resources/services.description';
import {AuthenticationService} from '../../services/authentication.service';
import {ServiceProviderService} from '../../services/service-provider.service';
import {ActivatedRoute, Router} from '@angular/router';
import {urlAsyncValidator, URLValidator} from '../../shared/validators/generic.validator';
import {Vocabulary, Type, Provider} from '../../domain/eic-model';
import {ResourceService} from '../../services/resource.service';
import BitSet from 'bitset';
import {environment} from '../../../environments/environment';
import {PremiumSortPipe} from '../../shared/pipes/premium-sort.pipe';

declare var UIkit: any;

@Component({
  selector: 'app-catalogue-form',
  templateUrl: './catalogue-form.component.html',
  // styleUrls: ['./service-provider-form.component.css']
})
export class CatalogueFormComponent implements OnInit {

  serviceORresource = environment.serviceORresource;
  projectName = environment.projectName;
  projectMail = environment.projectMail;
  privacyPolicyURL = environment.privacyPolicyURL;
  catalogueId: string = null;
  catalogueName = '';
  errorMessage = '';
  userInfo = {family_name: '', given_name: '', email: ''};
  catalogueForm: FormGroup;
  logoUrl = '';
  vocabularies: Map<string, Vocabulary[]> = null;
  subVocabularies: Map<string, Vocabulary[]> = null;
  premiumSort = new PremiumSortPipe();
  edit = false;
  hasChanges = false;
  pendingProvider = false;
  disable = false;
  showLoader = false;
  tabs: boolean[] = [false, false, false, false, false, false, false, false];
  isPortalAdmin = false;

  requiredOnTab0 = 4;
  requiredOnTab1 = 2;
  requiredOnTab3 = 4;
  requiredOnTab4 = 2;
  requiredOnTab7 = 1;

  remainingOnTab0 = this.requiredOnTab0;
  remainingOnTab1 = this.requiredOnTab1;
  remainingOnTab3 = this.requiredOnTab3;
  remainingOnTab4 = this.requiredOnTab4;
  remainingOnTab7 = this.requiredOnTab7;

  BitSetTab0 = new BitSet;
  BitSetTab1 = new BitSet;
  BitSetTab3 = new BitSet;
  BitSetTab4 = new BitSet;
  BitSetTab7 = new BitSet;

  requiredTabs = 5;
  completedTabs = 0;
  completedTabsBitSet = new BitSet;

  // allRequiredFields = 17;
  // allRequiredFields = 13;
  allRequiredFields = 14;
  loaderBitSet = new BitSet;
  loaderPercentage = 0;

  codeOfConduct = false;
  privacyPolicy = false;
  authorizedRepresentative = false;

  vocabularyEntryForm: FormGroup;
  suggestionsForm = {
    legalStatusVocabularyEntryValueName: '',
    domainsVocabularyEntryValueName: '',
    categoriesVocabularyEntryValueName: '',
    placesVocabularyEntryValueName: '',
    networksVocabularyEntryValueName: '',
    providerTypeVocabularyEntryValueName: '',
    vocabulary: '',
    errorMessage: '',
    successMessage: ''
  };

  readonly fullNameDesc: sd.Description = sd.catalogueDescMap.get('fullNameDesc');
  readonly abbreviationDesc: sd.Description = sd.catalogueDescMap.get('abbreviationDesc');
  readonly websiteDesc: sd.Description = sd.catalogueDescMap.get('websiteDesc');
  readonly descriptionDesc: sd.Description = sd.catalogueDescMap.get('descriptionDesc');
  readonly logoDesc: sd.Description = sd.catalogueDescMap.get('logoDesc');
  readonly multimediaURLDesc: sd.Description = sd.catalogueDescMap.get('multimediaURLDesc');
  readonly multimediaNameDesc: sd.Description = sd.catalogueDescMap.get('multimediaNameDesc');
  readonly scientificDomainDesc: sd.Description = sd.catalogueDescMap.get('scientificDomainDesc');
  readonly scientificSubdomainsDesc: sd.Description = sd.catalogueDescMap.get('scientificSubdomainsDesc');
  readonly participatingCountriesDesc: sd.Description = sd.catalogueDescMap.get('participatingCountriesDesc');
  readonly affiliationDesc: sd.Description = sd.catalogueDescMap.get('affiliationDesc');
  readonly tagsDesc: sd.Description = sd.catalogueDescMap.get('tagsDesc');
  readonly streetNameAndNumberDesc: sd.Description = sd.catalogueDescMap.get('streetNameAndNumberDesc');
  readonly postalCodeDesc: sd.Description = sd.catalogueDescMap.get('postalCodeDesc');
  readonly cityDesc: sd.Description = sd.catalogueDescMap.get('cityDesc');
  readonly regionDesc: sd.Description = sd.catalogueDescMap.get('regionDesc');
  readonly countryDesc: sd.Description = sd.catalogueDescMap.get('countryDesc');
  readonly mainContactFirstNameDesc: sd.Description = sd.catalogueDescMap.get('mainContactFirstNameDesc');
  readonly mainContactLastNameDesc: sd.Description = sd.catalogueDescMap.get('mainContactLastNameDesc');
  readonly mainContactEmailDesc: sd.Description = sd.catalogueDescMap.get('mainContactEmailDesc');
  readonly mainContactPhoneDesc: sd.Description = sd.catalogueDescMap.get('mainContactPhoneDesc');
  readonly mainContactPositionDesc: sd.Description = sd.catalogueDescMap.get('mainContactPositionDesc');
  readonly publicContactFirstNameDesc: sd.Description = sd.catalogueDescMap.get('publicContactFirstNameDesc');
  readonly publicContactLastNameDesc: sd.Description = sd.catalogueDescMap.get('publicContactLastNameDesc');
  readonly publicContactEmailDesc: sd.Description = sd.catalogueDescMap.get('publicContactEmailDesc');
  readonly publicContactPhoneDesc: sd.Description = sd.catalogueDescMap.get('publicContactPhoneDesc');
  readonly publicContactPositionDesc: sd.Description = sd.catalogueDescMap.get('publicContactPositionDesc');
  readonly hostingLegalEntityDesc: sd.Description = sd.catalogueDescMap.get('hostingLegalEntityDesc');
  readonly legalEntityDesc: sd.Description = sd.catalogueDescMap.get('legalEntityDesc');
  readonly legalStatusDesc: sd.Description = sd.catalogueDescMap.get('legalStatusDesc');
  readonly networksDesc: sd.Description = sd.catalogueDescMap.get('networksDesc');

  placesVocabulary: Vocabulary[] = null;
  providerTypeVocabulary: Vocabulary[] = null;
  domainsVocabulary: Vocabulary[] = null;
  categoriesVocabulary: Vocabulary[] = null;
  legalStatusVocabulary: Vocabulary[] = null;
  networksVocabulary: Vocabulary[] = null;
  hostingLegalEntityVocabulary: Vocabulary[] = null;

  readonly formDefinition = {
    id: [''],
    name: ['', Validators.required],
    abbreviation: ['', Validators.required],
    website: ['', Validators.compose([Validators.required, URLValidator]), urlAsyncValidator(this.serviceProviderService)],
    legalEntity: [''],
    legalStatus: [''],
    hostingLegalEntity: [''],
    description: ['', Validators.required],
    logo: ['', Validators.compose([Validators.required, URLValidator]), urlAsyncValidator(this.serviceProviderService)],
    // multimedia: this.fb.array([this.fb.control('', URLValidator, urlAsyncValidator(this.serviceProviderService))]),
    // multimediaNames: this.fb.array([this.fb.control('')]),
    multimedia: this.fb.array([
      this.fb.group({
        multimediaURL: [''],
        multimediaName: ['']
      })
    ]),
    scientificDomains: this.fb.array([]),
    // scientificDomain: this.fb.array([]),
    // scientificSubdomains: this.fb.array([]),
    tags: this.fb.array([this.fb.control('')]),
    location: this.fb.group({
      streetNameAndNumber: ['', Validators.required],
      postalCode: ['', Validators.required],
      city: ['', Validators.required],
      region: [''],
      country: ['', Validators.required]
    }, Validators.required),
    mainContact: this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      phone: ['', Validators.pattern('[+]?\\d+$')],
      position: [''],
    }, Validators.required),
    publicContacts: this.fb.array([
      this.fb.group({
        firstName: [''],
        lastName: [''],
        email: ['', Validators.compose([Validators.required, Validators.email])],
        phone: ['', Validators.pattern('[+]?\\d+$')],
        position: [''],
      })
    ]),
    participatingCountries: this.fb.array([this.fb.control('')]),
    affiliations: this.fb.array([this.fb.control('')]),
    networks: this.fb.array([this.fb.control('')])
  };

  constructor(public fb: FormBuilder,
              public authService: AuthenticationService,
              public serviceProviderService: ServiceProviderService,
              public resourceService: ResourceService,
              public router: Router,
              public route: ActivatedRoute) {
  }

  ngOnInit() {

    const path = this.route.snapshot.routeConfig.path;
    if (path.includes('add/:catalogueId')) {
      this.pendingProvider = true;
    }
    // if (path.includes('info/:catalogueId')) {
    //   this.pendingProvider = true;
    // }
    this.setVocabularies();
    this.catalogueForm = this.fb.group(this.formDefinition);
    if (this.edit === false) {
      this.pushDomain();
      // this.providerForm.get('legalEntity').setValue(false);
    }

    if (sessionStorage.getItem('provider')) {
      const data = JSON.parse(sessionStorage.getItem('provider'));
      for (const i in data) {
        if (data.hasOwnProperty(i)) {
          if (Array.isArray(data[i])) {
            // console.log(i);
            for (let j = 0; j < data[i].length - 1; j++) {
              if (i === 'scientificDomains') {
                this.domainArray.push(this.newScientificDomain());
              } else if (i === 'publicContacts') {
                this.pushPublicContact();
              } else if (i === 'multimedia') {
                this.pushMultimedia();
              } else {
                this.push(i, false);
              }
            }
          }
        }
      }
      this.catalogueForm.patchValue(data);
      if (!this.edit) {
        sessionStorage.removeItem('provider');
      }
    }

    this.isPortalAdmin = this.authService.isAdmin();

    this.vocabularyEntryForm = this.fb.group(this.suggestionsForm);
  }

  registerCatalogue(tempSave: boolean) {
    // console.log('Submit');
    if (!this.authService.isLoggedIn()) {
      sessionStorage.setItem('provider', JSON.stringify(this.catalogueForm.value));
      this.authService.login();
    }

    this.errorMessage = '';
    // this.trimFormWhiteSpaces();
    const path = this.route.snapshot.routeConfig.path;
    let method;
    if (path === 'add/:catalogueId') {
      method = 'updateAndPublishPendingProvider';
    } else {
      method = this.edit ? 'updateCatalogue' : 'createNewCatalogue';
    }

    for (let i = 0; i < this.domainArray.length; i++) {
      if (this.domainArray.controls[i].get('scientificDomain').value === ''
        || this.domainArray.controls[i].get('scientificDomain').value === null) {
        this.removeDomain(i);
      }
    }

    for (let i = 0; i < this.multimediaArray.length; i++) {
      if (this.multimediaArray.controls[i].get('multimediaURL').value === ''
        || this.multimediaArray.controls[i].get('multimediaURL').value === null) {
        this.removeMultimedia(i);
      }
    }

    if (tempSave) {
      this.showLoader = true;
      window.scrollTo(0, 0);
      this.serviceProviderService.temporarySaveProvider(this.catalogueForm.value, (path !== 'add/:catalogueId' && this.edit))
        .subscribe(
          res => {
            this.showLoader = false;
            this.router.navigate([`/provider/add/${res.id}`]);
          },
          err => {
            this.showLoader = false;
            window.scrollTo(0, 0);
            this.errorMessage = 'Something went wrong. ' + JSON.stringify(err.error.error);
          },
          () => {
            this.showLoader = false;
          }
        );
    } else if (this.catalogueForm.valid) {
      this.showLoader = true;
      window.scrollTo(0, 0);

      this.serviceProviderService[method](this.catalogueForm.value).subscribe(
        res => {
        },
        err => {
          this.showLoader = false;
          window.scrollTo(0, 0);
          this.errorMessage = 'Something went wrong. ' + JSON.stringify(err.error.error);
        },
        () => {
          this.showLoader = false;
          if (this.edit) {
            this.router.navigate(['/provider/my']);
          } else {
            this.router.navigate(['/provider/my']);
            // this.authService.refreshLogin('/provider/my'); // fixme: not redirecting
          }
        }
      );
    } else {
      // console.log(this.providerForm);
      this.markFormAsDirty();
      window.scrollTo(0, 0);
      this.markTabs();
      this.errorMessage = 'Please fill in all required fields (marked with an asterisk), ' +
        'and fix the data format in fields underlined with a red colour.';
    }
  }

  // empty fields can be removed from here when complete
  toServer(service: Provider): Provider {
    const ret = {};
    Object.entries(service).forEach(([name, values]) => {
      let newValues = values;
      // console.log(name);
      if (Array.isArray(values)) {
        newValues = [];
        values.forEach(e => {
          // console.log('is array');
          if (typeof e === 'string' || e instanceof String) {
            if (e !== '') {
              newValues.push(e.trim().replace(/\s\s+/g, ' '));
            }
          } else {
            // console.log('array with objects');
          }
        });
      } else if (typeof newValues === 'string' || newValues instanceof String) {
        newValues = newValues.trim().replace(/\s\s+/g, ' ');
      } else {
        // console.log('single object');
      }
      ret[name] = newValues;
    });
    // if ( (this.firstServiceForm === true) && this.catalogueId) {
    //   ret['providers'] = [];
    //   ret['providers'].push(this.catalogueId);
    // }
    return <Provider>ret;
  }

  /** check form fields and tabs validity--> **/
  checkFormValidity(name: string, edit: boolean): boolean {
    return (!this.catalogueForm.get(name).valid && (edit || this.catalogueForm.get(name).dirty));
  }

  checkFormArrayValidity(name: string, position: number, edit: boolean, groupName?: string): boolean {
    if (groupName) {
      return (!this.getFieldAsFormArray(name).get([position]).get(groupName).valid
        && (edit || this.getFieldAsFormArray(name).get([position]).get(groupName).dirty));
    }
    return (!this.getFieldAsFormArray(name).get([position]).valid
      && (edit || this.getFieldAsFormArray(name).get([position]).dirty));
  }

  checkEveryArrayFieldValidity(name: string, edit: boolean, groupName?: string): boolean {
    for (let i = 0; i < this.getFieldAsFormArray(name).length; i++) {
      if (groupName) {
        if (!this.getFieldAsFormArray(name).get([i]).get(groupName).valid
          && (edit || this.getFieldAsFormArray(name).get([i]).get(groupName).dirty)) {
          return true;
        }
      } else if (!this.getFieldAsFormArray(name).get([i]).valid
        && (edit || this.getFieldAsFormArray(name).get([i]).dirty)) {
        return true;
      }
    }
    return false;
  }

  markTabs() {
    this.tabs[0] = (this.checkFormValidity('name', this.edit)
      || this.checkFormValidity('abbreviation', this.edit)
      || this.checkFormValidity('website', this.edit)
      || this.checkEveryArrayFieldValidity('legalEntity', this.edit)
      || this.checkFormValidity('legalStatus', this.edit)
      || this.checkFormValidity('hostingLegalEntity', this.edit));
    this.tabs[1] = (this.checkFormValidity('description', this.edit)
      || this.checkFormValidity('logo', this.edit)
      || this.checkEveryArrayFieldValidity('multimedia', this.edit, 'multimediaURL')
      || this.checkEveryArrayFieldValidity('multimedia', this.edit, 'multimediaName'));
    this.tabs[2] = (this.checkEveryArrayFieldValidity('tags', this.edit)
      || this.checkEveryArrayFieldValidity('scientificDomains', this.edit, 'scientificDomain')
      || this.checkEveryArrayFieldValidity('scientificDomains', this.edit, 'scientificSubdomain'));
    this.tabs[3] = (this.checkFormValidity('location.streetNameAndNumber', this.edit)
      || this.checkFormValidity('location.postalCode', this.edit)
      || this.checkFormValidity('location.city', this.edit)
      || this.checkFormValidity('location.region', this.edit)
      || this.checkFormValidity('location.country', this.edit));
    this.tabs[4] = (this.checkFormValidity('mainContact.firstName', this.edit)
      || this.checkFormValidity('mainContact.lastName', this.edit)
      || this.checkFormValidity('mainContact.email', this.edit)
      || this.checkFormValidity('mainContact.phone', this.edit)
      || this.checkFormValidity('mainContact.position', this.edit)
      || this.checkEveryArrayFieldValidity('publicContacts', this.edit, 'firstName')
      || this.checkEveryArrayFieldValidity('publicContacts', this.edit, 'lastName')
      || this.checkEveryArrayFieldValidity('publicContacts', this.edit, 'email')
      || this.checkEveryArrayFieldValidity('publicContacts', this.edit, 'phone')
      || this.checkEveryArrayFieldValidity('publicContacts', this.edit, 'position'));
    this.tabs[5] = (this.checkEveryArrayFieldValidity('participatingCountries', this.edit)
      || this.checkEveryArrayFieldValidity('affiliations', this.edit)
      || this.checkEveryArrayFieldValidity('networks', this.edit));
  }

  /** check form fields and tabs validity--> **/

  /** get and set vocabularies **/
  setVocabularies() {
    this.resourceService.getAllVocabulariesByType().subscribe(
      res => {
        this.vocabularies = res;
        this.placesVocabulary = this.vocabularies[Type.COUNTRY];
        this.domainsVocabulary = this.vocabularies[Type.SCIENTIFIC_DOMAIN];
        this.categoriesVocabulary = this.vocabularies[Type.SCIENTIFIC_SUBDOMAIN];
        this.legalStatusVocabulary = this.vocabularies[Type.PROVIDER_LEGAL_STATUS];
        this.networksVocabulary = this.vocabularies[Type.PROVIDER_NETWORK];
        this.hostingLegalEntityVocabulary = this.vocabularies[Type.PROVIDER_HOSTING_LEGAL_ENTITY];
        return this.vocabularies;
      },
      error => console.log(JSON.stringify(error.error)),
      () => {
        this.premiumSort.transform(this.placesVocabulary, ['Europe', 'Worldwide']);

        let voc: Vocabulary[] = this.vocabularies[Type.SCIENTIFIC_SUBDOMAIN].concat(this.vocabularies[Type.PROVIDER_MERIL_SCIENTIFIC_SUBDOMAIN]);
        this.subVocabularies = this.groupByKey(voc, 'parentId');

        return this.vocabularies;
      }
    );
  }

  /** Categorization --> **/
  newScientificDomain(): FormGroup {
    return this.fb.group({
      scientificDomain: [''],
      scientificSubdomain: ['']
    });
  }

  get domainArray() {
    return this.catalogueForm.get('scientificDomains') as FormArray;
  }

  pushDomain() {
    this.domainArray.push(this.newScientificDomain());
    this.domainArray.controls[this.domainArray.length - 1].get('scientificSubdomain').disable();
  }

  removeDomain(index: number) {
    this.domainArray.removeAt(index);
  }

  onDomainChange(index: number) {
    this.domainArray.controls[index].get('scientificSubdomain').enable();
    this.domainArray.controls[index].get('scientificSubdomain').reset();
  }

  /** <-- Categorization **/

  /** handle form arrays--> **/
  getFieldAsFormArray(field: string) {
    return this.catalogueForm.get(field) as FormArray;
  }

  remove(field: string, i: number) {
    this.getFieldAsFormArray(field).removeAt(i);
  }

  push(field: string, required: boolean, url?: boolean) {
    if (required) {
      if (url) {
        this.getFieldAsFormArray(field).push(this.fb.control('', Validators.compose([Validators.required, URLValidator]), urlAsyncValidator(this.serviceProviderService)));
      } else {
        this.getFieldAsFormArray(field).push(this.fb.control('', Validators.required));
      }
    } else if (url) {
      this.getFieldAsFormArray(field).push(this.fb.control('', URLValidator, urlAsyncValidator(this.serviceProviderService)));
    } else {
      this.getFieldAsFormArray(field).push(this.fb.control(''));
    }
  }

  /** <--handle form arrays**/

  /** Multimedia -->**/
  newMultimedia(): FormGroup {
    return this.fb.group({
      multimediaURL: [''],
      multimediaName: ['']
    });
  }

  get multimediaArray() {
    return this.catalogueForm.get('multimedia') as FormArray;
  }

  pushMultimedia() {
    this.multimediaArray.push(this.newMultimedia());
  }

  removeMultimedia(index: number) {
    this.multimediaArray.removeAt(index);
  }

  /** <--Multimedia**/

  /** Contact Info -->**/
  newContact(): FormGroup {
    return this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      phone: [''],
      position: ['']
    });
  }

  get publicContactArray() {
    return this.catalogueForm.get('publicContacts') as FormArray;
  }

  pushPublicContact() {
    this.publicContactArray.push(this.newContact());
  }

  removePublicContact(index: number) {
    this.publicContactArray.removeAt(index);
  }

  /** <--Contact Info **/

  showLogoUrlModal() {
    if (this.catalogueForm && this.catalogueForm.get('logo').value) {
      this.logoUrl = this.catalogueForm.get('logo').value;
    }
    UIkit.modal('#logoUrlModal').show();
  }

  addLogoUrl(logoUrl: string) {
    UIkit.modal('#logoUrlModal').hide();
    this.logoUrl = logoUrl;
    this.catalogueForm.get('logo').setValue(logoUrl);
    this.catalogueForm.get('logo').updateValueAndValidity();
  }

  getSortedChildrenCategories(childrenCategory: Vocabulary[], parentId: string) {
    return this.sortVocabulariesByName(childrenCategory.filter(entry => entry.parentId === parentId));
  }

  sortVocabulariesByName(vocabularies: Vocabulary[]): Vocabulary[] {
    return vocabularies.sort((vocabulary1, vocabulary2) => {
      if (vocabulary1.name > vocabulary2.name) {
        return 1;
      }
      if (vocabulary1.name < vocabulary2.name) {
        return -1;
      }
      return 0;
    });
  }

  markFormAsDirty() {
    for (const i in this.catalogueForm.controls) {
      for (const j in this.catalogueForm.controls[i].value) {
        // console.log(this.providerForm.controls[i].value);
        if (this.catalogueForm.controls[i].value.hasOwnProperty(j)) {
          if (this.catalogueForm.controls[i].get(j)) {
            if (this.catalogueForm.controls[i].get(j).value.constructor !== Array) {
              this.catalogueForm.controls[i].get(j).markAsDirty();
              this.catalogueForm.controls[i].get(j).markAsTouched();
            }
          }
        }
      }
      if (this.catalogueForm.controls[i].value.constructor === Array) {
        for (let j = 0; j < this.getFieldAsFormArray(i).controls.length; j++) {
          const keys = Object.keys(this.catalogueForm.controls[i].value[j]);
          for (let k = 0; k < keys.length; k++) {
            if (this.getFieldAsFormArray(i).controls[j].get(keys[k])) {
              this.getFieldAsFormArray(i).controls[j].get(keys[k]).markAsTouched();
              this.getFieldAsFormArray(i).controls[j].get(keys[k]).markAsDirty();
            }
          }
        }
      }
      this.catalogueForm.controls[i].markAsDirty();
    }
  }

  /*trimFormWhiteSpaces() {
    for (const i in this.providerForm.controls) {
      // console.log(i);
      if (this.providerForm.controls[i].value && this.providerForm.controls[i].value.constructor === Array) {

      } else if (this.providerForm.controls[i].value && (i === 'location' || i === 'mainContact')) {
        // TODO
      } else if (typeof this.providerForm.controls[i].value === 'boolean') {
        // console.log('skip boolean value');
      } else {
        // console.log('this.providerForm.controls[i].value: ', this.providerForm.controls[i].value);
        this.providerForm.controls[i].setValue(this.providerForm.controls[i].value.trim().replace(/\s\s+/g, ' '));
      }
    }
    for (let j = 0; j < this.providerForm.controls['users'].value.length; j++) {
      this.providerForm.controls['users'].value[j].email = this.providerForm.controls['users'].value[j].email
        .trim().replace(/\s\s+/g, ' ');
      this.providerForm.controls['users'].value[j].name = this.providerForm.controls['users'].value[j].name
        .trim().replace(/\s\s+/g, ' ');
      this.providerForm.controls['users'].value[j].surname = this.providerForm.controls['users'].value[j].surname
        .trim().replace(/\s\s+/g, ' ');
    }

    if (this.providerForm.controls['scientificDomains'] && this.providerForm.controls['scientificDomains'].value) {

      if (this.providerForm.controls['scientificDomains'].value.length === 1
        && !this.providerForm.controls['scientificDomains'].value[0].scientificDomain
        && !this.providerForm.controls['scientificDomains'].value[0].scientificSubdomain) {

        this.removeDomain(0);

      }
    }
  }*/

  unsavedChangesPrompt() {
    this.hasChanges = true;
  }

  timeOut(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  checkForDuplicates(formControlName, group?) {
    if (group === 'scientificDomains') {
      for (let i = 0; i < this.domainArray.controls.length; i++) {
        for (let j = 0; j <  this.domainArray.controls.length; j++) {
          if (i !== j && this.domainArray.controls[i].get('scientificDomain').value === this.domainArray.controls[j].get('scientificDomain').value ) {
            if (this.domainArray.controls[i].get('scientificSubdomain').value === this.domainArray.controls[j].get('scientificSubdomain').value) {
              this.showNotification();
              return;
            }
          }
        }
      }
    } else {
      if (this.catalogueForm.get(formControlName).value.length > 1) {
        for (let i = 0; i < this.catalogueForm.get(formControlName).value.length; i++) {
          for (let j = 0; j < this.catalogueForm.get(formControlName).value.length; j++) {
            if (i !== j && this.catalogueForm.get(formControlName).value[i] === this.catalogueForm.get(formControlName).value[j]) {
              this.showNotification();
              return;
            }
          }
        }
      }
    }
  }

  /** BitSets -->**/
  handleBitSets(tabNum: number, bitIndex: number, formControlName: string): void {
    if (bitIndex === 0) {
      this.catalogueName = this.catalogueForm.get(formControlName).value;
    }
    if (this.catalogueForm.get(formControlName).valid || (this.catalogueForm.get(formControlName).disabled && this.catalogueForm.get(formControlName).value != '')) {
      this.decreaseRemainingFieldsPerTab(tabNum, bitIndex);
      this.loaderBitSet.set(bitIndex, 1);
    } else if (this.catalogueForm.get(formControlName).invalid) {
      this.increaseRemainingFieldsPerTab(tabNum, bitIndex);
      this.loaderBitSet.set(bitIndex, 0);
    } else if (this.catalogueForm.get(formControlName).pending) {
      this.timeOut(300).then( () => this.handleBitSets(tabNum, bitIndex, formControlName));
      return;
    }
    this.updateLoaderPercentage();
  }

  handleBitSetsOfGroups(tabNum: number, bitIndex: number, formControlName: string, group?: string): void {
    if (this.catalogueForm.controls[group].get(formControlName).valid || (this.catalogueForm.controls[group].get(formControlName).disabled && this.catalogueForm.controls[group].get(formControlName).value != '')) {
      this.decreaseRemainingFieldsPerTab(tabNum, bitIndex);
      this.loaderBitSet.set(bitIndex, 1);
    } else if (this.catalogueForm.controls[group].get(formControlName).invalid) {
      this.increaseRemainingFieldsPerTab(tabNum, bitIndex);
      this.loaderBitSet.set(bitIndex, 0);
    }
    this.updateLoaderPercentage();
  }

  handleBitSetsOfPublicContact(tabNum: number, bitIndex: number, formControlName: string, group?: string): void {
    if (this.catalogueForm.get(group).value[0][formControlName] !== '' && this.catalogueForm.controls[group].valid || this.catalogueForm.controls[group].disabled) {
      this.decreaseRemainingFieldsPerTab(tabNum, bitIndex);
      this.loaderBitSet.set(bitIndex, 1);
    } else {
      this.increaseRemainingFieldsPerTab(tabNum, bitIndex);
      this.loaderBitSet.set(bitIndex, 0);
    }
    this.updateLoaderPercentage();
  }

  handleBitSetsOfUsers(tabNum: number, bitIndex: number, formControlName: string, group?: string): void {
    if (this.catalogueForm.get(group).value[0][formControlName] !== '') {
      this.decreaseRemainingFieldsPerTab(tabNum, bitIndex);
      this.loaderBitSet.set(bitIndex, 1);
    } else {
      this.increaseRemainingFieldsPerTab(tabNum, bitIndex);
      this.loaderBitSet.set(bitIndex, 0);
    }
    this.updateLoaderPercentage();
  }

  updateLoaderPercentage() {
    // console.log(this.loaderBitSet.toString(2));
    // console.log('cardinality: ', this.loaderBitSet.cardinality());
    this.loaderPercentage = Math.round((this.loaderBitSet.cardinality() / this.allRequiredFields) * 100);
    // console.log(this.loaderPercentage, '%');
  }

  decreaseRemainingFieldsPerTab(tabNum: number, bitIndex: number) {
    if (tabNum === 0) {
      this.BitSetTab0.set(bitIndex, 1);
      this.remainingOnTab0 = this.requiredOnTab0 - this.BitSetTab0.cardinality();
      if (this.remainingOnTab0 === 0 && this.completedTabsBitSet.get(tabNum) !== 1) {
        this.calcCompletedTabs(tabNum, 1);
      }
    } else if (tabNum === 1) {
      this.BitSetTab1.set(bitIndex, 1);
      this.remainingOnTab1 = this.requiredOnTab1 - this.BitSetTab1.cardinality();
      if (this.remainingOnTab1 === 0 && this.completedTabsBitSet.get(tabNum) !== 1) {
        this.calcCompletedTabs(tabNum, 1);
      }
    } else if (tabNum === 3) { // Location
      this.BitSetTab3.set(bitIndex, 1);
      this.remainingOnTab3 = this.requiredOnTab3 - this.BitSetTab3.cardinality();
      if (this.remainingOnTab3 === 0 && this.completedTabsBitSet.get(tabNum) !== 1) {
        this.calcCompletedTabs(tabNum, 1);
      }
    } else if (tabNum === 4) { // Contact
      this.BitSetTab4.set(bitIndex, 1);
      const mainContactCardinality = this.BitSetTab4.slice(9, 11).cardinality();
      this.remainingOnTab4 = this.requiredOnTab4 - +(mainContactCardinality === 3) - this.BitSetTab4.get(15);
      if (this.remainingOnTab4 === 0 && this.completedTabsBitSet.get(tabNum) !== 1) {
        this.calcCompletedTabs(tabNum, 1);
      }
    } else if (tabNum === 7) { // Admins
      this.BitSetTab7.set(bitIndex, 1);
      if (this.BitSetTab7.cardinality() === 3) {
        this.remainingOnTab7 = 0;
        if (this.completedTabsBitSet.get(tabNum) !== 1) {
          this.calcCompletedTabs(tabNum, 1);
        }
      }
    }
  }

  increaseRemainingFieldsPerTab(tabNum: number, bitIndex: number) {
    if (tabNum === 0) {
      this.BitSetTab0.set(bitIndex, 0);
      this.remainingOnTab0 = this.requiredOnTab0 - this.BitSetTab0.cardinality();
      if (this.completedTabsBitSet.get(tabNum) !== 0) {
        this.calcCompletedTabs(tabNum, 0);
      }
    } else if (tabNum === 1) {
      this.BitSetTab1.set(bitIndex, 0);
      this.remainingOnTab1 = this.requiredOnTab1 - this.BitSetTab1.cardinality();
      if (this.completedTabsBitSet.get(tabNum) !== 0) {
        this.calcCompletedTabs(tabNum, 0);
      }
    } else if (tabNum === 3) {
      this.BitSetTab3.set(bitIndex, 0);
      this.remainingOnTab3 = this.requiredOnTab3 - this.BitSetTab3.cardinality();
      if (this.completedTabsBitSet.get(tabNum) !== 0) {
        this.calcCompletedTabs(tabNum, 0);
      }
    } else if (tabNum === 4) { // Contact
      this.BitSetTab4.set(bitIndex, 0);
      const mainContactCardinality = this.BitSetTab4.slice(9, 11).cardinality();
      this.remainingOnTab4 = this.requiredOnTab4 - +(mainContactCardinality === 3) - this.BitSetTab4.get(15);
      if (this.completedTabsBitSet.get(tabNum) !== 0) {
        this.calcCompletedTabs(tabNum, 0);
      }
    } else if (tabNum === 7) { // Admins
      this.BitSetTab7.set(bitIndex, 0);
      this.remainingOnTab7 = this.requiredOnTab7;
      if (this.completedTabsBitSet.get(tabNum) !== 0) {
        this.calcCompletedTabs(tabNum, 0);
      }
    }
  }

  calcCompletedTabs(tabNum: number, setValue: number) {
    this.completedTabsBitSet.set(tabNum, setValue);
    this.completedTabs = this.completedTabsBitSet.cardinality();
  }

  /** <--BitSets **/

  /** URL Validation--> **/
  checkUrlValidity(formControlName: string) {
    let urlValidity;
    if (this.catalogueForm.get(formControlName).valid && this.catalogueForm.get(formControlName).value !== '') {
      const url = this.catalogueForm.get(formControlName).value;
      // console.log(url);
      this.serviceProviderService.validateUrl(url).subscribe(
        boolean => { urlValidity = boolean; },
        error => { console.log(error); },
        () => {
          if (!urlValidity) {
            // console.log('invalid');
            window.scrollTo(0, 0);
            this.errorMessage = url + ' is not a valid URL. Please enter a valid URL.';
          }
        }
      );
    }
  }

  checkUrlValidityForArrays(formArrayName: string, position: number) {
    let urlValidity;
    // console.log(this.providerForm.get(formArrayName).value[position]);
    if (this.catalogueForm.get(formArrayName).value[position] !== '') {
      const url = this.catalogueForm.get(formArrayName).value[position];
      // console.log(url);
      this.serviceProviderService.validateUrl(url).subscribe(
        boolean => { urlValidity = boolean; },
        error => { console.log(error); },
        () => {
          if (!urlValidity) {
            // console.log('invalid');
            window.scrollTo(0, 0);
            this.errorMessage = url + ' is not a valid ' + formArrayName + ' URL. Please enter a valid URL.';
          }
        }
      );
    }
  }

  /** <--URL Validation **/

  submitSuggestion(entryValueName, vocabulary, parent) {
    if (entryValueName.trim() !== '') {
      this.serviceProviderService.submitVocabularyEntry(entryValueName, vocabulary, parent, 'provider', this.catalogueId, null).subscribe(
        res => {
        },
        error => {
          console.log(error);
          this.vocabularyEntryForm.get('errorMessage').setValue(error.error.error);
        },
        () => {
          this.vocabularyEntryForm.reset();
          this.vocabularyEntryForm.get('successMessage').setValue('Suggestion submitted!');
        }
      );
    }
  }

  showNotification() {
    UIkit.notification({
      message: 'Please remove duplicate entries.',
      status: 'danger',
      pos: 'top-center',
      timeout: 7000
    });
  }

  groupByKey(array, key) {
    return array.reduce((hash, obj) => {
      if (obj[key] === undefined) {
        return hash;
      }
      return Object.assign(hash, {[obj[key]]: (hash[obj[key]] || []).concat(obj)});
    }, {});
  }

  resetLegalStatus() {
    this.catalogueForm.get('legalStatus').setValue('');
  }
}