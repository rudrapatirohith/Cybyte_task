import { CanActivateFn } from "@angular/router";
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";


export const authGuard: CanActivateFn = () => {

    const authService = new AuthService();
    const router = new Router();



    if(authService.isAuthenticated()){
        return true;
    }
    else{
        router.navigate(['/login']);
        return false;
    }
};