import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationsWidget } from './components/notificationswidget';
import { StatsWidget } from './components/statswidget';
import { EmployeeTasksDashboard } from './components/empoyeeTasksDashboard';
import { BestSellingWidget } from './components/bestsellingwidget';
import { RevenueStreamWidget } from './components/revenuestreamwidget';

@Component({
    standalone: true, // ✅ Add this!
    selector: 'app-dashboard',
    imports: [
        CommonModule, // ✅ Needed for structural directives like *ngIf, *ngFor
        StatsWidget,
        EmployeeTasksDashboard,
        BestSellingWidget,
        RevenueStreamWidget,
        NotificationsWidget
    ],
    template: `
        <div class="grid grid-cols-12 gap-8">
            <app-stats-widget class="contents" />
            <div class="col-span-12 xl:col-span-6">
                <app-recent-sales-widget />
                <app-best-selling-widget />
            </div>
            <div class="col-span-12 xl:col-span-6">
                <app-revenue-stream-widget />
                <app-notifications-widget />
            </div>
        </div>
    `
})
export class Dashboard { }
