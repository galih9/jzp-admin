import { Routes } from '@angular/router';
import { Empty } from './empty/empty';
import { RadicalList } from './crud/radical/list';
import { RadicalCrud } from './crud/radical/crud';
import { KanjiList } from './crud/kanji/list';
import { KanjiCrud } from './crud/kanji/crud';
import { VocabList } from './crud/vocab/list';
import { VocabCrud } from './crud/vocab/crud';
import { UsersManagement } from './users';
import { ActiveUsers } from './users/active/list';
import { SuspendedUsers } from './users/suspended/list';
import { OtherReport } from './users/other';
import { FeedbackList } from './feedback';
import { AllFeedback } from './feedback/all';
import { Bugs } from './feedback/bugs';
import { Improvement } from './feedback/improvement';

export default [
    {
        path: 'feedbacks',
        component: FeedbackList,
        children: [
            {
                path: 'all',
                component: AllFeedback
            },
            {
                path: 'bugs',
                component: Bugs
            },
            {
                path: 'improvement',
                component: Improvement
            }
        ]
    },
    {
        path: 'users',
        component: UsersManagement,
        children: [
            {
                path: 'active',
                component: ActiveUsers
            },
            {
                path: 'suspended',
                component: SuspendedUsers
            },
            {
                path: 'other',
                component: OtherReport
            }
        ]
    },
    {
        path: 'radical',
        component: RadicalList,
        children: [
            {
                path: 'alter',
                component: RadicalCrud
            }
        ]
    },
    {
        path: 'kanji',
        component: KanjiList,
        children: [
            {
                path: 'alter',
                component: KanjiCrud
            }
        ]
    },
    {
        path: 'vocab',
        component: VocabList,
        children: [
            {
                path: 'alter',
                component: VocabCrud
            }
        ]
    },
    { path: 'empty', component: Empty },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
