import { Component, OnInit } from '@angular/core';
import { Trait } from 'src/app/models/trait';
import { TraitService } from 'src/app/services/trait/trait.service';
import { ConfirmationVo } from 'src/app/components/confirm-dialog/confirm-vo';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-trait',
  templateUrl: './trait.component.html',
  styleUrls: ['./trait.component.scss']
})
export class TraitComponent implements OnInit {
  traitHeaders = {
    id: 'ID',
    name: 'Nome',
    description: 'Descrição',
    created_at: 'Criado em',
    updated_at: 'Atualizado em',
    deleted_at: 'Apagado em'
  };
  traitContent: Trait[] = [];
  selectedTrait: Trait = {
    id: undefined,
    name: '',
    description: '',
    created_at: '',
    updated_at: '',
    deleted_at: ''
  };
  updateMode = false;

  constructor(
    private traitService: TraitService, private dialog: MatDialog, private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.list();
  }

  // FUNÇÕES PÚBLICAS DE UTILIDADE
  confirmRemove(id?: number): void {
    const traitName = this.traitContent.find((trait) => trait.id === id)?.name;
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      width: '700px',
      data: {
        answer: false,
        id,
        title: 'Confirmar ação',
        message: `Deseja realmente apagar o traço ${traitName}?`
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
    const traitName = this.traitContent.find((trait) => trait.id === id)?.name;
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      width: '700px',
      data: {
        answer: false,
        id,
        title: 'Confirmar ação',
        message: `Deseja realmente restaurar o traço ${traitName}?`
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
    this.selectedTrait = {
      id: undefined,
      name: '',
      description: '',
      created_at: '',
      updated_at: '',
      deleted_at: ''
    };
    this.updateMode = false;
  }

  selectEdit(id?: number): void {
    const selectedTrait = this.traitContent.find((trait) => trait.id === id);
    if (!selectedTrait) { return; }

    this.updateMode = true;
    this.selectedTrait = {
      id: selectedTrait.id,
      name: selectedTrait.name,
      description: selectedTrait.description,
      created_at: selectedTrait.created_at,
      updated_at: selectedTrait.updated_at,
      deleted_at: selectedTrait.deleted_at
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
      const list = await this.traitService.list();
      const listDeleted = await this.traitService.listDeleted();
      forkJoin([list, listDeleted]).subscribe(results => {
        this.traitContent = [...results[0], ...results[1]];
      });
    } catch (error) {
      this.traitContent = [];
      this.handleError(error);
    }
  }

  private async insert(): Promise<void> {
    const payload = {
      name: this.selectedTrait.name,
      description: this.selectedTrait.description,
    };

    if (!payload?.name) {
      this.showSnackbar('Por favor, preencha corretamente os campos.');
      return;
    }

    try {
      await this.traitService.insert(payload).subscribe(() => {
        this.list();
        this.showSnackbar('Traço inserido com sucesso!');
        this.resetForm();
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  private async remove(id?: number): Promise<void> {
    if (!id) { return; }
    try {
      await this.traitService.remove(id).subscribe(() => {
        this.list();
        this.showSnackbar('Traço excluído com sucesso!');
      });
    } catch (error) {
      this.handleError(error);
    } finally {
      this.resetForm();
    }
  }

  private async update(): Promise<void> {
    if (!this.selectedTrait?.id || !this.selectedTrait?.name) {
      this.showSnackbar('Por favor, preencha corretamente os campos.');
      return;
    }

    try {
      await this.traitService.update(this.selectedTrait).subscribe(() => {
        this.list();
        this.showSnackbar('Traço editado com sucesso!');
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
      await this.traitService.restore(id).subscribe(() => {
        this.list();
        this.showSnackbar('Traço restaurado com sucesso!');
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
