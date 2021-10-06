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
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

const generalComponents = [AppComponent, CategoryComponent, TableComponent];

const materialComponents = [
  MatButtonModule,
  MatIconModule,
  MatMenuModule,
  MatTableModule,
  MatToolbarModule
];


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
