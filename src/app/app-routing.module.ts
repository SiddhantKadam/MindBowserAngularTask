import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  { path: '', loadChildren: () => import('./authorization/authorization.module').then(mod => mod.AuthorizationModule) },
  {path: 'layout', component: LayoutComponent,
  children: [
    { path: '', loadChildren: () => import('./pages/pages.module').then(mod => mod.PagesModule) },

  ]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
