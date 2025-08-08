export type ApiSpec={
  "openapi": "3.0.1",
  "info": {
    "title": "Quark | v1",
    "version": "1.0.0"
  },
  "paths": {
    "/": {
      "head": {
        "tags": [
          "Quark"
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/users/check-auth": {
      "get": {
        "tags": [
          "User"
        ],
        "responses": {
          "503": {
            "description": "Service Unavailable"
          },
          "200": {
            "description": "OK"
          },
          "401": {
            "description": "Unauthorized",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              }
            }
          }
        }
      }
    },
    "/users/register": {
      "post": {
        "tags": [
          "User"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/RegisterRequestDto"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/RegisterRequestDto"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/RegisterRequestDto"
              }
            }
          },
          "required": true
        },
        "responses": {
          "503": {
            "description": "Service Unavailable"
          },
          "201": {
            "description": "Created"
          },
          "400": {
            "description": "Bad Request",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              }
            }
          }
        }
      }
    },
    "/users/login": {
      "post": {
        "tags": [
          "User"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/LoginRequestDto"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/LoginRequestDto"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/LoginRequestDto"
              }
            }
          },
          "required": true
        },
        "responses": {
          "503": {
            "description": "Service Unavailable"
          },
          "200": {
            "description": "OK",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/TokensResponseDto"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/TokensResponseDto"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/TokensResponseDto"
                }
              }
            }
          },
          "400": {
            "description": "Bad Request",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              }
            }
          }
        }
      }
    },
    "/users/refresh": {
      "post": {
        "tags": [
          "User"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/RefreshTokensRequestDto"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/RefreshTokensRequestDto"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/RefreshTokensRequestDto"
              }
            }
          },
          "required": true
        },
        "responses": {
          "503": {
            "description": "Service Unavailable"
          },
          "201": {
            "description": "Created",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/TokensResponseDto"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/TokensResponseDto"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/TokensResponseDto"
                }
              }
            }
          },
          "400": {
            "description": "Bad Request",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              }
            }
          }
        }
      }
    },
    "/users/logout/cookie": {
      "post": {
        "tags": [
          "User"
        ],
        "responses": {
          "503": {
            "description": "Service Unavailable"
          },
          "200": {
            "description": "OK"
          },
          "401": {
            "description": "Unauthorized",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              }
            }
          }
        }
      }
    },
    "/users/logout/token": {
      "post": {
        "tags": [
          "User"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/LogoutRequestDto"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/LogoutRequestDto"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/LogoutRequestDto"
              }
            }
          },
          "required": true
        },
        "responses": {
          "503": {
            "description": "Service Unavailable"
          },
          "200": {
            "description": "OK"
          },
          "401": {
            "description": "Unauthorized",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              }
            }
          }
        }
      }
    },
    "/users/set-default-team/{teamId}": {
      "patch": {
        "tags": [
          "User"
        ],
        "parameters": [
          {
            "name": "teamId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "503": {
            "description": "Service Unavailable"
          },
          "204": {
            "description": "No Content"
          },
          "404": {
            "description": "Not Found",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              }
            }
          }
        }
      }
    },
    "/users/confirm-email": {
      "post": {
        "tags": [
          "User"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ConfirmEmailRequestDto"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/ConfirmEmailRequestDto"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/ConfirmEmailRequestDto"
              }
            }
          },
          "required": true
        },
        "responses": {
          "503": {
            "description": "Service Unavailable"
          },
          "200": {
            "description": "OK"
          },
          "400": {
            "description": "Bad Request",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              }
            }
          }
        }
      }
    },
    "/users/resend-confirmation-email": {
      "post": {
        "tags": [
          "User"
        ],
        "parameters": [
          {
            "name": "email",
            "in": "query",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "503": {
            "description": "Service Unavailable"
          },
          "200": {
            "description": "OK"
          },
          "400": {
            "description": "Bad Request",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              }
            }
          }
        }
      }
    },
    "/users/leave-team/{teamId}": {
      "delete": {
        "tags": [
          "User"
        ],
        "parameters": [
          {
            "name": "teamId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "503": {
            "description": "Service Unavailable"
          },
          "204": {
            "description": "No Content"
          },
          "404": {
            "description": "Not Found",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              }
            }
          }
        }
      }
    },
    "/users/me": {
      "get": {
        "tags": [
          "User"
        ],
        "responses": {
          "503": {
            "description": "Service Unavailable"
          },
          "200": {
            "description": "OK",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/UserResponseDto"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UserResponseDto"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/UserResponseDto"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              }
            }
          }
        }
      }
    },
    "/users/send-reset-password-email": {
      "post": {
        "tags": [
          "User"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/SendResetPasswordEmailRequestDto"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/SendResetPasswordEmailRequestDto"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/SendResetPasswordEmailRequestDto"
              }
            }
          },
          "required": true
        },
        "responses": {
          "503": {
            "description": "Service Unavailable"
          },
          "200": {
            "description": "OK"
          },
          "400": {
            "description": "Bad Request",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              }
            }
          },
          "404": {
            "description": "Not Found",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              }
            }
          }
        }
      }
    },
    "/users/reset-password": {
      "patch": {
        "tags": [
          "User"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ResetPasswordRequestDto"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/ResetPasswordRequestDto"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/ResetPasswordRequestDto"
              }
            }
          },
          "required": true
        },
        "responses": {
          "503": {
            "description": "Service Unavailable"
          },
          "200": {
            "description": "OK"
          },
          "400": {
            "description": "Bad Request",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              }
            }
          },
          "404": {
            "description": "Not Found",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              }
            }
          }
        }
      }
    },
    "/teams": {
      "post": {
        "tags": [
          "Team"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateTeamRequestDto"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateTeamRequestDto"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/CreateTeamRequestDto"
              }
            }
          },
          "required": true
        },
        "responses": {
          "503": {
            "description": "Service Unavailable"
          },
          "201": {
            "description": "Created",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/TeamResponseDto"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/TeamResponseDto"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/TeamResponseDto"
                }
              }
            }
          },
          "400": {
            "description": "Bad Request",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProblemDetails"
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "ConfirmEmailRequestDto": {
        "required": [
          "email",
          "token"
        ],
        "type": "object",
        "properties": {
          "email": {
            "type": "string"
          },
          "token": {
            "type": "string"
          }
        }
      },
      "CreateTeamRequestDto": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "logo": {
            "type": "string",
            "nullable": true
          },
          "description": {
            "type": "string",
            "nullable": true
          }
        }
      },
      "LoginRequestDto": {
        "required": [
          "usernameOrEmail",
          "password"
        ],
        "type": "object",
        "properties": {
          "usernameOrEmail": {
            "minLength": 3,
            "type": "string"
          },
          "password": {
            "minLength": 8,
            "type": "string"
          },
          "useCookies": {
            "type": "boolean"
          }
        }
      },
      "LogoutRequestDto": {
        "type": "object",
        "properties": {
          "refreshToken": {
            "type": "string",
            "nullable": true
          }
        }
      },
      "ProblemDetails": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "nullable": true
          },
          "title": {
            "type": "string",
            "nullable": true
          },
          "status": {
            "type": "integer",
            "format": "int32",
            "nullable": true
          },
          "detail": {
            "type": "string",
            "nullable": true
          },
          "instance": {
            "type": "string",
            "nullable": true
          }
        }
      },
      "RefreshTokensRequestDto": {
        "type": "object",
        "properties": {
          "jwt": {
            "type": "string"
          },
          "refreshToken": {
            "type": "string"
          }
        }
      },
      "RegisterRequestDto": {
        "required": [
          "username",
          "firstName",
          "lastName",
          "email",
          "password"
        ],
        "type": "object",
        "properties": {
          "username": {
            "minLength": 3,
            "type": "string"
          },
          "firstName": {
            "minLength": 1,
            "type": "string"
          },
          "lastName": {
            "minLength": 1,
            "type": "string"
          },
          "email": {
            "type": "string"
          },
          "password": {
            "minLength": 8,
            "type": "string"
          }
        }
      },
      "ResetPasswordRequestDto": {
        "required": [
          "email",
          "token",
          "newPassword"
        ],
        "type": "object",
        "properties": {
          "email": {
            "type": "string"
          },
          "token": {
            "type": "string"
          },
          "newPassword": {
            "minLength": 8,
            "type": "string"
          }
        }
      },
      "SendResetPasswordEmailRequestDto": {
        "required": [
          "email"
        ],
        "type": "object",
        "properties": {
          "email": {
            "type": "string"
          }
        }
      },
      "TeamResponseDto": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid"
          },
          "name": {
            "type": "string"
          },
          "logo": {
            "type": "string",
            "nullable": true
          },
          "description": {
            "type": "string",
            "nullable": true
          },
          "permissions": {
            "type": "integer",
            "format": "int32"
          },
          "roleName": {
            "type": "string"
          }
        }
      },
      "TokensResponseDto": {
        "type": "object",
        "properties": {
          "jwt": {
            "type": "string"
          },
          "refreshToken": {
            "type": "string"
          }
        }
      },
      "UserResponseDto": {
        "type": "object",
        "properties": {
          "username": {
            "type": "string"
          },
          "email": {
            "type": "string"
          },
          "firstName": {
            "type": "string"
          },
          "lastName": {
            "type": "string"
          },
          "profilePicture": {
            "type": "string",
            "nullable": true
          },
          "isEmailVerified": {
            "type": "boolean"
          },
          "defaultTeamId": {
            "type": "string",
            "format": "uuid",
            "nullable": true
          },
          "teams": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/TeamResponseDto"
            }
          }
        }
      }
    }
  },
  "tags": [
    {
      "name": "Quark"
    },
    {
      "name": "User"
    },
    {
      "name": "Team"
    }
  ]
}
