import { ApiProperty } from '@nestjs/swagger'; // For Swagger documentation
import { IsBoolean, IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class GeneratePasswordDto {
  @ApiProperty({
    description: 'The desired length of the password.',
    minimum: 1,
    maximum: 128, // You can adjust this maximum
    default: 12,
  })
  @IsInt()
  @Min(1)
  @Max(128) // Adjust if necessary
  @IsNotEmpty()
  length: number;

  @ApiProperty({
    description: 'Include uppercase letters (A-Z).',
    default: true,
  })
  @IsBoolean()
  includeUppercase: boolean;

  @ApiProperty({
    description: 'Include lowercase letters (a-z).',
    default: true,
  })
  @IsBoolean()
  includeLowercase: boolean;

  @ApiProperty({ description: 'Include numbers (0-9).', default: true })
  @IsBoolean()
  includeNumbers: boolean;

  @ApiProperty({
    description: 'Include symbols (e.g., !@#$%^&*).',
    default: true,
  })
  @IsBoolean()
  includeSymbols: boolean;
}
