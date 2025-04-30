import { Component } from '@angular/core';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { IFeedback } from '../../types/users';

@Component({
    standalone: true,
    selector: 'resolved-feedback-widget',
    imports: [CommonModule, TableModule, ButtonModule, RippleModule],
    template: `<div class="card !mb-8">
        <div class="font-semibold text-xl mb-4">Feedback Resolved</div>
        <p-table [value]="feedback" [paginator]="true" [rows]="5" responsiveLayout="scroll">
            <ng-template #header>
                <tr>
                    <th>From</th>
                    <th>Title</th>
                    <th>Description</th>
                </tr>
            </ng-template>
            <ng-template #body let-feedback>
                <tr>
                    <td style="width: 20%; min-width: 7rem;">{{ feedback.email }}</td>
                    <td style="width: 35%; min-width: 7rem;">{{ feedback.title }}</td>
                    <td style="max-width: 300px" class="overflow-hidden whitespace-nowrap text-ellipsis">
                        {{ feedback.description }}
                    </td>
                </tr>
            </ng-template>
        </p-table>
    </div>`,
    providers: []
})
export class FeedbackResolved {
    feedback: IFeedback[] = [
        {
            email: 'user@mail.ru',
            title: 'Input is too small',
            description: 'please make the input text bigger so i can put text more easily,please make the input text bigger so i can put text more easily'
        }
    ];

    constructor() {}

    ngOnInit() {
    }
}
