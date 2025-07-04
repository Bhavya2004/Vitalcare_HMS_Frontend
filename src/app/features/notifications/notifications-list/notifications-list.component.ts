import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../notification.service';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../../layout/sidebar/sidebar.component';

@Component({
  selector: 'app-notifications-list',
  standalone: true,
  imports: [CommonModule,RouterModule, SidebarComponent],
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.css']
})
export class NotificationsListComponent implements OnInit {
  notifications: Notification[] = [];
  loading = true;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.fetchNotifications();
  }

  fetchNotifications() {
    this.loading = true;
    this.notificationService.getNotifications().subscribe(
      notifications => {
        this.notifications = notifications;
        this.loading = false;
      },
      () => this.loading = false
    );
  }

  markAsRead(notification: Notification) {
    if (!notification.isRead) {
      this.notificationService.markAsRead(notification.id).subscribe(() => {
        notification.isRead = true;
      });
    }
  }
} 