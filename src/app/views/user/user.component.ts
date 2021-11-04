import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';
import { ConfirmationVo } from 'src/app/components/confirm-dialog/confirm-vo';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  userHeaders = {id: 'ID', name: 'Nome', email: 'Email', role: 'Função', created_at: 'Criado em', updated_at: 'Atualizado em', deleted_at: 'Apagado em'};
  userContent: User[] = [];
  selectedUser: User = {
    id: undefined,
    name: '',
    email: '',
    password: '',
    role: '',
    image: '',
    created_at: '',
    updated_at: '',
    deleted_at: ''
  };
  updateMode = false;
  selectedImage: any = undefined;
  allRoles = ['admin', 'user'];

  constructor(private userService: UserService, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.list();
  }

  // FUNÇÕES PÚBLICAS DE UTILIDADE
  confirmRemove(id?: number): void {
    const userName = this.userContent.find((user) => user.id === id)?.name;
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      width: '700px',
      data: {
        answer: false,
        id,
        title: 'Confirmar ação',
        message: `Deseja realmente apagar o usuário ${userName}?`
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
    const userName = this.userContent.find((user) => user.id === id)?.name;
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      width: '700px',
      data: {
        answer: false,
        id,
        title: 'Confirmar ação',
        message: `Deseja realmente restaurar o usuário ${userName}?`
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

  onFileSelected(image: any): void {
    this.selectedImage = image;
    this.selectedUser.image = image;
  }


  resetForm(): void {
    this.selectedUser = {
      id: undefined,
      name: '',
      email: '',
      password: '',
      role: '',
      image: '',
      created_at: '',
      updated_at: '',
      deleted_at: ''
    };
    this.selectedImage = '';
    this.updateMode = false;
  }

  selectEdit(id?: number): void {
    const selectedUser = this.userContent.find((user) => user.id === id);
    if (!selectedUser) { return; }

    this.updateMode = true;
    this.selectedUser = {
      id: selectedUser.id,
      name: selectedUser.name,
      email: selectedUser.email,
      password: selectedUser.password,
      role: selectedUser.role,
      image: selectedUser.image,
      created_at: selectedUser.created_at,
      updated_at: selectedUser.updated_at,
      deleted_at: selectedUser.deleted_at
    };
    this.selectedImage = selectedUser.image;
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
      await this.userService.list().subscribe(users => {
        this.userContent = users;
      });
    } catch (error) {
      this.userContent = [];
      this.handleError(error);
    }
  }

  private async insert(): Promise<void> {
    const payload = {
      name: this.selectedUser.name,
      email: this.selectedUser.email,
      password: this.selectedUser.password,
      role: this.selectedUser.role,
      image: this.selectedImage,
    };

    if (!payload?.name || !payload?.email || !payload?.password || !payload?.role || !payload?.image) {
      this.showSnackbar('Por favor, preencha corretamente os campos.');
      return;
    }

    console.log(payload);

    try {
      await this.userService.insert(payload).subscribe(
        () => {
          this.list();
          this.showSnackbar('Usuário inserido com sucesso!');
          this.resetForm();
        },
        error => {
          console.log(error);
          if (error.error && typeof error.error === 'string') {
            this.showSnackbar(error.error);
          } else if (error.message) {
            this.showSnackbar('E-mail já cadastrado');
          } else {
            this.showSnackbar('Erro inesperado');
          }
        }
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  private async remove(id?: number): Promise<void> {
    if (!id) { return; }
    try {
      await this.userService.remove(id).subscribe(() => {
        this.list();
        this.showSnackbar('Usuário excluído com sucesso!');
      });
    } catch (error) {
      this.handleError(error);
    } finally {
      this.resetForm();
    }
  }

  private async update(): Promise<void> {
    if (!this.selectedUser?.id || !this.selectedUser?.name) {
      this.showSnackbar('Por favor, preencha corretamente os campos.');
      return;
    }

    try {
      await this.userService.update(this.selectedUser).subscribe(() => {
        this.list();
        this.showSnackbar('Usuário editado com sucesso!');
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
      await this.userService.restore(id).subscribe(() => {
        this.list();
        this.showSnackbar('Usuário restaurado com sucesso!');
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
