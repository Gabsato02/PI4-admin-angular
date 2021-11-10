import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { ConfirmationVo } from 'src/app/components/confirm-dialog/confirm-vo';
import { Item } from 'src/app/models/item';
import { ItemService } from 'src/app/services/item/item.service';
import { CategoryService } from 'src/app/services/category/category.service';
import { CharacteristicService } from 'src/app/services/characteristic/characteristic.service';
import { TraitService } from 'src/app/services/trait/trait.service';
import { Category } from 'src/app/models/category';
import { FormControl } from '@angular/forms';
import { Trait } from 'src/app/models/trait';
import { Characteristic } from 'src/app/models/characteristic';

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
    category_id: 'Categoria',
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
    image: '',
    traits: [],
    characteristics: [],
    created_at: '',
    updated_at: '',
    deleted_at: ''
  };
  selectedItemCharacteristics: Characteristic[] = [];
  allTraits: Trait[] = [];
  allCharacteristics: Characteristic[] = [];
  allCategories: Category[] = [];
  categoriesFormControl = new FormControl();
  allTraitsFormControl = new FormControl();
  allCharacteristicsFormControl = new FormControl();
  updateMode = false;
  selectedImage: any = undefined;

  constructor(
    private itemService: ItemService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private categoryService: CategoryService,
    private traitService: TraitService,
    private characteristicService: CharacteristicService,
  ) { }

  ngOnInit(): void {
    this.list();
    this.listCategories();
    this.listTraits();
    this.listCharacteristics();
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

  onFileSelected(image: any): void {
    this.selectedImage = image;
    this.selectedItem.image = image;
  }

  onCharacteristicSelect(characteristic: Characteristic): void {
    const isRepeated = Boolean(this.selectedItem.characteristics.find((selectedCharacteristic) => {
      return selectedCharacteristic.id === characteristic.id;
    }));
    if (isRepeated) { return; }
    this.selectedItem.characteristics.push(characteristic);
  }

  onTraitSelect(trait: Trait): void {
    const isRepeated = Boolean(this.selectedItem.traits.find((selectedTrait) => selectedTrait.id === trait.id));
    if (isRepeated) { return; }
    this.selectedItem.traits.push(trait);
  }

  resetForm(): void {
    this.selectedItem = {
      id: undefined,
      name: '',
      price: 0,
      description: '',
      volume: '',
      category_id: 0,
      image: '',
      traits: [],
      characteristics: [],
      created_at: '',
      updated_at: '',
      deleted_at: ''
    };
    this.updateMode = false;
    this.selectedImage = '';
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
      traits: selectedItem.traits,
      characteristics: selectedItem.characteristics,
      category_id: selectedItem.category_id,
      image: selectedItem.image,
      created_at: selectedItem.created_at,
      updated_at: selectedItem.updated_at,
      deleted_at: selectedItem.deleted_at
    };

    this.selectedImage = selectedItem.image;
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

  private async listCategories(): Promise<void> {
    try {
      await this.categoryService.list().subscribe(categories => {
        this.allCategories = categories.filter(category => category.deleted_at === null);
      });
    } catch (error) {
      this.allCategories = [];
      this.handleError(error);
    }
  }

  private async listTraits(): Promise<void> {
    try {
      await this.traitService.list().subscribe(traits => {
        this.allTraits = traits;
      });
    } catch (error) {
      this.allTraits = [];
      this.handleError(error);
    }
  }

  private async listCharacteristics(): Promise<void> {
    try {
      await this.characteristicService.list().subscribe(characteristics => {
        this.allCharacteristics = characteristics;
      });
    } catch (error) {
      this.allCharacteristics = [];
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
      image: this.selectedImage,
      traits: this.selectedItem.traits
    };

    if (!payload?.name) {
      this.showSnackbar('Por favor, preencha corretamente os campos.');
      return;
    }

    try {
      await this.itemService.insert(payload).subscribe(() => {
        this.list();
        this.showSnackbar('Item inserido com sucesso!');
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
    if (!this.selectedItem.id || !this.selectedItem?.name) {
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
      this.resetForm();
    }
  }

  async removeTrait(itemId?: number, traitId?: number): Promise<void> {
    this.selectedItem.traits = this.selectedItem.traits.filter((trait) => trait.id !== traitId);
    if (!itemId || !traitId) { return; }
    try {
      await this.itemService.removeTrait(itemId, traitId).subscribe(() => {
        this.list();
        this.showSnackbar('Traço removido com sucesso!');
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async removeCharacteristic(itemId?: number, characteristicId?: number): Promise<void> {
    this.selectedItem.characteristics = this.selectedItem.characteristics.filter((trait) => {
      return trait.id !== characteristicId;
    });
    if (!itemId || !characteristicId) { return; }
    try {
      await this.itemService.removeCharacteristic(itemId, characteristicId).subscribe(() => {
        this.list();
        this.showSnackbar('Característica removida com sucesso!');
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  // FUNÇÕES PRIVADAS DE UTILIDADE
  private handleError(error: unknown): void {
    const e = error as HttpErrorResponse;
    this.showSnackbar(e.statusText);
  }
}
