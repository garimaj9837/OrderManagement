import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit, OnDestroy {
  messages: ToastMessage[] = [];
  private subscription?: Subscription;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.subscription = this.toastService.messages$.subscribe(
      messages => this.messages = messages
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  remove(id: number): void {
    this.toastService.remove(id);
  }

  getIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'success': '✓',
      'error': '✕',
      'info': 'ℹ',
      'warning': '⚠'
    };
    return icons[type] || 'ℹ';
  }
}

