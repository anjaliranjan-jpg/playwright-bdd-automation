import { faker } from '@faker-js/faker';
import type { UserRegistrationData, LoginCredentials, ContactFormData } from './types';

export class DataGenerator {
  static generateUser(): UserRegistrationData {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const timestamp = Date.now();

    return {
      name: `${firstName} ${lastName}`,
      email: `test_${timestamp}_${faker.string.alphanumeric(6)}@testmail.com`,
      password: `Pass${faker.string.alphanumeric(8)}!1`,
      title: faker.helpers.arrayElement(['Mr', 'Mrs']),
      birthDay: faker.number.int({ min: 1, max: 28 }).toString(),
      birthMonth: faker.number.int({ min: 1, max: 12 }).toString(),
      birthYear: faker.number.int({ min: 1970, max: 2000 }).toString(),
      firstName,
      lastName,
      company: faker.company.name(),
      address1: faker.location.streetAddress(),
      address2: faker.location.secondaryAddress(),
      country: 'United States',
      state: faker.location.state(),
      city: faker.location.city(),
      zipcode: faker.location.zipCode('#####'),
      mobileNumber: faker.phone.number('##########'),
    };
  }

  static generateInvalidCredentials(): LoginCredentials {
    return {
      email: `invalid_${Date.now()}@nowhere.com`,
      password: `WrongPass${faker.string.alphanumeric(5)}`,
    };
  }

  static generateContactForm(): ContactFormData {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      subject: faker.lorem.sentence(4),
      message: faker.lorem.paragraph(2),
    };
  }

  static randomSearchKeyword(): string {
    return faker.helpers.arrayElement(['top', 'dress', 'tshirt', 'jeans', 'blue', 'cotton']);
  }

  static emptySearchKeyword(): string {
    return '';
  }
}
