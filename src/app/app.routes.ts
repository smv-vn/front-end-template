import { Routes } from '@angular/router';
import { DemoComponentComponent } from './pages/demo-component/demo-component.component';
import { PartnerListComponent } from './pages/partner-list/partner-list.component';

export const routes: Routes = [
    { path: 'demo', component: DemoComponentComponent },
    { path: 'partners', component: PartnerListComponent },
    { path: '', redirectTo: '/partners', pathMatch: 'full' },
];
