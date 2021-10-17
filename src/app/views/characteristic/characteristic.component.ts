import { Component, OnInit } from '@angular/core';
import { Characteristic } from 'src/app/models/characteristic';
import { CharacteristicService } from 'src/app/services/characteristic/characteristic.service';
import { ConfirmationVo } from 'src/app/components/confirm-dialog/confirm-vo';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { forkJoin, concat } from 'rxjs';

@Component({
  selector: 'app-characteristic',
  templateUrl: './characteristic.component.html',
  styleUrls: ['./characteristic.component.scss']
})
export class CharacteristicComponent implements OnInit {
  characteristicHeaders = {
    id: 'ID',
    name: 'Nome',
    description: 'Descrição',
    characteristics_value: 'Valor',
    created_at: 'Criado em',
    updated_at: 'Atualizado em',
    deleted_at: 'Apagado em'
  };
  characteristicContent: Characteristic[] = [];
  selectedCharacteristic: Characteristic = {
    id: undefined,
    name: '',
    description: '',
    characteristics_value: '',
    created_at: '',
    updated_at: '',
    deleted_at: ''
  };
  updateMode = false;

  constructor(
    private characteristicService: CharacteristicService, private dialog: MatDialog, private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.list();
  }

  // FUNÇÕES PÚBLICAS DE UTILIDADE
  confirmRemove(id?: number): void {
    const characteristicName = this.characteristicContent.find((characteristic) => characteristic.id === id)?.name;
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      width: '700px',
      data: {
        answer: false,
        id,
        title: 'Confirmar ação',
        message: `Deseja realmente apagar a Característica ${characteristicName}?`
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
    const characteristicName = this.characteristicContent.find((characteristic) => characteristic.id === id)?.name;
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      width: '700px',
      data: {
        answer: false,
        id,
        title: 'Confirmar ação',
        message: `Deseja realmente restaurar a Característica ${characteristicName}?`
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
    this.selectedCharacteristic = {
      id: undefined,
      name: '',
      description: '',
      characteristics_value: '',
      created_at: '',
      updated_at: '',
      deleted_at: ''
    };
    this.updateMode = false;
  }

  selectEdit(id?: number): void {
    const selectedCharacteristic = this.characteristicContent.find((characteristic) => characteristic.id === id);
    if (!selectedCharacteristic) { return; }

    this.updateMode = true;
    this.selectedCharacteristic = {
      id: selectedCharacteristic.id,
      name: selectedCharacteristic.name,
      description: selectedCharacteristic.description,
      characteristics_value: selectedCharacteristic.characteristics_value,
      created_at: selectedCharacteristic.created_at,
      updated_at: selectedCharacteristic.updated_at,
      deleted_at: selectedCharacteristic.deleted_at
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
      const list = this.characteristicService.list();
      const listDeleted = this.characteristicService.listDeleted();
      forkJoin([list, listDeleted]).subscribe(
        results => {
          this.characteristicContent = [...results[0], ...results[1]];
        }
      );
    } catch (error) {
      this.characteristicContent = [];
      this.handleError(error);
    }
  }

  private async insert(): Promise<void> {
    const payload = {
      name: this.selectedCharacteristic.name,
      description: this.selectedCharacteristic.description,
      characteristics_value: this.selectedCharacteristic.characteristics_value,
    };

    if (!payload?.name) {
      this.showSnackbar('Por favor, preencha corretamente os campos.');
      return;
    }

    try {
      await this.characteristicService.insert(payload).subscribe(() => {
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
      await this.characteristicService.remove(id).subscribe(() => {
        this.list();
        this.showSnackbar('Característica excluída com sucesso!');
      });
    } catch (error) {
      this.handleError(error);
    } finally {
      this.resetForm();
    }
  }

  private async update(): Promise<void> {
    if (!this.selectedCharacteristic?.id || !this.selectedCharacteristic?.name) {
      this.showSnackbar('Por favor, preencha corretamente os campos.');
      return;
    }

    try {
      await this.characteristicService.update(this.selectedCharacteristic).subscribe(() => {
        this.list();
        this.showSnackbar('Característica editada com sucesso!');
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
      await this.characteristicService.restore(id).subscribe(() => {
        this.list();
        this.showSnackbar('Característica restaurada com sucesso!');
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
