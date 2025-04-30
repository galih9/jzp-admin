import { Component } from '@angular/core';
import { StatsWidget } from './components/statswidget';
import { UsersLeaderboardWidget } from './components/usersleaderboard';
import { RevenueStreamWidget } from './components/revenuestreamwidget';
import { FeedbackResolved } from './components/resolvedfeedback';

@Component({
    selector: 'app-dashboard',
    imports: [StatsWidget, UsersLeaderboardWidget, RevenueStreamWidget, FeedbackResolved],
    template: `
        <div class="grid grid-cols-12 gap-8">
            <app-stats-widget class="contents" />
            <div class="col-span-12 xl:col-span-12">
                <app-revenue-stream-widget />
            </div>
            <div class="col-span-12 xl:col-span-6">
                <users-leaderboard-widget />
            </div>
            <div class="col-span-12 xl:col-span-6">
                <resolved-feedback-widget />
            </div>
        </div>
    `
})
export class Dashboard {}
