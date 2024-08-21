import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class AuthService{
    constructor(){ }

    //save the token to localStorage
    saveToken(token: string): void{
        localStorage.setItem('jwtToken',token);
        const expirationTime = new Date().getTime()+5*60*1000;  // 5 minutes in milliseconds
        localStorage.setItem('tokenExpiration',expirationTime.toString());
    }

  // Retrieve the JWT token from localStorage
    getToken(): string | null {
        return localStorage.getItem('jwtToken');
    }


  // Retrieve the token expiration time from localStorage
    getTokenExpiration():number|null{
        const expiration = localStorage.getItem('tokenExpiration');
        return expiration?parseInt(expiration,10):null;
    }

    //check if the user is authenticated
    isAuthenticated():boolean{
        const token = this.getToken(); // Get the JWT token from localStorage
        const expiration=this.getTokenExpiration(); // Get the token expiration time

        if(token && expiration){   // Check if token exists and is not expired
            const currentTime = new Date().getTime();   // Compare the current time with the stored expiration time
            return currentTime < expiration;
        }

        return false;   // Return false if token is missing or expired
    }



  // Remove token and expiration time from localStorage (logout)
    clearToken(): void{
        localStorage.removeItem('jwtToken'); // Remove the JWT token
        localStorage.removeItem('tokenExpiration'); // Remove the token expiration time
    }
}