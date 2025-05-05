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

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

@Component({
    selector: 'active-users-list',
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
    <p>test</p>
    `,
    providers: [MessageService, KanjiService, ConfirmationService]
})
export class ActiveUsers implements OnInit {
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
    hideDialog() {
        this.submitted = false;
    }

    saveProduct() {
        this.submitted = true;
    }
}
