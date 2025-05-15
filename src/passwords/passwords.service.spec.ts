import { Test, TestingModule } from '@nestjs/testing';
import { PasswordsService, PasswordOptions } from './passwords.service';
import { BadRequestException } from '@nestjs/common';

describe('PasswordsService', () => {
  let service: PasswordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordsService],
    }).compile();

    service = module.get<PasswordsService>(PasswordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generatePassword', () => {
    it('should generate a password of the specified length', () => {
      const options: PasswordOptions = {
        length: 10,
        includeLowercase: true,
        includeUppercase: false,
        includeNumbers: false,
        includeSymbols: false,
      };
      const password = service.generatePassword(options);
      expect(password).toHaveLength(10);
    });

    it('should include lowercase letters if specified', () => {
      const options: PasswordOptions = {
        length: 10,
        includeLowercase: true,
        includeUppercase: false,
        includeNumbers: false,
        includeSymbols: false,
      };
      const password = service.generatePassword(options);
      expect(password).toMatch(/[a-z]/);
    });

    it('should include uppercase letters if specified', () => {
      const options: PasswordOptions = {
        length: 10,
        includeLowercase: false,
        includeUppercase: true,
        includeNumbers: false,
        includeSymbols: false,
      };
      const password = service.generatePassword(options);
      expect(password).toMatch(/[A-Z]/);
    });

    it('should include numbers if specified', () => {
      const options: PasswordOptions = {
        length: 10,
        includeLowercase: false,
        includeUppercase: false,
        includeNumbers: true,
        includeSymbols: false,
      };
      const password = service.generatePassword(options);
      expect(password).toMatch(/[0-9]/);
    });

    it('should include symbols if specified', () => {
      const options: PasswordOptions = {
        length: 10,
        includeLowercase: false,
        includeUppercase: false,
        includeNumbers: false,
        includeSymbols: true,
      };
      const password = service.generatePassword(options);
      // Adjust regex according to your symbols
      expect(password).toMatch(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/);
    });

    it('should generate a password with all character types if specified', () => {
      const options: PasswordOptions = {
        length: 12,
        includeLowercase: true,
        includeUppercase: true,
        includeNumbers: true,
        includeSymbols: true,
      };
      const password = service.generatePassword(options);
      expect(password).toHaveLength(12);
      expect(password).toMatch(/[a-z]/);
      expect(password).toMatch(/[A-Z]/);
      expect(password).toMatch(/[0-9]/);
      expect(password).toMatch(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/);
    });

    it('should throw BadRequestException if length is 0 or less', () => {
      const options: PasswordOptions = {
        length: 0,
        includeLowercase: true,
        includeUppercase: false,
        includeNumbers: false,
        includeSymbols: false,
      };
      expect(() => service.generatePassword(options)).toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if no character types are selected', () => {
      const options: PasswordOptions = {
        length: 10,
        includeLowercase: false,
        includeUppercase: false,
        includeNumbers: false,
        includeSymbols: false,
      };
      expect(() => service.generatePassword(options)).toThrow(
        BadRequestException,
      );
      expect(() => service.generatePassword(options)).toThrow(
        'At least one character type must be selected.',
      );
    });

    it('should ensure each selected character type is present (if length permits)', () => {
      const options: PasswordOptions = {
        length: 4, // Just enough for one of each
        includeLowercase: true,
        includeUppercase: true,
        includeNumbers: true,
        includeSymbols: true,
      };
      const password = service.generatePassword(options);
      expect(password).toMatch(/[a-z]/);
      expect(password).toMatch(/[A-Z]/);
      expect(password).toMatch(/[0-9]/);
      expect(password).toMatch(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/);
    });

    it('should handle edge case where length is less than number of selected types', () => {
      const options: PasswordOptions = {
        length: 2, // Length is less than the 4 types selected
        includeLowercase: true,
        includeUppercase: true,
        includeNumbers: true,
        includeSymbols: true,
      };
      const password = service.generatePassword(options);
      expect(password).toHaveLength(2);
      // Check that at least two of the character types are present,
      // and the characters come from the allowed pool.
      let typesFound = 0;
      if (/[a-z]/.test(password)) typesFound++;
      if (/[A-Z]/.test(password)) typesFound++;
      if (/[0-9]/.test(password)) typesFound++;
      if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) typesFound++;

      expect(typesFound).toBeGreaterThanOrEqual(1); // At least one type, ideally two for length 2
      expect(typesFound).toBeLessThanOrEqual(2); // No more types than the length

      // Ensure all characters in the password belong to the combined pool of selected types
      // Accessing private properties for test is generally discouraged, but for this specific check:
      const serviceInstance = service as any;
      const allowedChars =
        serviceInstance.LOWERCASE_CHARACTERS +
        serviceInstance.UPPERCASE_CHARACTERS +
        serviceInstance.NUMBER_CHARACTERS +
        serviceInstance.SYMBOL_CHARACTERS;
      for (const char of password) {
        expect(allowedChars).toContain(char);
      }
    });
  });
});
