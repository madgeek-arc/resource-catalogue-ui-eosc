import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from './authentication.service';
import {NavigationService} from './navigation.service';

@Injectable()
export class CanActivateViaPubGuard implements CanActivate {
    constructor(public authenticationService: AuthenticationService, public navigator: NavigationService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return !this.authenticationService.isLoggedIn() || (this.navigator.home() && false);
    }
}
