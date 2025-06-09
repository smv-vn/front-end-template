import { Routes } from '@angular/router';
import { DemoComponentComponent } from './pages/demo-component/demo-component.component';

export const routes: Routes = [
    { path: 'demo', component: DemoComponentComponent },
    {
        path: 'partner',
        loadChildren: () => import('./pages/partner/partner.module').then(m => m.PartnerModule)
    },
    { path: '', redirectTo: '/partner', pathMatch: 'full' },
    { path: '**', redirectTo: '/partner' }
];
