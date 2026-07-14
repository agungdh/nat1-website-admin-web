import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TagService, TagDto } from '../../../services/tag.service';

export interface TagDialogData {
  mode: 'create' | 'edit';
  tag?: TagDto;
}

@Component({
  selector: 'app-tag-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './tag-dialog.html',
  styleUrl: './tag-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagDialog {
  private readonly fb = inject(FormBuilder);
  private readonly tagService = inject(TagService);
  private readonly dialogRef = inject(MatDialogRef<TagDialog>);
  protected readonly data = inject<TagDialogData>(MAT_DIALOG_DATA);

  protected readonly loading = signal(false);
  protected readonly error = signal('');

  protected readonly form = this.fb.nonNullable.group({
    slug: [this.data.tag?.slug ?? '', Validators.required],
    name: [this.data.tag?.name ?? '', Validators.required],
  });

  protected get isEdit(): boolean {
    return this.data.mode === 'edit';
  }

  protected onSubmit() {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.error.set('');

    const formData = this.form.getRawValue();

    const request =
      this.data.mode === 'create'
        ? this.tagService.create(formData)
        : this.tagService.update(this.data.tag!.uuid, formData);

    request.subscribe({
      next: (result) => {
        this.dialogRef.close(result);
      },
      error: () => {
        this.error.set(
          this.data.mode === 'create'
            ? 'Failed to create tag'
            : 'Failed to update tag'
        );
        this.loading.set(false);
      },
    });
  }

  protected onCancel() {
    this.dialogRef.close();
  }
}
