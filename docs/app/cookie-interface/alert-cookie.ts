import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieManagerService } from '../util/cookie-utils';

interface Alert {
    type: string;
    message: string;
    deny: string;
    allow: string;
}

@Component({
    selector: 'alert-cookie',
    templateUrl: './alert-cookie.html',
    styleUrls: ['./alert-cookie.css'],
    providers: [CookieManagerService, TranslateService]
})
export class AlertCookieService {

    private cookieAlert: Alert = {
        type: 'warning',
        message: 'This is an success alert',
        deny: 'Refuse Cookies',
        allow: 'Accept Cookies',
    };
    private GA_ID = 'test';
    private showAlertCookie: boolean = true;

    constructor(private translateService: TranslateService, private cookiemanager: CookieManagerService) {}

    public initAlertCookieService() {
        if (this.showAlertCookie) {
            this.translateService.addLangs(['en', 'fr']);
            this.translateService.setDefaultLang('en');

            const browserLang = this.translateService.getBrowserLang();
            this.translateService.use(browserLang.match(/en|fr/) ? browserLang : 'en');

            this.translateService.get(['cookie.header', 'cookie.message', 'cookie.allow', 'cookie.deny']).subscribe((data) => {
                this.cookieAlert.type = 'warning';
                this.cookieAlert.message = data['cookie.message'];
                this.cookieAlert.deny = data['cookie.deny'];
                this.cookieAlert.allow = data['cookie.allow'];
            });

            const TrackNavigator = navigator.doNotTrack;
                // Check donotTrack and Cookie Consent and do nothing if those values are positive
            if ( TrackNavigator === '1' || TrackNavigator === 'yes' || !TrackNavigator) {
                this.cookiemanager.rejectCookie(this.GA_ID);
                this.showAlertCookie = false;
                return;
            }
            if ( !this.cookiemanager.getCookie('consent') && (TrackNavigator === '1' || TrackNavigator === 'yes' || !TrackNavigator)) {
                this.cookiemanager.rejectCookie(this.GA_ID);
                this.showAlertCookie = false;
                return;
            }
            if (this.cookiemanager.getCookie('consent') === 'false') {
                this.cookiemanager.rejectCookie(this.GA_ID);
                this.showAlertCookie = false;
                return;
            }
        }
    }

    public deny() {
        this.cookiemanager.rejectCookie(this.GA_ID);
        this.showAlertCookie = false;
        return;
    }

    public allow() {
        this.cookiemanager.setCookie('consent', true);
        this.showAlertCookie = false;
        return;
    }
}
