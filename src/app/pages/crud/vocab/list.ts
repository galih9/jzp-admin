import { Component, OnInit, signal } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule, TablePageEvent } from 'primeng/table';
import { CommonModule, Location } from '@angular/common';
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
import { StyleClassModule } from 'primeng/styleclass';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { IKanji } from '../../types/kanji';
import { KanjiService } from '../../service/kanji.service';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

@Component({
    selector: 'v-list',
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
        RouterModule,
        ConfirmDialogModule
    ],
    template: `
        <div class="overflow-hidden">
            <p-toolbar styleClass="mb-6">
                <ng-template #start>
                    <p-button
                        [label]="isCrud ? 'Back' : 'New'"
                        [icon]="isCrud ? 'pi pi-times' : 'pi pi-plus'"
                        severity="secondary"
                        class="mr-2"
                        (onClick)="onNewOrBack()"
                    />
                    <p-button
                        severity="primary"
                        label="Delete"
                        icon="pi pi-trash"
                        outlined
                        (onClick)="onDeleteSelected()"
                        [disabled]="!selectedKanji || !selectedKanji.length"
                    />
                </ng-template>
            </p-toolbar>
        </div>
        <p-toast />
        <router-outlet></router-outlet>

        <p-table
            *ngIf="showTable"
            #dt
            [value]="kanjiList()"
            [rows]="perPage"
            [first]="page"
            [columns]="cols"
            [paginator]="true"
            [totalRecords]="totalRecords"
            [lazy]="true"
            (onPage)="onPageChange($event)"
            [tableStyle]="{ 'min-width': '75rem' }"
            [(selection)]="selectedKanji"
            [rowHover]="true"
            dataKey="id"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} vocabs"
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[5, 10, 20]"
        >
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <h5 class="m-0">Manage Vocabs</h5>
                    <p-iconfield>
                        <p-inputicon styleClass="pi pi-search" />
                        <input
                            pInputText
                            type="text"
                            [(ngModel)]="filterText"
                            placeholder="Search globally"
                            (keyup.enter)="onGlobalFilter()"
                        />
                    </p-iconfield>
                </div>
            </ng-template>
            <ng-template #header>
                <tr>
                    <th style="width: 3rem">
                        <p-tableHeaderCheckbox />
                    </th>
                    <th pSortableColumn="char" style="min-width:12rem">
                        Character
                        <p-sortIcon field="char" />
                    </th>
                    <th pSortableColumn="hiragana" style="min-width:12rem">
                        Reading
                        <p-sortIcon field="hiragana" />
                    </th>
                    <th pSortableColumn="meaning_primary" style="min-width:16rem">
                        Mnemonic Meaning
                        <p-sortIcon field="meaning_primary" />
                    </th>
                    <th style="min-width: 12rem">Action</th>
                </tr>
            </ng-template>
            <ng-template #body let-kanji>
                <tr>
                    <td style="width: 3rem">
                        <p-tableCheckbox [value]="kanji" />
                    </td>
                    <td>{{ kanji.char }}</td>
                    <td>{{ kanji.hiragana }}</td>
                    <td>{{ kanji.meaning_primary }}</td>
                    <td>
                        <p-button
                            icon="pi pi-pencil"
                            class="mr-2"
                            [rounded]="true"
                            [outlined]="true"
                            (click)="onEdit(kanji)"
                            pStyleClass=".boxmain"
                            leaveActiveClass="hidden"
                            leaveToClass="animate-slideup animate-duration-500 "
                        />
                        <p-button
                            icon="pi pi-trash"
                            severity="danger"
                            [rounded]="true"
                            [outlined]="true"
                            (click)="onDelete(kanji)"
                        />
                    </td>
                </tr>
            </ng-template>
        </p-table>

        <p-confirmdialog [style]="{ width: '450px' }" />
    `,
    providers: [MessageService, KanjiService, ConfirmationService]
})
export class VocabList implements OnInit {
    kanjiList = signal<IKanji[]>([]);
    totalRecords = 0;
    page = 0;
    perPage = 5;

    selectedKanji: IKanji[] | null = null;
    showTable = true;
    isCrud = false;

    filterText = '';

    readonly statuses = [
        { label: 'ACTIVE', value: 'instock' },
        { label: 'ARCHIVED', value: 'lowstock' },
        { label: 'ON TRASHCAN', value: 'outofstock' }
    ];

    readonly cols: Column[] = [
        { field: 'code', header: 'Code', customExportHeader: 'Product Code' },
        { field: 'name', header: 'Name' },
        { field: 'price', header: 'Price' },
        { field: 'category', header: 'Category' }
    ];

    constructor(
        private kanjiService: KanjiService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private location: Location,
        private router: Router
    ) {}

    ngOnInit() {
        this.updateCrudState(this.router.url);
        // Only fetch if we're not in CRUD mode
        if (!this.isCrud) {
            this.fetchVocabs();
        }

        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                const wasCrud = this.isCrud;
                this.updateCrudState(event.urlAfterRedirects);

                // Only fetch if we're returning to the list view from CRUD
                if (wasCrud && !this.isCrud) {
                    this.fetchVocabs();
                }
            }
        });
    }

    private updateCrudState(url: string) {
        const isAlterRoute = url.includes('/alter');
        this.showTable = !isAlterRoute;
        this.isCrud = isAlterRoute;
    }

    fetchVocabs() {
        const pageNumber = Math.floor(this.page / this.perPage) + 1;

        this.kanjiService
            .getVocabListPaginated({
                per_page: this.perPage,
                page: pageNumber
            })
            .then((data) => {
                if (data.success) {
                    this.kanjiList.set(data.data);
                    this.totalRecords = data.pagination?.totalData ?? data.data.length;
                }
            });
    }

    onPageChange(event: TablePageEvent) {
        this.page = event.first ?? 0; // Keep the raw first value
        this.perPage = event.rows ?? this.perPage;
        this.fetchVocabs();
    }

    onGlobalFilter() {
        this.kanjiService
            .getVocabListPaginated({
                per_page: this.perPage,
                page: 1,
                char: this.filterText
            })
            .then((data) => {
                if (data.success) {
                    this.kanjiList.set(data.data);
                    this.totalRecords = data.pagination?.totalData ?? data.data.length;
                }
            });
    }

    onNewOrBack() {
        if (!this.isCrud) {
            this.router.navigate(['/pages/vocab/alter']);
        } else {
            this.location.back();
        }
    }

    onEdit(kanji: IKanji) {
        if (!this.isCrud) {
            this.router.navigate(['/pages/vocab/alter'], {
                queryParams: { char: kanji.char },
                state: {
                    mode: 'edit'
                }
            });
        } else {
            this.location.back();
        }
    }

    async onDeleteSelected() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected vocabs?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                if (!this.selectedKanji) return;

                try {
                    for (const vocab of this.selectedKanji) {
                        const result = await this.kanjiService.deleteVocab(vocab.lesson_id ?? '');
                        if (!result.success) {
                            throw new Error(result.message);
                        }
                    }

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Vocabs Deleted',
                        life: 3000
                    });
                    this.selectedKanji = null;
                    this.fetchVocabs();
                } catch (error) {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error instanceof Error ? error.message : 'Failed to delete vocabs',
                        life: 3000
                    });
                }
            }
        });
    }

    onDelete(item: IKanji) {
        this.confirmationService.confirm({
            message:
                'Are you sure you want to delete ' + item.char + ' - ' + item.meaning_primary + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    const result = await this.kanjiService.deleteVocab(item.lesson_id ?? '');
                    if (!result.success) {
                        throw new Error(result.message);
                    }

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Vocab Deleted',
                        life: 3000
                    });
                    this.fetchVocabs();
                } catch (error) {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error instanceof Error ? error.message : 'Failed to delete vocab',
                        life: 3000
                    });
                }
            }
        });
    }
}
