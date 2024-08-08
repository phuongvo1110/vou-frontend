import { NgIf } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, Validators, FormControl, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  @ViewChild('MyInputField') MyInputField!: HTMLInputElement;
  @Input() label: string = '';
  @Input() name: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() inputMessage: string = '';
  @Input() className: string = '';
  @Input() containerClassName!: string;
  @Input() errorMessage: string = '';
  @Output() valueChange = new EventEmitter<string>();

  // This should be removed as it creates a separate control, not connected to the parent form
  // control: FormControl = new FormControl('', Validators.required);

  // Hold the internal value
  private innerValue: string = '';

  // Callbacks
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  get value(): string {
    return this.innerValue;
  }

  set value(val: string) {
    this.innerValue = val;
    this.onChange(val); // Notify Angular of value change
    this.valueChange.emit(val);
  }

  // Methods required by ControlValueAccessor interface
  writeValue(value: string): void {
    this.innerValue = value || ''; // Handle undefined case
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.MyInputField?.setAttribute('disabled', 'true');
    } else {
      this.MyInputField?.removeAttribute('disabled');
    }
  }

  // Optional: Add touched handler
  onBlur() {
    this.onTouched();
  }
}
