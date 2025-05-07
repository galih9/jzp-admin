import { Component, OnInit, signal } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule, TablePageEvent } from 'primeng/table';
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

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    selector: 'k-list',
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
                    <p-button
                        [label]="isCrud ? 'Back' : 'New'"
                        [icon]="isCrud ? 'pi pi-times' : 'pi pi-plus'"
                        severity="secondary"
                        class="mr-2"
                        (onClick)="onNewOrBack()"
                    />
                    <p-button
                        severity="secondary"
                        label="Delete"
                        icon="pi pi-trash"
                        outlined
                        (onClick)="deleteSelectedKanji()"
                        [disabled]="!selectedKanji || !selectedKanji.length"
                    />
                </ng-template>
            </p-toolbar>
        </div>

        <router-outlet></router-outlet>

        <!-- Hide table if a child route is active -->
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
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} radicals"
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[5, 10, 20]"
        >
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <h5 class="m-0">Manage Kanji</h5>
                    <p-iconfield>
                        <p-inputicon styleClass="pi pi-search" />
                        <input
                            pInputText
                            type="text"
                            (input)="onGlobalFilter(dt, $event)"
                            placeholder="Search..."
                        />
                    </p-iconfield>
                </div>
            </ng-template>
            <ng-template #header>
                <tr>
                    <th style="width: 3rem">
                        <p-tableHeaderCheckbox />
                    </th>
                    <th pSortableColumn="character" style="min-width:6rem">
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
                    <th style="min-width: 12rem">Action</th>
                </tr>
            </ng-template>
            <ng-template #body let-kanji>
                <tr>
                    <td style="width: 3rem">
                        <p-tableCheckbox [value]="kanji" />
                    </td>
                    <td style="min-width: 6rem">{{ kanji.char }}</td>
                    <td style="min-width: 8rem">{{ kanji.hiragana }}</td>
                    <td>{{ kanji.meaning_primary }}</td>
                    <td>
                        <p-button
                            icon="pi pi-pencil"
                            class="mr-2"
                            [rounded]="true"
                            [outlined]="true"
                            (click)="editProduct(kanji)"
                            pStyleClass=".boxmain"
                            leaveActiveClass="hidden"
                            leaveToClass="animate-slideup animate-duration-500 "
                        />
                        <p-button
                            icon="pi pi-trash"
                            severity="danger"
                            [rounded]="true"
                            [outlined]="true"
                            (click)="deleteProduct(kanji)"
                        />
                    </td>
                </tr>
            </ng-template>
        </p-table>
    `,
    providers: [MessageService, KanjiService, ConfirmationService]
})
export class KanjiList implements OnInit {
    kanjiList = signal<IKanji[]>([]);
    totalRecords = 0;
    page = 0;
    perPage = 5;

    kanji: IKanji | undefined;

    selectedKanji!: IKanji[] | null;

    submitted: boolean = false;

    cols!: Column[];
    showTable: boolean = true;
    isCrud = false;

    constructor(
        private kanjiService: KanjiService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private router: Router,
        private location: Location
    ) {}

    ngOnInit() {
        this.updateCrudState(this.router.url);
        // Only fetch if we're not in CRUD mode
        if (!this.isCrud) {
            this.fetchKanji();
        }

        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                const wasCrud = this.isCrud;
                this.updateCrudState(event.urlAfterRedirects);

                // Only fetch if we're returning to the list view from CRUD
                if (wasCrud && !this.isCrud) {
                    this.fetchKanji();
                }
            }
        });
    }

    fetchKanji() {
        const pageNumber = Math.floor(this.page / this.perPage) + 1;

        this.kanjiService
            .getKanjiListPaginate({
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

    private updateCrudState(url: string) {
        const isAlterRoute = url.includes('/alter');
        this.showTable = !isAlterRoute;
        this.isCrud = isAlterRoute;
    }

    onPageChange(event: TablePageEvent) {
        this.page = event.first ?? 0; // Keep the raw first value
        this.perPage = event.rows ?? this.perPage;
        this.fetchKanji();
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    onNewOrBack() {
        if (!this.isCrud) {
            this.router.navigate(['/pages/kanji/alter']);
        } else {
            this.location.back();
        }
    }

    editProduct(kanji: IKanji) {
        this.router.navigate(['/pages/kanji/alter'], {
            queryParams: {
                char: kanji.char
            }
        });
    }

    deleteSelectedKanji() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected radicals?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                if (!this.selectedKanji) return;

                try {
                    for (const radical of this.selectedKanji) {
                        const result = await this.kanjiService.deleteRadical(
                            radical.lesson_id ?? ''
                        );
                        if (!result.success) {
                            throw new Error(result.message);
                        }
                    }

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Radicals Deleted',
                        life: 3000
                    });
                    this.selectedKanji = null;
                    this.fetchKanji();
                } catch (error) {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail:
                            error instanceof Error ? error.message : 'Failed to delete radicals',
                        life: 3000
                    });
                }
            }
        });
    }

    hideDialog() {
        this.submitted = false;
    }

    deleteProduct(kanji: IKanji) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + kanji.char + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.kanji = undefined;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Deleted',
                    life: 3000
                });
            }
        });
    }

    saveProduct() {
        this.submitted = true;
    }
}
