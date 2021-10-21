import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category/category.service';
import { ConfirmationVo } from 'src/app/components/confirm-dialog/confirm-vo';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  categoryHeaders = {id: 'ID', name: 'Nome', created_at: 'Criado em', updated_at: 'Atualizado em', deleted_at: 'Apagado em'};
  categoryContent: Category[] = [];
  selectedCategory: Category = {
    id: undefined,
    name: '',
    image: '',
    created_at: '',
    updated_at: '',
    deleted_at: ''
  };
  updateMode = false;
  selectedImage: any = undefined;
  preview?: string | ArrayBuffer | null;

  constructor(private categoryService: CategoryService, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.preview = '../../../assets/default.png';
    this.list();
  }

  // FUNÇÕES PÚBLICAS DE UTILIDADE
  confirmRemove(id?: number): void {
    const categoryName = this.categoryContent.find((category) => category.id === id)?.name;
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      width: '700px',
      data: {
        answer: false,
        id,
        title: 'Confirmar ação',
        message: `Deseja realmente apagar a categoria ${categoryName}?`
      },
    });

    dialog.afterClosed().subscribe((confirmationVo: ConfirmationVo) => {
      if (!confirmationVo.answer) {
        return;
      } else {
        this.remove(confirmationVo.id);
      }
    });
  }

  confirmRestore(id?: number): void {
    const categoryName = this.categoryContent.find((category) => category.id === id)?.name;
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      width: '700px',
      data: {
        answer: false,
        id,
        title: 'Confirmar ação',
        message: `Deseja realmente restaurar a categoria ${categoryName}?`
      },
    });

    dialog.afterClosed().subscribe((confirmationVo: ConfirmationVo) => {
      if (!confirmationVo.answer) {
        return;
      } else {
        this.restore(confirmationVo.id);
      }
    });
  }

  async onFileSelected(event: any): Promise<any> {
    this.selectedImage = event.srcElement.files[0];
    this.selectedCategory.image = await this.toBase64(this.selectedImage);
  }

  toBase64(file: any): any {
    return new Promise<any>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);

      reader.addEventListener('load', () => {
        this.preview = reader.result;
      }, false);
    });
  }

  resetForm(): void {
    this.selectedCategory = {
      id: undefined,
      name: '',
      image: '',
      created_at: '',
      updated_at: '',
      deleted_at: ''
    };
    this.updateMode = false;
    this.preview = '../../../assets/default.png';
  }

  selectEdit(id?: number): void {
    const selectedCategory = this.categoryContent.find((category) => category.id === id);
    if (!selectedCategory) { return; }

    this.updateMode = true;
    this.selectedCategory = {
      id: selectedCategory.id,
      name: selectedCategory.name,
      image: selectedCategory.image,
      created_at: selectedCategory.created_at,
      updated_at: selectedCategory.updated_at,
      deleted_at: selectedCategory.deleted_at
    };
    this.preview = selectedCategory.image;
  }

  save(): void {
    if (!this.updateMode) {
      this.insert();
    } else {
      this.update();
    }
  }

  showSnackbar(message: string): void {
    this.snackBar.open(message, '', {
      duration: 3000
    });
  }

  // FUNÇÕES DE SERVIÇOS
  private async list(): Promise<void> {
    try {
      await this.categoryService.list().subscribe(categories => {
        this.categoryContent = categories;
      });
    } catch (error) {
      this.categoryContent = [];
      this.handleError(error);
    }
  }

  private async insert(): Promise<void> {
    const payload = {
      name: this.selectedCategory.name,
      image: this.selectedCategory.image,
    };

    if (!payload?.name) {
      this.showSnackbar('Por favor, preencha corretamente os campos.');
      return;
    }

    try {
      await this.categoryService.insert(payload).subscribe(() => {
        this.list();
        this.showSnackbar('Usuário inserido com sucesso!');
        this.resetForm();
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  private async remove(id?: number): Promise<void> {
    if (!id) { return; }
    try {
      await this.categoryService.remove(id).subscribe(() => {
        this.list();
        this.showSnackbar('Categoria excluída com sucesso!');
      });
    } catch (error) {
      this.handleError(error);
    } finally {
      this.resetForm();
    }
  }

  private async update(): Promise<void> {
    if (!this.selectedCategory?.id || !this.selectedCategory?.name) {
      this.showSnackbar('Por favor, preencha corretamente os campos.');
      return;
    }

    try {
      await this.categoryService.update(this.selectedCategory).subscribe(() => {
        this.list();
        this.showSnackbar('Categoria editada com sucesso!');
      });
    } catch (error) {
      this.handleError(error);
    } finally {
      this.resetForm();
    }
  }

  private async restore(id?: number): Promise<void> {
    if (!id) { return; }
    try {
      await this.categoryService.restore(id).subscribe(() => {
        this.list();
        this.showSnackbar('Categoria restaurada com sucesso!');
      });
    } catch (error) {
      this.handleError(error);
    } finally {
      this.list();
      this.resetForm();
    }
  }

  // FUNÇÕES PRIVADAS DE UTILIDADE
  private handleError(error: unknown): void {
    const e = error as HttpErrorResponse;
    this.showSnackbar(e.statusText);
  }
}
