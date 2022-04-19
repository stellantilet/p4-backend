export class PaginationDto {
  take?: number;
  skip?: number;
  sort?: string;
  order?: string;
  q: string;
}
