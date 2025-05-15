import { Injectable, BadRequestException } from '@nestjs/common';

export interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

@Injectable()
export class PasswordsService {
  private readonly LOWERCASE_CHARACTERS = 'abcdefghijklmnopqrstuvwxyz';
  private readonly UPPERCASE_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  private readonly NUMBER_CHARACTERS = '0123456789';
  private readonly SYMBOL_CHARACTERS = '!@#$%^&*()_+-=[]{};:,./<>?';

  generatePassword(options: PasswordOptions): string {
    const {
      length,
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSymbols,
    } = options;

    if (length <= 0) {
      throw new BadRequestException('Password length must be greater than 0.');
    }

    if (
      !includeUppercase &&
      !includeLowercase &&
      !includeNumbers &&
      !includeSymbols
    ) {
      throw new BadRequestException(
        'At least one character type must be selected.',
      );
    }

    let availableCharacters = '';
    let resultPassword = '';

    // Build the pool of available characters
    if (includeLowercase) {
      availableCharacters += this.LOWERCASE_CHARACTERS;
      // Ensure at least one character of this type if length allows
      if (length > resultPassword.length) {
        resultPassword += this.getRandomChar(this.LOWERCASE_CHARACTERS);
      }
    }
    if (includeUppercase) {
      availableCharacters += this.UPPERCASE_CHARACTERS;
      if (length > resultPassword.length) {
        resultPassword += this.getRandomChar(this.UPPERCASE_CHARACTERS);
      }
    }
    if (includeNumbers) {
      availableCharacters += this.NUMBER_CHARACTERS;
      if (length > resultPassword.length) {
        resultPassword += this.getRandomChar(this.NUMBER_CHARACTERS);
      }
    }
    if (includeSymbols) {
      availableCharacters += this.SYMBOL_CHARACTERS;
      if (length > resultPassword.length) {
        resultPassword += this.getRandomChar(this.SYMBOL_CHARACTERS);
      }
    }

    // This check is mostly a safeguard. If the initial validation passed and at least one character type
    // was selected, and the logic for `resultPassword += ...` (to ensure one of each type) ran,
    // then `availableCharacters` should not be empty if any option was true.
    if (availableCharacters.length === 0) {
      // This should not happen if initial validation passed and at least one character type is included.
      // However, as a fallback:
      if (includeLowercase) availableCharacters += this.LOWERCASE_CHARACTERS;
      else if (includeUppercase)
        availableCharacters += this.UPPERCASE_CHARACTERS;
      else if (includeNumbers) availableCharacters += this.NUMBER_CHARACTERS;
      else if (includeSymbols) availableCharacters += this.SYMBOL_CHARACTERS;
    }

    // Fill the rest of the password
    const remainingLength = length - resultPassword.length;
    for (let i = 0; i < remainingLength; i++) {
      resultPassword += this.getRandomChar(availableCharacters);
    }

    // Shuffle the resulting password to avoid predictable patterns
    // (e.g., the first characters always being lowercase, uppercase, number, symbol)
    return this.shuffleString(resultPassword);
  }

  private getRandomChar(characterSet: string): string {
    const randomIndex = Math.floor(Math.random() * characterSet.length);
    return characterSet[randomIndex];
  }

  private shuffleString(str: string): string {
    const arr = str.split('');
    // Fisher-Yates shuffle algorithm
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
    }
    return arr.join('');
  }
}