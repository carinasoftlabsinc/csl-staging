import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'checkinTime'
})
export class CheckinTimePipe implements PipeTransform {
  transform(value: string): string {
    // Convert the check-in time value to the desired format
    // Example: Convert "2023-07-06T02:30:00.000Z" to "02:30 AM"
    const checkinTime = new Date(value);
    const formattedTime = checkinTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return formattedTime;
  }
}
