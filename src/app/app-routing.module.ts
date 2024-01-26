import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ForbiddenComponent } from './shared/pages/forbidden/forbidden.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard'},
      { path: 'dashboard', component: DashboardComponent, }, //canActivate: [AuthGuard] },
      {
        path: 'authentication',
        loadChildren: () =>
          import('./authentication/authentication.module').then(
            (m) => m.AuthenticationModule
          ),
      },
      // {
      //   path: 'privacy',
      //   component: PrivacyComponent,
      //   canActivate: [AdminGuard],
      // },
      { path: 'forbidden', component: ForbiddenComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
