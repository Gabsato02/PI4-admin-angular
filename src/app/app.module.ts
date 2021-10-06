// MÓDULOS PARA FUNCIONAMENTO DA APLICAÇÃO
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// COMPONENTES
import { AppComponent } from './app.component';
import { CategoryComponent } from './views/category/category.component';
import { TableComponent } from './components/table/table.component';
// MATERIAL
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';

const generalComponents = [AppComponent, CategoryComponent, TableComponent];

const materialComponents = [MatToolbarModule, MatTableModule];


@NgModule({
  declarations: [
    generalComponents,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    materialComponents
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
