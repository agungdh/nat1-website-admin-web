import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  OnInit,
  computed,
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { TagService, TagDto } from '../../services/tag.service';
import { TagDialog, TagDialogData } from './tag-dialog/tag-dialog';

@Component({
  selector: 'app-tags',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './tags.html',
  styleUrl: './tags.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tags implements OnInit {
  private readonly tagService = inject(TagService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly tags = signal<TagDto[]>([]);
  protected readonly loading = signal(true);
  protected readonly totalElements = signal(0);

  protected readonly page = signal(0);
  protected readonly pageSize = signal(10);
  protected readonly sortField = signal('name');
  protected readonly sortDirection = signal<'asc' | 'desc'>('asc');

  protected readonly displayedColumns = computed(() => ['index', 'name', 'slug', 'actions']);

  private get sortString(): string {
    return `${this.sortField()},${this.sortDirection()}`;
  }

  ngOnInit() {
    this.loadTags();
  }

  private loadTags() {
    this.loading.set(true);
    this.tagService
      .findAll({
        page: this.page(),
        size: this.pageSize(),
        sort: this.sortString,
      })
      .subscribe({
        next: (res) => {
          this.tags.set(res.content);
          this.totalElements.set(res.totalElements);
          this.loading.set(false);
        },
        error: () => {
          this.snackBar.open('Failed to load tags', 'Close', { duration: 5000 });
          this.loading.set(false);
        },
      });
  }

  protected onSortChange(sort: Sort) {
    if (sort.direction) {
      this.sortField.set(sort.active);
      this.sortDirection.set(sort.direction as 'asc' | 'desc');
    } else {
      this.sortField.set('name');
      this.sortDirection.set('asc');
    }
    this.loadTags();
  }

  protected onPageChange(event: PageEvent) {
    this.page.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadTags();
  }

  protected openCreateDialog() {
    const ref = this.dialog.open<TagDialog, TagDialogData, TagDto>(TagDialog, {
      width: '400px',
      data: { mode: 'create' },
    });

    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.loadTags();
      }
    });
  }

  protected openEditDialog(tag: TagDto) {
    const ref = this.dialog.open<TagDialog, TagDialogData, TagDto>(TagDialog, {
      width: '400px',
      data: { mode: 'edit', tag },
    });

    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.loadTags();
      }
    });
  }

  protected deleteTag(uuid: string, name: string) {
    this.tagService.delete(uuid).subscribe({
      next: () => {
        this.snackBar.open(`Tag "${name}" deleted`, 'Close', { duration: 3000 });
        this.loadTags();
      },
      error: () => {
        this.snackBar.open('Failed to delete tag', 'Close', { duration: 5000 });
      },
    });
  }
}
