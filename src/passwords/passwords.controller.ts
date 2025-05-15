import { Body, Controller, HttpCode, HttpStatus, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { GeneratePasswordDto } from './dto/generate-password.dto';
import { PasswordsService } from './passwords.service';

@ApiTags('Passwords') // Tag for grouping endpoints in Swagger
@Controller('passwords')
export class PasswordsController {
  constructor(private readonly passwordsService: PasswordsService) {}

  @Post('generate')
  @HttpCode(HttpStatus.OK) // Default for POST is 201, changing to 200
  @ApiOperation({ summary: 'Generate a secure random password' })
  @ApiBody({ type: GeneratePasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password generated successfully.',
    schema: { type: 'object', properties: { password: { type: 'string' } } },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid parameters.',
  })
  // Enable automatic validation of the request body using the DTO
  @UsePipes(
    new ValidationPipe({
      whitelist: true, // Strip any properties not defined in the DTO
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
      transform: true, // Transform payload to DTO instance
    }),
  )
  generatePassword(@Body() generatePasswordDto: GeneratePasswordDto): {
    password: string;
  } {
    const password =
      this.passwordsService.generatePassword(generatePasswordDto);
    return { password };
  }
}