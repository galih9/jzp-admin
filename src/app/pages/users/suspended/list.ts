import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { KanjiService } from '../../service/kanji.service';
import { StyleClassModule } from 'primeng/styleclass';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { IUsersData } from '../../types/users';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

@Component({
    selector: 'suspended-users-list',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule,
        StyleClassModule,
        RouterModule
    ],
    template: `
        <div class="overflow-hidden">
            <p-toolbar styleClass="mb-6">
                <ng-template #start>
                    <p-button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openNew()" />
                    <p-button severity="secondary" label="Delete" icon="pi pi-trash" outlined (onClick)="deleteSelectedProducts()" [disabled]="!selectedKanji || !selectedKanji.length" />
                </ng-template>
            </p-toolbar>
        </div>

        <router-outlet></router-outlet>

        <!-- Hide table if a child route is active -->
        <p-table *ngIf="showTable"
            #dt
            [value]="kanjiList()"
            [rows]="10"
            [columns]="cols"
            [paginator]="true"
            [globalFilterFields]="['name', 'country.name', 'representative.name', 'status']"
            [tableStyle]="{ 'min-width': '75rem' }"
            [(selection)]="selectedKanji"
            [rowHover]="true"
            dataKey="id"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[10, 20, 30]"
        >
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <h5 class="m-0">Manage Kanji</h5>
                    <p-iconfield>
                        <p-inputicon styleClass="pi pi-search" />
                        <input pInputText type="text" (input)="onGlobalFilter(dt, $event)" placeholder="Search..." />
                    </p-iconfield>
                </div>
            </ng-template>
            <ng-template #header>
                <tr>
                    <th style="width: 3rem">
                        <p-tableHeaderCheckbox />
                    </th>
                    <th pSortableColumn="character" style="min-width:16rem">
                        Character
                        <p-sortIcon field="character" />
                    </th>
                    <th pSortableColumn="hiragana" style="min-width: 8rem">
                        Hiragana
                        <p-sortIcon field="hiragana" />
                    </th>
                    <th pSortableColumn="meaning" style="min-width:10rem">
                        Meaning
                        <p-sortIcon field="meaning" />
                    </th>
                    <th pSortableColumn="totalLearned" style="min-width: 12rem">
                        User Learned
                        <p-sortIcon field="totalLearned" />
                    </th>
                    <th pSortableColumn="totalReviewed" style="min-width: 12rem">
                        User Reviewed
                        <p-sortIcon field="totalReviewed" />
                    </th>
                    <th pSortableColumn="rating" style="min-width: 12rem">
                        Rating
                        <p-sortIcon field="rating" />
                    </th>
                    <th style="min-width: 12rem">Status</th>
                    <th style="min-width: 12rem">Action</th>
                </tr>
            </ng-template>
            <ng-template #body let-kanji>
                <tr>
                    <td style="width: 3rem">
                        <p-tableCheckbox [value]="kanji" />
                    </td>
                    <td style="min-width: 12rem">{{ kanji.char }}</td>
                    <td style="min-width: 16rem">{{ kanji.hiragana }}</td>
                    <td>{{ kanji.meaning }}</td>
                    <td>{{ kanji.totalLearned }}</td>
                    <td>{{ kanji.totalReviewed }}</td>
                    <td>
                        <p-rating [(ngModel)]="kanji.rating" [readonly]="true" />
                    </td>
                    <td>
                        <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" (click)="editProduct()" pStyleClass=".boxmain" leaveActiveClass="hidden" leaveToClass="animate-slideup animate-duration-500 " />
                        <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" />
                    </td>
                </tr>
            </ng-template>
        </p-table>
    `,
    providers: [MessageService, KanjiService, ConfirmationService]
})
export class SuspendedUsers implements OnInit {
    kanjiList = signal<IUsersData[]>([]);

    kanji!: IUsersData;

    selectedKanji!: IUsersData[] | null;

    submitted: boolean = false;

    statuses!: any[];
    cols!: Column[];
    showTable: boolean = true;

    constructor(
        private kanjiService: KanjiService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private router: Router
    ) {}

    ngOnInit() {
        // Set initial state based on the current URL
        this.showTable = !this.router.url.includes('/alter');
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.showTable = !event.urlAfterRedirects.includes('/alter');
            }
        }); 
    }


    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.router.navigate(['/pages/kanji/alter']);
    }

    editProduct() {
        this.router.navigate(['/pages/kanji/alter']);
    }

    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected products?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.kanjiList.set(this.kanjiList().filter((val) => !this.selectedKanji?.includes(val)));
                this.selectedKanji = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Products Deleted',
                    life: 3000
                });
            }
        });
    }

    hideDialog() {
        this.submitted = false;
    }

    saveProduct() {
        this.submitted = true;
    }
}
