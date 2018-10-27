import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AdminAuthGuard implements CanActivate {


    public rol: any={};
    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        this.rol = JSON.parse(sessionStorage.getItem('currentUser'));
        if (this.rol.rol = 'adminisrador') {
            // logged in so return true
            return true;
        }
        return false;
    }
}