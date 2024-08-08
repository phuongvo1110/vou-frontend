import { NgFor } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  ViewChild,
  HostListener,
  Renderer2,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, ReactiveFormsModule } from '@angular/forms';
import { createPopper } from '@popperjs/core';

@Component({
  selector: 'app-combobox',
  templateUrl: './combobox.component.html',
  styleUrls: ['./combobox.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ComboboxComponent),
      multi: true,
    },
  ],
})
export class ComboboxComponent implements AfterViewInit, ControlValueAccessor {
  @Input() className: string = '';
  @Input() label: string = '';
  @Input() controlName: string = '';
  @Input() placeholder: string = 'Select your option';
  @Input() options: { id: string; name: string; value: string }[] = [];

  @Output() valueChange = new EventEmitter<string>();

  dropdownPopoverShow = false;
  selectedValue: string = '';

  // Add null checks for ViewChild
  @ViewChild('btnDropdownRef', { static: false }) btnDropdownRef!: ElementRef;
  @ViewChild('popoverDropdownRef', { static: false }) popoverDropdownRef!: ElementRef;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private renderer: Renderer2) {
    // Listening to document click events to detect outside clicks
    this.renderer.listen('document', 'click', (event: MouseEvent) => {
      this.handleClickOutside(event);
    });
  }

  ngAfterViewInit() {
    // Check if elements exist before using createPopper
    if (this.btnDropdownRef && this.popoverDropdownRef) {
      createPopper(this.btnDropdownRef.nativeElement, this.popoverDropdownRef.nativeElement, {
        placement: 'bottom-start',
      });
    }
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.dropdownPopoverShow = !this.dropdownPopoverShow;
  }

  selectOption(option: { id: string; name: string; value: string }) {
    this.selectedValue = option.value;
    this.placeholder = option.name;
    this.dropdownPopoverShow = false;
    this.onChange(this.selectedValue);
    this.onTouched();
    this.valueChange.emit(this.selectedValue);
  }

  handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (
      this.dropdownPopoverShow &&
      !this.btnDropdownRef.nativeElement.contains(target) &&
      !this.popoverDropdownRef.nativeElement.contains(target)
    ) {
      this.dropdownPopoverShow = false;
    }
  }

  writeValue(value: string): void {
    this.selectedValue = value;
    const selectedOption = this.options.find((opt) => opt.value === value);
    if (selectedOption) {
      this.placeholder = selectedOption.name;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.btnDropdownRef?.nativeElement.setAttribute('disabled', 'true');
    } else {
      this.btnDropdownRef?.nativeElement.removeAttribute('disabled');
    }
  }
}
