import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss']
})
export class SearchFilterComponent {
  @Input() placeholder = 'Search...';
  @Input() searchValue = '';
  @Input() showFilters = false;
  @Input() filterOptions: { key: string; label: string; options: any[] }[] = [];
  
  @Output() search = new EventEmitter<string>();
  @Output() filterChange = new EventEmitter<{ key: string; value: any }>();
  @Output() clear = new EventEmitter<void>();

  onSearch(value: string): void {
    this.search.emit(value);
  }

  onFilterChange(key: string, value: any): void {
    this.filterChange.emit({ key, value });
  }

  onClear(): void {
    this.searchValue = '';
    this.clear.emit();
  }
}

