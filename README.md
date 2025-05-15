# Secure Password Generator API 🚀

Your reliable and easy-to-use solution for generating strong, customizable random passwords on demand for your applications!

## Table of Contents

- [Overview](#overview)
- [Why Use This API?](#why-use-this-api)
- [Getting Started](#getting-started)
  - [Subscribing on RapidAPI](#subscribing-on-rapidapi)
  - [Authentication](#authentication)
- [Base URL](#base-url)
- [Endpoints](#endpoints)
  - [Generate Secure Password](#generate-secure-password)
    - [Request Headers](#request-headers)
    - [Request Body Parameters](#request-body-parameters)
    - [Example Request](#example-request)
    - [Success Response](#success-response)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Support & Feedback](#support--feedback)

## Overview

The **Secure Password Generator API** provides a straightforward and developer-friendly way to create cryptographically secure random passwords tailored to your specific security requirements. It's designed to be a fundamental utility for developers looking to enhance the security of their applications without implementing complex password generation logic themselves.

## Why Use This API?

- **Highly Customizable:** Define the exact length of your generated passwords.
- **Granular Character Set Control:** Precisely choose whether to include or exclude:
  - Uppercase letters (A-Z)
  - Lowercase letters (a-z)
  - Numbers (0-9)
  - Common symbols (e.g., `!@#$%^&*()_+-=[]{};:,./&lt;&gt;?`)
- **Simple Integration:** A single, intuitive `POST` endpoint with clear JSON parameters makes integration into any application (web, mobile, backend scripts) a breeze.
- **Secure by Design:** Utilizes secure random generation methods to ensure the unpredictability and strength of the passwords.
- **Lightweight & Fast:** Optimized for efficiency, providing quick responses for your applications.
- **Ideal For:**
  - New user registration forms.
  - Password reset functionalities.
  - Automated generation of secure tokens or initial credentials.
  - Enhancing security in web applications, mobile apps, and backend services.

## Getting Started

To begin using the Secure Password Generator API, follow these simple steps:

### Subscribing on RapidAPI

1.  Navigate to the [Secure Password Generator API page on RapidAPI Hub](https://rapidapi.com/YOUR_RAPIDAPI_USERNAME/api/secure-password-generator-api). _(You'll need to replace `YOUR_RAPIDAPI_USERNAME/api/secure-password-generator-api` with the actual link once your API is listed)._
2.  Click on the "Subscribe to Test" button (or choose a plan if you offer different tiers).
3.  You will then have access to your API Keys.

### Authentication

Once subscribed, RapidAPI will provide you with an API Key. You must include this key in the header of every request. RapidAPI uses the following headers for authentication and routing:

- `X-RapidAPI-Key`: Your unique API key obtained from RapidAPI.
- `X-RapidAPI-Host`: The specific host for this API on RapidAPI. This will be `secure-password-generator-api.p.rapidapi.com` (or a similar value provided by RapidAPI when you list the API).

For `POST` requests with a JSON body, you also need to set the `Content-Type` header:

- `Content-Type`: `application/json`

## Base URL

All API requests should be made to the following base URL (this will be assigned by RapidAPI once your API is live):

**`https://secure-password-generator-api.p.rapidapi.com`**

_(Note: Verify and use the exact base URL provided by RapidAPI after you list your API)._

## Endpoints

Currently, the API offers one primary endpoint for generating passwords.

### Generate Secure Password

This endpoint creates and returns a new, secure random password based on the criteria specified in the request body.

- **Method:** `POST`
- **Path:** `/passwords/generate`
- **Full URL (Example):** `https://secure-password-generator-api.p.rapidapi.com/passwords/generate`

#### Request Headers

| Header            | Value                                              | Required |
| :---------------- | :------------------------------------------------- | :------- |
| `X-RapidAPI-Key`  | `YOUR_RAPIDAPI_KEY` (Replace with your actual key) | Yes      |
| `X-RapidAPI-Host` | `secure-password-generator-api.p.rapidapi.com`     | Yes      |
| `Content-Type`    | `application/json`                                 | Yes      |

#### Request Body Parameters

The request body must be a JSON object containing the following parameters:

| Parameter          | Type    | Required | Default Value (if applicable) | Description                                                                                                   | Example Value |
| :----------------- | :------ | :------- | :---------------------------- | :------------------------------------------------------------------------------------------------------------ | :------------ |
| `length`           | Integer | Yes      | `12` (as per API DTO)         | The desired length for the password. Typically between 8 and 128. (Min: 1, Max: 128, as defined by the API).  | `16`          |
| `includeUppercase` | Boolean | Yes      | `true` (as per API DTO)       | Set to `true` to include uppercase letters (A-Z) in the generated password.                                   | `true`        |
| `includeLowercase` | Boolean | Yes      | `true` (as per API DTO)       | Set to `true` to include lowercase letters (a-z) in the generated password.                                   | `true`        |
| `includeNumbers`   | Boolean | Yes      | `true` (as per API DTO)       | Set to `true` to include numerical digits (0-9) in the generated password.                                    | `true`        |
| `includeSymbols`   | Boolean | Yes      | `true` (as per API DTO)       | Set to `true` to include common symbols (e.g., `!@#$%^&*()_+-=[]{};:,./&lt;&gt;?`) in the generated password. | `false`       |

**Important Constraint:** At least one of the character type parameters (`includeUppercase`, `includeLowercase`, `includeNumbers`, `includeSymbols`) _must_ be set to `true` for the API to generate a password.

#### Example Request

**cURL:**

```bash
curl --request POST \
  --url https://secure-password-generator-api.p.rapidapi.com/passwords/generate \
  --header 'X-RapidAPI-Host: secure-password-generator-api.p.rapidapi.com' \
  --header 'X-RapidAPI-Key: YOUR_ACTUAL_RAPIDAPI_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "length": 20,
    "includeUppercase": true,
    "includeLowercase": true,
    "includeNumbers": true,
    "includeSymbols": true
  }'
```

## Node.js (using axios):

```javascript
const axios = require('axios');

const options = {
  method: 'POST',
  url: 'https://secure-password-generator-api.p.rapidapi.com/passwords/generate',
  headers: {
    'X-RapidAPI-Key': 'YOUR_ACTUAL_RAPIDAPI_KEY',
    'X-RapidAPI-Host': 'secure-password-generator-api.p.rapidapi.com',
    'Content-Type': 'application/json',
  },
  data: {
    length: 20,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
  },
};

async function generatePassword() {
  try {
    const response = await axios.request(options);
    console.log('Generated Password:', response.data.password);
  } catch (error) {
    console.error(
      'Error:',
      error.response ? error.response.data : error.message,
    );
  }
}

generatePassword();
```

#### Success Response

- Status Code: 200 OK
- Content-Type: application/json
- Body: A JSON object containing the generated password.

```JSON
{
  "password": "aV€ryStr0ngP@sswOrdExampl€"
}
```

_(The actual password string will be randomly generated based on your input criteria.)_

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of a request
| Status Code | Meaning | Common Reason(s) | Example Response Body (from API) |
| :---------- | :---------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `200` | OK | The request was successful, and a password was generated. | (See Success Response above) |
| `400` | Bad Request | The request was malformed, or the input parameters were invalid (e.g., `length` out of bounds, no character types selected, invalid JSON format). | `{"statusCode": 400, "message": ["length must not be less than 1", "At least one character type must be selected."], "error": "Bad Request"}` |
| `401` | Unauthorized | Your `X-RapidAPI-Key` is missing, invalid, or has been revoked. | _(This error is typically generated and formatted by the RapidAPI gateway.)_ |
| `403` | Forbidden | You are not subscribed to this API, or your current subscription plan does not permit access. | _(This error is typically generated and formatted by the RapidAPI gateway.)_ |
| `429` | Too Many Requests | You have exceeded the rate limit associated with your current subscription plan on RapidAPI. | _(This error is typically generated and formatted by the RapidAPI gateway.)_ |
| `500` | Internal Server Error | An unexpected error occurred on the server side while processing your request. Please try again later. | `{"statusCode": 500, "message": "Internal server error"}` (or a similar generic error message from the API) |

## Additional Information

- **Simplicity and Focus:** This API is intentionally designed to be simple and efficient, focusing solely on the core task of robust password generation. It aims to do one thing and do it well, providing a reliable utility for developers.
- **Security Best Practices:** While the API generates strong random passwords, it is crucial that your application handles these passwords securely. Always ensure that passwords (and all sensitive data) are transmitted over HTTPS and stored using appropriate hashing and security measures (e.g., bcrypt, Argon2) in your systems.
- **Stateless Operation:** The Secure Password Generator API is stateless. It does not store any of the passwords it generates, nor does it retain any user-specific data related to requests. Each API call is processed independently.
- **Character Encoding:** API responses, including the generated passwords, are UTF-8 encoded. This is particularly relevant if you choose to include a wide range of symbols.
- **Intended Use:** This API is designed for server-to-server communication or for use in backend processes where secure password generation is required for application functionalities.

## Rate Limiting

API access is subject to rate limits based on your chosen subscription plan on RapidAPI. Please refer to the "Pricing" tab on the API's page in the RapidAPI Hub for details on available plans and their respective request quotas and rate limits.

If you exceed your plan's rate limit, you will receive a 429 Too Many Requests HTTP status code.

## Support & Feedback

We value your experience! For any issues, questions, feature requests, or feedback regarding the Secure Password Generator API, please use the "Discussions" tab on the API's page in the RapidAPI Hub.
