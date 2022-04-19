import { FindManyOptions, ILike, ObjectLiteral, Repository } from 'typeorm';
import { PaginationDto } from './pagination.dto';

export abstract class PaginationService {
  abstract getRepository(): Repository<ObjectLiteral>;

  parseSort(sort: string, order: string) {
    const ret = {};
    if (sort) {
      const sorts = sort.split(',');
      const orders = order.split(',');
      sorts.forEach((sort, index) => {
        ret[sort] = orders[index];
      });
    }
    return ret;
  }

  parseParams(params: any): any {
    const keys = Object.keys(params);
    const ret = {};
    keys.forEach((key: string) => {
      const splitted = key.split('_');
      if (splitted.length === 1) {
        const [field] = splitted;
        ret[field] = params[key];
      } else {
        const [field, operator] = splitted;
        switch (operator) {
          case 'like':
            ret[field] = ILike(`%${params[key]}%`);
            break;
        }
      }
    });
    return ret;
  }

  parseQ(q: string) {
    return {
      name: ILike(`%${q}%`),
    };
  }

  relations() {
    return [];
  }

  async paginate(data: PaginationDto) {
    const { take, skip, sort, order, q, ...params } = data;
    const repository = this.getRepository();
    let where = {};
    if (q) {
      where = { ...where, ...this.parseQ(q) };
    }
    if (params) {
      where = { ...where, ...this.parseParams(params) };
    }
    const options = {
      take: take ? take : 10,
      skip: skip ? skip : 0,
      where,
      relations: this.relations(),
      order: this.parseSort(sort, order),
    } as FindManyOptions<ObjectLiteral>;
    return await repository.findAndCount(options);
  }
}
