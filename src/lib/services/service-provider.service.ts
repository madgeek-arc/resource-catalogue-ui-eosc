import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {AuthenticationService} from './authentication.service';
import {
  ServiceBundle,
  Datasource,
  LoggingInfo,
  Catalogue,
  Provider,
  ProviderBundle,
  ProviderRequest,
  Service,
  ServiceHistory,
  VocabularyCuration, CatalogueBundle, DatasourceBundle, TrainingResource, TrainingResourceBundle
} from '../domain/eic-model';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {Paging} from '../domain/paging';

@Injectable()
export class ServiceProviderService {

  constructor(public http: HttpClient, public authenticationService: AuthenticationService) {
  }

  private base = environment.API_ENDPOINT;
  private httpOption = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
      'Accept': 'application/json;charset=UTF-8'
    })
  };

  private options = {withCredentials: true};

  static checkUrl(url: string) {
    if (url !== '') {
      if (!url.match(/^(https?:\/\/.+)?$/)) {
        url = 'http://' + url;
      }
    }
    return url;
  }

  createNewServiceProvider(newProvider: any, comment: string) {
    // console.log(`knocking on: ${this.base}/provider`);
    return this.http.post(this.base + '/provider', newProvider, this.options);
  }

  updateServiceProvider(updatedFields: any, comment: string): Observable<Provider> {
    console.log(`knocking on: ${this.base}/provider`);
    return this.http.put<Provider>(this.base + `/provider?comment=${comment}`, updatedFields, this.options);
  }

  updateAndPublishPendingProvider(updatedFields: any, comment: string): Observable<Provider> {
    return this.http.put<Provider>(this.base + '/pendingProvider/transform/active', updatedFields, this.options);
  }

  verifyProvider(id: string, active: boolean, status: string) { // use for onboarding process
    return this.http.patch(this.base + `/provider/verifyProvider/${id}?active=${active}&status=${status}`, {}, this.options);
  }

  auditProvider(id: string, action: string, catalogueId: string, comment: string) {
    return this.http.patch(this.base + `/provider/auditProvider/${id}?actionType=${action}&catalogueId=${catalogueId}&comment=${comment}`, this.options);
  }

  requestProviderDeletion(id: string) {
    return this.http.get(this.base + `/provider/requestProviderDeletion?providerId=${id}`, this.options);
  }

  deleteServiceProvider(id: string) {
    return this.http.delete(this.base + `/provider/${id}`, this.options);
  }

  getMyPendingProviders() {
    return this.http.get<ProviderBundle[]>(this.base + '/pendingProvider/getMyPendingProviders', this.options);
  }

  getMyServiceProviders() {
    return this.http.get<ProviderBundle[]>(this.base + '/provider/getMyServiceProviders', this.options);
  }

  getRandomProviders(quantity: string) {
    return this.http.get<ProviderBundle[]>(this.base + `/provider/randomProviders?quantity=${quantity}`, this.options);
  }

  getServiceProviderBundleById(id: string, catalogue_id?: string) {
    if(!catalogue_id) catalogue_id = 'eosc';
    // return this.http.get<ProviderBundle>(this.base + `/provider/bundle/${id}`, this.options);
    return this.http.get<ProviderBundle>(this.base + `/provider/bundle/${id}?catalogue_id=${catalogue_id}`, this.options);
  }

  getServiceProviderById(id: string, catalogue_id?: string) {
    if(!catalogue_id) catalogue_id = 'eosc';
    // return this.http.get<Provider>(this.base + `/provider/${id}`, this.options);
    return this.http.get<Provider>(this.base + `/provider/${id}?catalogue_id=${catalogue_id}`, this.options);
  }

  getPendingProviderById(id: string) {
    return this.http.get<Provider>(this.base + `/pendingProvider/provider/${id}`, this.options);
  }

  getServicesOfProvider(id: string, catalogue_id: string, from: string, quantity: string, order: string, orderField: string, active: string, status?: string, query?: string) {
    if (!query) { query = ''; }
    if (!status) { status = 'approved resource,pending resource,rejected resource'; }
    if (active === 'statusAll') {
      return this.http.get<Paging<ServiceBundle>>(this.base +
        `/service/byProvider/${id}?catalogue_id=${catalogue_id}&from=${from}&quantity=${quantity}&order=${order}&orderField=${orderField}&status=${status}&query=${query}`);
    }
    return this.http.get<Paging<ServiceBundle>>(this.base +
      `/service/byProvider/${id}?catalogue_id=${catalogue_id}&from=${from}&quantity=${quantity}&order=${order}&orderField=${orderField}&active=${active}&status=${status}&query=${query}`);
  }

  getDatasourcesOfProvider(id: string, from: string, quantity: string, order: string, orderField: string, active: string, status?: string, query?: string) {
    if (!query) { query = ''; }
    if (!status) { status = 'approved resource,pending resource,rejected resource'; }
    if (active === 'statusAll') {
      return this.http.get<Paging<Datasource>>(this.base +
        `/datasource/byProvider/${id}?from=${from}&quantity=${quantity}&order=${order}&orderField=${orderField}&status=${status}&query=${query}`);
    }
    return this.http.get<Paging<Datasource>>(this.base +
      `/datasource/byProvider/${id}?from=${from}&quantity=${quantity}&order=${order}&orderField=${orderField}&active=${active}&status=${status}&query=${query}`);
  }

  getTrainingResourcesOfProvider(id: string, catalogue_id: string, from: string, quantity: string, order: string, orderField: string, active: string, status?: string, query?: string) {
    if (!query) { query = ''; }
    if (!status) { status = 'approved resource,pending resource,rejected resource'; }
    if (active === 'statusAll') {
      return this.http.get<Paging<TrainingResourceBundle>>(this.base +
        `/trainingResource/byProvider/${id}?catalogue_id=${catalogue_id}&from=${from}&quantity=${quantity}&order=${order}&orderField=${orderField}&status=${status}&query=${query}`);
    }
    return this.http.get<Paging<TrainingResourceBundle>>(this.base +
      `/trainingResource/byProvider/${id}?catalogue_id=${catalogue_id}&from=${from}&quantity=${quantity}&order=${order}&orderField=${orderField}&active=${active}&status=${status}&query=${query}`);
  }

  getRejectedResourcesOfProvider(id: string, from: string, quantity: string, order: string, orderField: string, resourceType: string) {
    return this.http.get<Paging<any>>(this.base +
      `/provider/resources/rejected/${id}?from=${from}&quantity=${quantity}&order=${order}&orderField=${orderField}&resourceType=${resourceType}`);
  }

  publishService(id: string, version: string, active: boolean) { // toggles active/inactive service
    if (version === null) {
      return this.http.patch(this.base + `/service/publish/${id}?active=${active}`, this.options);
    }
    return this.http.patch(this.base + `/service/publish/${id}?active=${active}&version=${version}`, this.options); // copy for provider without version
  }

  publishDatasource(id: string, version: string, active: boolean) { // toggles active/inactive datasource
    if (version === null) {
      return this.http.patch(this.base + `/datasource/publish/${id}?active=${active}`, this.options);
    }
    return this.http.patch(this.base + `/datasource/publish/${id}?active=${active}&version=${version}`, this.options); // copy for provider without version
  }

  publishProvider(id: string, active: boolean) { // toggles active/inactive provider
    return this.http.patch(this.base + `/provider/publish/${id}?active=${active}`, this.options);
  }

  temporarySaveProvider(provider: Provider, providerExists: boolean) {
    // console.log('providerExists ', providerExists);
    if (providerExists) {
      return this.http.put<Provider>(this.base + '/pendingProvider/provider', provider, this.options);
    }
    return this.http.put<Provider>(this.base + '/pendingProvider/pending', provider, this.options);
  }

  getProviderRequests(id: string) {
    return this.http.get<ProviderRequest[]>(this.base + `/request/allProviderRequests?providerId=${id}`);
  }

  hasAdminAcceptedTerms(id: string, pendingProvider: boolean) {
    if (pendingProvider) {
      return this.http.get<boolean>(this.base + `/pendingProvider/hasAdminAcceptedTerms?providerId=${id}`);
    }
    return this.http.get<boolean>(this.base + `/provider/hasAdminAcceptedTerms?providerId=${id}`);
  }

  adminAcceptedTerms(id: string, pendingProvider: boolean) {
    if (pendingProvider) {
      return this.http.put(this.base + `/pendingProvider/adminAcceptedTerms?providerId=${id}`, this.options);
    }
    return this.http.put(this.base + `/provider/adminAcceptedTerms?providerId=${id}`, this.options);
  }

  validateUrl(url: string) {
    // console.log(`knocking on: ${this.base}/provider/validateUrl?urlForValidation=${url}`);
    return this.http.get<boolean>(this.base + `/provider/validateUrl?urlForValidation=${url}`);
  }

  submitVocabularyEntry(entryValueName: string, vocabulary: string, parent: string, resourceType: string, providerId?: string, resourceId?: string) {
    // console.log(`knocking on: ${this.base}/vocabularyCuration/addFront?entryValueName=${entryValueName}&vocabulary=${vocabulary}&parent=${parent}&resourceType=${resourceType}&providerId=${providerId}&resourceId=${resourceId}`);
    if (providerId && resourceId) {
      return this.http.post(this.base + `/vocabularyCuration/addFront?entryValueName=${entryValueName}&vocabulary=${vocabulary}&parent=${parent}&resourceType=${resourceType}&providerId=${providerId}&resourceId=${resourceId}`, this.options);
    } else if (providerId) {
      return this.http.post(this.base + `/vocabularyCuration/addFront?entryValueName=${entryValueName}&vocabulary=${vocabulary}&parent=${parent}&resourceType=${resourceType}&providerId=${providerId}`, this.options);
    } else {
      return this.http.post(this.base + `/vocabularyCuration/addFront?entryValueName=${entryValueName}&vocabulary=${vocabulary}&parent=${parent}&resourceType=${resourceType}`, this.options);
    }
  }

  getVocabularyCuration(status: string, from: string, quantity: string, order: string, orderField: string, vocabulary?: string, query?: string) {
    let params = new HttpParams();
    params = params.append('status', status);
    params = params.append('from', from);
    params = params.append('quantity', quantity);
    params = params.append('order', order);
    params = params.append('orderField', orderField);
    if (query && query !== '') {
      params = params.append('query', query);
    }
    if (vocabulary && vocabulary.length > 0) {
      for (const voc of vocabulary) {
        params = params.append('vocabulary', voc);
      }
    }
    return this.http.get<VocabularyCuration[]>(this.base + `/vocabularyCuration/vocabularyCurationRequests/all`, {params});
  }

  approveVocabularyEntry(curation: VocabularyCuration, approve: boolean, rejectionReason?: string): Observable<VocabularyCuration> {
    if (!rejectionReason) {
      rejectionReason = 'Not provided';
    }
    if (approve) {
      return this.http.put<VocabularyCuration>(this.base + `/vocabularyCuration/approveOrRejectVocabularyCuration?approved=true`, curation, this.options);
    }
    return this.http.put<VocabularyCuration>(this.base + `/vocabularyCuration/approveOrRejectVocabularyCuration?approved=false&rejectionReason=${rejectionReason}`, curation, this.options);
  }

  getProviderHistory(providerId: string) {
    return this.http.get<Paging<ServiceHistory>>(this.base + `/provider/history/${providerId}/`);
  }

  getProviderLoggingInfoHistory(providerId: string, catalogue_id: string) {
    // return this.http.get<Paging<LoggingInfo>>(this.base + `/provider/loggingInfoHistory/${providerId}/`);
    return this.http.get<Paging<LoggingInfo>>(this.base + `/provider/loggingInfoHistory/${providerId}?catalogue_id=${catalogue_id}`);
  }

  suspendProvider(providerId: string, catalogueId: string, suspend: boolean) {
    return this.http.put<ProviderBundle>(this.base + `/provider/suspend?providerId=${providerId}&catalogueId=${catalogueId}&suspend=${suspend}`, this.options);
  }

  getAllResourcesUnderHLE(providerName?: string){
   return this.http.get<any>(this.base + `/provider/getAllResourcesUnderASpecificHLE?providerName=${providerName}`);
  }
}
