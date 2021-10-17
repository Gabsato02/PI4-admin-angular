import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { ConfirmationVo } from 'src/app/components/confirm-dialog/confirm-vo';
import { Item } from 'src/app/models/item';
import { ItemService } from 'src/app/services/item/item.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  itemHeaders = {
    id: 'ID',
    name: 'Nome',
    price: 'Preço',
    description: 'Descrição',
    volume: 'Volume',
    category_id: 'Id da Categoria',
    created_at: 'Criado em',
    updated_at: 'Atualizado em',
    deleted_at: 'Apagado em'
  };
  itemContent: Item[] = [];
  selectedItem: Item = {
    id: undefined,
    name: '',
    price: 0,
    description: '',
    volume: '',
    category_id: 0,
    created_at: '',
    updated_at: '',
    deleted_at: ''
  };
  updateMode = false;

  constructor(
    private itemService: ItemService, private dialog: MatDialog, private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.list();
  }

  // FUNÇÕES PÚBLICAS DE UTILIDADE
  confirmRemove(id?: number): void {
    const itemName = this.itemContent.find((item) => item.id === id)?.name;
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      width: '700px',
      data: {
        answer: false,
        id,
        title: 'Confirmar ação',
        message: `Deseja realmente apagar o item ${itemName}?`
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
    const itemName = this.itemContent.find((item) => item.id === id)?.name;
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      width: '700px',
      data: {
        answer: false,
        id,
        title: 'Confirmar ação',
        message: `Deseja realmente restaurar o item ${itemName}?`
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

  resetForm(): void {
    this.selectedItem = {
      id: undefined,
      name: '',
      price: 0,
      description: '',
      volume: '',
      category_id: 0,
      created_at: '',
      updated_at: '',
      deleted_at: ''
    };
    this.updateMode = false;
  }

  selectEdit(id?: number): void {
    const selectedItem = this.itemContent.find((item) => item.id === id);
    if (!selectedItem) { return; }

    this.updateMode = true;
    this.selectedItem = {
      id: selectedItem.id,
      name: selectedItem.name,
      price: selectedItem.price,
      description: selectedItem.description,
      volume: selectedItem.volume,
      category_id: selectedItem.category_id,
      created_at: selectedItem.created_at,
      updated_at: selectedItem.updated_at,
      deleted_at: selectedItem.deleted_at
    };
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
      await this.itemService.list().subscribe(items => {
        this.itemContent = items;
      });
    } catch (error) {
      this.itemContent = [];
      this.handleError(error);
    }
  }

  private async insert(): Promise<void> {
    const payload = {
      name: this.selectedItem.name,
      price: this.selectedItem.price,
      description: this.selectedItem.description,
      volume: this.selectedItem.volume,
      category_id: this.selectedItem.category_id,
    };

    if (!payload?.name) {
      this.showSnackbar('Por favor, preencha corretamente os campos.');
      return;
    }

    try {
      await this.itemService.insert(payload).subscribe(() => {
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
      await this.itemService.remove(id).subscribe(() => {
        this.list();
        this.showSnackbar('Item excluído com sucesso!');
      });
    } catch (error) {
      this.handleError(error);
    } finally {
      this.resetForm();
    }
  }

  private async update(): Promise<void> {
    if (!this.selectedItem?.id || !this.selectedItem?.name) {
      this.showSnackbar('Por favor, preencha corretamente os campos.');
      return;
    }

    try {
      await this.itemService.update(this.selectedItem).subscribe(() => {
        this.list();
        this.showSnackbar('Item editado com sucesso!');
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
      await this.itemService.restore(id).subscribe(() => {
        this.list();
        this.showSnackbar('Item restaurado com sucesso!');
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
