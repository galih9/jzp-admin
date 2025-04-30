import { Component } from '@angular/core';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { IFeedback, IUser } from '../../types/users';

@Component({
    standalone: true,
    selector: 'users-leaderboard-widget',
    imports: [CommonModule, TableModule, ButtonModule, RippleModule],
    template: `<div class="card !mb-8">
        <div class="font-semibold text-xl mb-4">Users Leaderboard</div>
        <p-table [value]="users" [paginator]="true" [rows]="5" responsiveLayout="scroll">
            <ng-template #header>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Level</th>
                </tr>
            </ng-template>
            <ng-template #body let-users>
                <tr>
                    <td style="width: 35%; min-width: 7rem;">{{ users.name }}</td>
                    <td style="width: 35%; min-width: 7rem;">{{ users.email }}</td>
                    <td style="width: 35%; min-width: 7rem;">{{ users.level }}</td>
                </tr>
            </ng-template>
        </p-table>
    </div>`,
    providers: []
})
export class UsersLeaderboardWidget {
    users: IUser[] = [
        {
            name: 'Abdul',
            email: 'Abdul@mail.ru',
            level: 3
        }
    ];

    constructor() {}

    ngOnInit() {
    }
}
