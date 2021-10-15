// MÓDULOS PARA FUNCIONAMENTO DA APLICAÇÃO
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// COMPONENTES
import { AppComponent } from './app.component';
import { CategoryComponent } from './views/category/category.component';
import { TableComponent } from './components/table/table.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';

// MATERIAL
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { TraitComponent } from './views/trait/trait.component';
import { CharacteristicComponent } from './views/characteristic/characteristic.component';
import { LoginComponent } from './views/login/login.component';

const generalComponents = [AppComponent, CategoryComponent, ConfirmDialogComponent, TableComponent];

const materialComponents = [
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatFormFieldModule,
  MatListModule,
  MatMenuModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatTableModule,
  MatToolbarModule,
];


@NgModule({
  declarations: [
    generalComponents,
    TraitComponent,
    CharacteristicComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    materialComponents
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
