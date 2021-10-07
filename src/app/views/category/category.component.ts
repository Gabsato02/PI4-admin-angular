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
    created_at: '',
    updated_at: '',
    deleted_at: ''
  };
  updateMode = false;

  constructor(private categoryService: CategoryService, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.list();
  }

  // FUNÇÕES PÚBLICAS DE UTILIDADE
  confirmRemove(id?: number): void {
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      width: '700px',
      data: {
        answer: false,
        id
      },
    });

    console.log(id);

    dialog.afterClosed().subscribe((confirmationVo: ConfirmationVo) => {
      if (!confirmationVo.answer) {
        return;
      } else {
        this.remove(confirmationVo.id);
      }
    });
  }

  save(): void {
    if (!this.updateMode) {
      this.insert();
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
    };
    try {
      await this.categoryService.insert(payload).subscribe(() => {
        this.list();
        this.showSnackbar('Usuário inserido com sucesso!');
      });
    } catch (error) {
      this.handleError(error);
    } finally {
      this.resetForm();
    }
  }

  private async remove(id?: number): Promise<void> {
    if (!id) { return; }
    try {
      await this.categoryService.remove(id).subscribe(() => {
        this.list();
        this.showSnackbar('Usuário excluído com sucesso!');
      });
    } catch (error) {
      this.handleError(error);
    } finally {
      this.resetForm();
    }
  }

  // FUNÇÕES PRIVADAS DE UTILIDADE
  private handleError(error: unknown): void {
    const e = error as HttpErrorResponse;
    this.showSnackbar(e.statusText);
  }

  private resetForm(): void {
    this.selectedCategory = {
      id: undefined,
      name: '',
      created_at: '',
      updated_at: '',
      deleted_at: ''
    };
  }
}
