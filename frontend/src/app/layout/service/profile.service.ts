import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Profile } from '../pages/profile';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    private userProfile: Profile = {
        id: 'P101',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        department: 'IT',
        role: 'Developer'
    };

    getProfile(): Observable<Profile> {
        return of(this.userProfile);
    }

    updateProfile(profile: Profile): Observable<Profile> {
        this.userProfile = profile;
        return of(this.userProfile);
    }
}
