import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './views/category/category.component';
import { TraitComponent } from './views/trait/trait.component';
import { CharacteristicComponent } from './views/characteristic/characteristic.component';
import { IsAuthenticatedGuard } from './guards/is-authenticated.guard';
import { LoginComponent } from './views/login/login.component';
import { ItemComponent } from './views/item/item.component';
import { UserComponent } from './views/user/user.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'item',
    component: ItemComponent,
    canActivate: [IsAuthenticatedGuard],
  },
  {
    path: 'categoria',
    component: CategoryComponent,
    canActivate: [IsAuthenticatedGuard]
  },
  {
    path: 'traco',
    component: TraitComponent,
    canActivate: [IsAuthenticatedGuard]
  },
  {
    path: 'caracteristica',
    component: CharacteristicComponent,
    canActivate: [IsAuthenticatedGuard]
  },
  {
    path: 'usuario',
    component: UserComponent,
    canActivate: [IsAuthenticatedGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
