import { Routes } from '@angular/router';
import { DemoComponentComponent } from './pages/demo-component/list/demo-component.component';

export const routes: Routes = [
    { path: 'demo', component: DemoComponentComponent },
    { path: '', redirectTo: '/partners', pathMatch: 'full' },
];
