import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './views/category/category.component';
import { TraitComponent } from './views/trait/trait.component';

const routes: Routes = [
  { path: 'categoria', component: CategoryComponent },
  { path: 'traco', component: TraitComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
