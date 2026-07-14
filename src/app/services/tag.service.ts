import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface TagDto {
  uuid: string;
  slug: string;
  name: string;
}

export interface TagCreateDto {
  slug: string;
  name: string;
}

export interface TagUpdateDto {
  slug: string;
  name: string;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface PageParams {
  page: number;
  size: number;
  sort?: string;
}

@Injectable({ providedIn: 'root' })
export class TagService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/admin/tags`;

  findAll(page: PageParams) {
    let params = new HttpParams()
      .set('page', page.page)
      .set('size', page.size);

    if (page.sort) {
      params = params.set('sort', page.sort);
    }

    return this.http.get<PagedResponse<TagDto>>(this.apiUrl, { params });
  }

  findByUuid(uuid: string) {
    return this.http.get<TagDto>(`${this.apiUrl}/${uuid}`);
  }

  create(data: TagCreateDto) {
    return this.http.post<TagDto>(this.apiUrl, data);
  }

  update(uuid: string, data: TagUpdateDto) {
    return this.http.put<TagDto>(`${this.apiUrl}/${uuid}`, data);
  }

  delete(uuid: string) {
    return this.http.delete<void>(`${this.apiUrl}/${uuid}`);
  }
}
