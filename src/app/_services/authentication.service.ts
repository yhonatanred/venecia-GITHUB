import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

@Injectable()
export class AuthenticationService {
    public urlUsuarios: string;
    constructor(private http: Http) { 
        this.urlUsuarios = 'http://localhost/appVeneccia/crud/usuarios.php';
    }

    login(username: string, password: string) {
        
    let ingresar= {opcion:'ingresar', user: username, password: password};
    let json = JSON.stringify(ingresar);
    let params = 'json='+json;
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});

        return this.http.post(this.urlUsuarios , params, {headers: headers})
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let user = response.json();
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    sessionStorage.setItem('currentUser', JSON.stringify(user));
                }
            });
    }

    logout() {
        // remove user from local storage to log user out
        sessionStorage.removeItem('currentUser');
    }
}