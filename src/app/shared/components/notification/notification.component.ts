import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class NotificationComponent {
  @Input() isVisible: boolean = false;
  @Input() message: string = 'Form submitted successfully!';

  constructor() {}

  showNotification() {
    this.isVisible = true;
    setTimeout(() => {
      this.isVisible = false;
    }, 3000); // Notification will disappear after 3 seconds
  }
}
