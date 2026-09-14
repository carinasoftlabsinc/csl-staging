import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-modal-form',
    templateUrl: './modal-form.component.html',
    styleUrls: ['./modal-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ModalFormComponent {
  // @Input() isVisible: boolean = false;
  // @Output() close = new EventEmitter<void>(); // Emits when the modal should close

  // formData = {
  //   name: '',
  //   email: '',
  // };

  // notificationVisible = false;
  // // Function to close the modal
  // closeModal() {
  //   this.close.emit(); // Notify parent to close the modal
  // }

  // // Function to handle form submission
  // onSubmit() {
  //   console.log('Form Submitted:', this.formData);
  //   this.closeModal(); // Close modal on form submission
  //   this.showNotification(); // Trigger notification
  // }

  // // Show notification after form submission
  // showNotification() {
  //   this.notificationVisible = true;
  //   setTimeout(() => {
  //     this.notificationVisible = false;
  //   }, 3000); // Hide notification after 3 seconds
  // }

  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>(); // Emits when the modal should close
  formData = {
    name: '',
    email: '',
  };

  // Notification visibility state
  notificationVisible: boolean = false;
  notificationMessage: string = '';

  // Function to close the modal
  closeModal() {
    this.isVisible = false;
    this.close.emit(); // Notify parent to close the modal
  }

  // Function to handle form submission
  onSubmit() {
    console.log('Form Submitted:', this.formData);
    this.showNotification('Form submitted successfully!'); // Show success notification
    this.closeModal();
  }

  // Show notification after form submission
  showNotification(message: string) {
    this.notificationMessage = message;
    this.notificationVisible = true;

    setTimeout(() => {
      this.notificationVisible = false;
    }, 3000); // Hide notification after 3 seconds
  }
}
