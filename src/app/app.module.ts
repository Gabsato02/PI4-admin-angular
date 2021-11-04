// MÓDULOS PARA FUNCIONAMENTO DA APLICAÇÃO
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// COMPONENTES
import { AppComponent } from './app.component';
import { CategoryComponent } from './views/category/category.component';
import { TableComponent } from './components/table/table.component';
import { ImageCropperComponent } from './components/image-cropper/image-cropper.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { LoginComponent } from './views/login/login.component';
import { ItemComponent } from './views/item/item.component';
import { TraitComponent } from './views/trait/trait.component';
import { CharacteristicComponent } from './views/characteristic/characteristic.component';

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
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { UserComponent } from './views/user/user.component';
import { ImageCropperModule } from 'ngx-image-cropper';

const generalComponents = [
  AppComponent,
  CategoryComponent,
  ConfirmDialogComponent,
  TableComponent,
  ImageCropperComponent,
  TraitComponent,
  CharacteristicComponent,
  LoginComponent,
  ItemComponent
];

const materialComponents = [
  MatButtonModule,
  MatCardModule,
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
  MatSortModule,
  MatPaginatorModule,
  MatSelectModule,
  MatChipsModule,
];


@NgModule({
  declarations: [
    generalComponents,
    UserComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    materialComponents,
    ImageCropperModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
