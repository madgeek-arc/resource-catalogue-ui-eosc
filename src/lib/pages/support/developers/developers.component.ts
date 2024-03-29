import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {environment} from '../../../../environments/environment';

@Component({
    selector: 'app-developers',
    templateUrl: './developers.component.html',
    styleUrls: ['./developers.component.css']
})
export class DevelopersComponent implements OnInit {

    public apiTokenEndpoint = environment.API_TOKEN_ENDPOINT;

    constructor(private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.fragment.subscribe(fragment => this.scrollTo('#' + fragment));
    }

    scrollTo(selector: string) {
        const element = document.querySelector(selector);
        if (element) {
            // element.scrollIntoView(element);
            // element.scrollIntoView();
            element.scrollIntoView({behavior: 'smooth', block: 'end', inline: 'nearest'});
        }
    }
}
