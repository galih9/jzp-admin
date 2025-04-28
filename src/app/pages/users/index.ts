import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TabsModule } from 'primeng/tabs';

@Component({
    selector: 'users-management',
    standalone: true,
    imports: [TabsModule, RouterModule, CommonModule],
    template: `
        <div class="card">
            <p-tabs value="active">
                <p-tablist>
                    @for (tab of tabs; track tab.route) {
                        <p-tab [value]="tab.route" [routerLink]="tab.route" class="flex items-center !gap-2 text-inherit">
                            <i [class]="tab.icon"></i>
                            <span>{{ tab.label }}</span>
                        </p-tab>    
                    }  
                </p-tablist>
            </p-tabs>
            <div class="mt-3">

                <router-outlet></router-outlet>
            </div>
        </div>
    `,
    providers: [MessageService, ConfirmationService]
})
export class UsersManagement {
    tabs = [
        { route: 'active', label: 'Active Users', icon: 'pi pi-user' },
        { route: 'suspended', label: 'Suspended Users', icon: 'pi pi-ban' },
        { route: 'other', label: 'Other Reports', icon: 'pi pi-chart-bar' }
    ];
}
