import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { ComboboxComponent } from "./combobox/combobox.component";
import { DatepickerComponent } from "./datepicker/datepicker.component";
import { GameItemComponent } from "./game-item/game-item.component";
import { HeaderComponent } from "./header/header.component";
import { InputComponent } from "./input/input.component";
import { ListComponent } from "./list/list.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { ToastComponent } from "./toast/toast.component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { CategoryItemComponent } from "./category-item/category-item.component";
import { ModalComponent } from "./modal/modal.component";
import { ImageComponent } from "./image/image.component";

@NgModule({
  declarations: [
    NavbarComponent,
    ComboboxComponent,
    DatepickerComponent,
    GameItemComponent,
    HeaderComponent,
    InputComponent,
    ListComponent,
    ToastComponent,
    CategoryItemComponent,
    ModalComponent,
    ImageComponent
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  exports: [
    NavbarComponent,
    ComboboxComponent,
    DatepickerComponent,
    GameItemComponent,
    HeaderComponent,
    InputComponent,
    ListComponent,
    ToastComponent,
    CategoryItemComponent,
    ModalComponent,
    ImageComponent
  ],
})
export class SharedModule {

}
