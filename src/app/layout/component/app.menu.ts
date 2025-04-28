import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            },
            {
                label: 'Kanji',
                items: [
                    { label: 'Radical Management', icon: 'pi pi-fw pi-book', routerLink: ['/pages/radical'], routerLinkActiveOptions: { exact: false } },
                    { label: 'Kanji Management', icon: 'pi pi-fw pi-book', routerLink: ['/pages/kanji'], routerLinkActiveOptions: { exact: false } },
                    { label: 'Vocab Management', icon: 'pi pi-fw pi-book', routerLink: ['/pages/vocab'], routerLinkActiveOptions: { exact: false } }
                ]
            },
            {
                label: 'Support',
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['/pages'],
                items: [
                    {
                        label: 'Account Center',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['/pages/users/active'],
                        routerLinkActiveOptions: { exact: false }
                    },
                    {
                        label: 'Feedback List',
                        icon: 'pi pi-fw pi-envelope',
                        routerLink: ['/pages/feedbacks/all'],
                        routerLinkActiveOptions: { exact: false }
                    }
                ]
            }
        ];
    }
}
