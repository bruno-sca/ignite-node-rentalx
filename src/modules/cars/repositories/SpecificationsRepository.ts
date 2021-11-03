import { Specification } from '../model/Specification';
import {
  ICreateSpecificationsDTO,
  ISpecificationsRepository,
} from './ISpecificationsRepository';

class SpecificationsRepository implements ISpecificationsRepository {
  private specifications: Specification[] = [];

  constructor() {
    this.specifications = [];
  }

  create({ description, name }: ICreateSpecificationsDTO): void {
    const specification = new Specification();

    Object.assign(specification, { description, name, created_at: new Date() });

    this.specifications.push(specification);
  }

  findByName(name: string): Specification {
    return this.specifications.find(
      (specification) => specification.name === name
    );
  }
}

export { SpecificationsRepository };
