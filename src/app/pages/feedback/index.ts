import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TabsModule } from 'primeng/tabs';

@Component({
    selector: 'feedback-management',
    standalone: true,
    imports: [TabsModule, RouterModule, CommonModule],
    template: `
        <div class="card">
            <p-tabs value="all">
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
export class FeedbackList {
    tabs = [
        { route: 'all', label: 'All Feedback', icon: 'pi pi-user' },
        { route: 'bugs', label: 'Bugs', icon: 'pi pi-ban' },
        { route: 'improvement', label: 'Improvement', icon: 'pi pi-chart-bar' }
    ];
}
