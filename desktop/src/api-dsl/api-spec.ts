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
    "/users": {
      "patch": {
        "tags": [
          "User"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateUserInfoRequestDto"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateUserInfoRequestDto"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateUserInfoRequestDto"
              }
            }
          },
          "required": true
        },
        "responses": {
          "503": {
            "description": "Service Unavailable"
          },
          "204": {
            "description": "No Content"
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
    "/users/password": {
      "patch": {
        "tags": [
          "User"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdatePasswordRequestDto"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdatePasswordRequestDto"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/UpdatePasswordRequestDto"
              }
            }
          },
          "required": true
        },
        "responses": {
          "503": {
            "description": "Service Unavailable"
          },
          "204": {
            "description": "No Content"
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
    "/users/profile-picture": {
      "patch": {
        "tags": [
          "User"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateProfilePictureRequestDto"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateProfilePictureRequestDto"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateProfilePictureRequestDto"
              }
            }
          },
          "required": true
        },
        "responses": {
          "503": {
            "description": "Service Unavailable"
          },
          "204": {
            "description": "No Content"
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
    "/team-roles": {
      "post": {
        "tags": [
          "TeamRole"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateTeamRoleRequestDto"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateTeamRoleRequestDto"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/CreateTeamRoleRequestDto"
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
                  "$ref": "#/components/schemas/TeamRoleResponseDto"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/TeamRoleResponseDto"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/TeamRoleResponseDto"
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
      },
      "put": {
        "tags": [
          "TeamRole"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateTeamRoleRequestDto"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateTeamRoleRequestDto"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateTeamRoleRequestDto"
              }
            }
          },
          "required": true
        },
        "responses": {
          "503": {
            "description": "Service Unavailable"
          },
          "204": {
            "description": "No Content"
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
    "/team-roles/{teamId}/{roleId}": {
      "delete": {
        "tags": [
          "TeamRole"
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
          },
          {
            "name": "roleId",
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
    "/team-roles/{teamId}": {
      "get": {
        "tags": [
          "TeamRole"
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
          "200": {
            "description": "OK",
            "content": {
              "text/plain": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/TeamRoleResponseDto"
                  }
                }
              },
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/TeamRoleResponseDto"
                  }
                }
              },
              "text/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/TeamRoleResponseDto"
                  }
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
          },
          "403": {
            "description": "Forbidden",
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
    "/team-invitations/accept/{id}": {
      "post": {
        "tags": [
          "TeamInvitation"
        ],
        "parameters": [
          {
            "name": "id",
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
    "/team-invitations/decline/{id}": {
      "post": {
        "tags": [
          "TeamInvitation"
        ],
        "parameters": [
          {
            "name": "id",
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
    "/team-invitations": {
      "get": {
        "tags": [
          "TeamInvitation"
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
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/TeamInvitationResponseDto"
                  }
                }
              },
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/TeamInvitationResponseDto"
                  }
                }
              },
              "text/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/TeamInvitationResponseDto"
                  }
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
    },
    "/teams/{teamId}/default-role": {
      "patch": {
        "tags": [
          "Team"
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
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/SetDefaultRoleRequestDto"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/SetDefaultRoleRequestDto"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/SetDefaultRoleRequestDto"
              }
            }
          },
          "required": true
        },
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
    "/teams/invite": {
      "post": {
        "tags": [
          "Team"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/InviteUserRequestDto"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/InviteUserRequestDto"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/InviteUserRequestDto"
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
    "/prospect-views/{teamId}": {
      "post": {
        "tags": [
          "ProspectView"
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
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/AddProspectViewItemsRequestDto"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/AddProspectViewItemsRequestDto"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/AddProspectViewItemsRequestDto"
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
      },
      "delete": {
        "tags": [
          "ProspectView"
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
          },
          {
            "name": "ids",
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
          "204": {
            "description": "No Content"
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
      },
      "get": {
        "tags": [
          "ProspectView"
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
          "200": {
            "description": "OK",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/ProspectViewResponseDto"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProspectViewResponseDto"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProspectViewResponseDto"
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
    "/prospect-views/{teamId}/replace-all": {
      "put": {
        "tags": [
          "ProspectView"
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
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/AddProspectViewItemsRequestDto"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/AddProspectViewItemsRequestDto"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/AddProspectViewItemsRequestDto"
              }
            }
          },
          "required": true
        },
        "responses": {
          "503": {
            "description": "Service Unavailable"
          },
          "204": {
            "description": "No Content"
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
    "/prospect-layouts/default/{teamId}": {
      "get": {
        "tags": [
          "ProspectLayout"
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
          "200": {
            "description": "OK",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/ProspectLayoutResponseDto"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProspectLayoutResponseDto"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProspectLayoutResponseDto"
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
          },
          "403": {
            "description": "Forbidden",
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
    "/prospect-layouts": {
      "put": {
        "tags": [
          "ProspectLayout"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateProspectLayoutRequestDto"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateProspectLayoutRequestDto"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateProspectLayoutRequestDto"
              }
            }
          },
          "required": true
        },
        "responses": {
          "503": {
            "description": "Service Unavailable"
          },
          "204": {
            "description": "No Content"
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
          },
          "403": {
            "description": "Forbidden",
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
    "/prospects": {
      "post": {
        "tags": [
          "Prospect"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateProspectRequestDto"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateProspectRequestDto"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/CreateProspectRequestDto"
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
      },
      "patch": {
        "tags": [
          "Prospect"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateProspectRequestDto"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateProspectRequestDto"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateProspectRequestDto"
              }
            }
          },
          "required": true
        },
        "responses": {
          "503": {
            "description": "Service Unavailable"
          },
          "204": {
            "description": "No Content"
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
    "/prospects/partial/{teamId}": {
      "get": {
        "tags": [
          "Prospect"
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
          },
          {
            "name": "sortBy",
            "in": "query",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "include",
            "in": "query",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "cursor",
            "in": "query",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "archived",
            "in": "query",
            "schema": {
              "type": "boolean"
            }
          }
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
                  "$ref": "#/components/schemas/PaginatedResponseDtoOfPartialProspectResponseDto"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PaginatedResponseDtoOfPartialProspectResponseDto"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/PaginatedResponseDtoOfPartialProspectResponseDto"
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
    "/prospects/{teamId}/{prospectId}": {
      "get": {
        "tags": [
          "Prospect"
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
          },
          {
            "name": "prospectId",
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
          "200": {
            "description": "OK",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/ProspectResponseDto"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProspectResponseDto"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProspectResponseDto"
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
    "/prospects/{teamId}/{prospectId}/archive": {
      "patch": {
        "tags": [
          "Prospect"
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
          },
          {
            "name": "prospectId",
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
    "/prospects/{teamId}/{prospectId}/unarchive": {
      "patch": {
        "tags": [
          "Prospect"
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
          },
          {
            "name": "prospectId",
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
      "AddProspectViewItemsRequestDto": {
        "type": "object",
        "properties": {
          "items": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/CreateProspectViewItemRequestDto"
            }
          }
        }
      },
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
      "CreateProspectFieldRequestDto": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "type": {
            "$ref": "#/components/schemas/ProspectDataType"
          },
          "value": {
            "type": "string",
            "nullable": true
          }
        }
      },
      "CreateProspectRequestDto": {
        "type": "object",
        "properties": {
          "teamId": {
            "type": "string",
            "format": "uuid"
          },
          "fields": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/CreateProspectFieldRequestDto"
            }
          }
        }
      },
      "CreateProspectViewItemRequestDto": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "type": {
            "$ref": "#/components/schemas/ProspectDataType"
          },
          "teamId": {
            "type": "string",
            "format": "uuid"
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
      "CreateTeamRoleRequestDto": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "teamId": {
            "type": "string",
            "format": "uuid"
          },
          "permissions": {
            "type": "integer",
            "format": "int32"
          }
        }
      },
      "InviteUserRequestDto": {
        "type": "object",
        "properties": {
          "email": {
            "type": "string"
          },
          "teamId": {
            "type": "string",
            "format": "uuid"
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
      "PaginatedResponseDtoOfPartialProspectResponseDto": {
        "type": "object",
        "properties": {
          "items": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/PartialProspectResponseDto"
            }
          },
          "hasMore": {
            "type": "boolean"
          },
          "cursorToken": {
            "type": "string",
            "nullable": true
          }
        }
      },
      "PartialProspectResponseDto": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid"
          },
          "teamId": {
            "type": "string",
            "format": "uuid"
          },
          "archived": {
            "type": "boolean"
          },
          "fields": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/ProspectFieldResponseDto"
            }
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
      "ProspectDataType": {
        "enum": [
          "text",
          "rich_text",
          "dropdown",
          "image"
        ]
      },
      "ProspectFieldResponseDto": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "type": {
            "$ref": "#/components/schemas/ProspectDataType"
          },
          "value": {
            "type": "string",
            "nullable": true
          }
        }
      },
      "ProspectLayoutResponseDto": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid"
          },
          "jsonStructure": {
            "type": "string"
          }
        }
      },
      "ProspectResponseDto": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid"
          },
          "teamId": {
            "type": "string",
            "format": "uuid"
          },
          "layoutId": {
            "type": "string",
            "format": "uuid",
            "nullable": true
          },
          "fields": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/ProspectFieldResponseDto"
            }
          },
          "archived": {
            "type": "boolean"
          }
        }
      },
      "ProspectViewItemResponseDto": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "type": {
            "$ref": "#/components/schemas/ProspectDataType"
          }
        }
      },
      "ProspectViewResponseDto": {
        "type": "object",
        "properties": {
          "items": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/ProspectViewItemResponseDto"
            }
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
      "SetDefaultRoleRequestDto": {
        "type": "object",
        "properties": {
          "roleId": {
            "type": "string",
            "format": "uuid"
          }
        }
      },
      "TeamInvitationResponseDto": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid"
          },
          "expiresAt": {
            "type": "string",
            "format": "date-time"
          },
          "teamName": {
            "type": "string"
          },
          "teamLogo": {
            "type": "string",
            "nullable": true
          },
          "invitedBy": {
            "type": "string"
          },
          "status": {
            "$ref": "#/components/schemas/TeamInvitationStatus"
          }
        }
      },
      "TeamInvitationStatus": {
        "enum": [
          "pending",
          "accepted",
          "declined",
          "revoked"
        ]
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
          },
          "defaultRoleId": {
            "type": "string",
            "format": "uuid",
            "nullable": true
          }
        }
      },
      "TeamRoleResponseDto": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid"
          },
          "name": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "teamId": {
            "type": "string",
            "format": "uuid"
          },
          "permissions": {
            "type": "integer",
            "format": "int32"
          },
          "userCount": {
            "type": "integer",
            "format": "int32"
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
      "UpdatePasswordRequestDto": {
        "type": "object",
        "properties": {
          "oldPassword": {
            "minLength": 8,
            "type": "string"
          },
          "newPassword": {
            "minLength": 8,
            "type": "string"
          }
        }
      },
      "UpdateProfilePictureRequestDto": {
        "type": "object",
        "properties": {
          "profilePicture": {
            "type": "string",
            "nullable": true
          }
        }
      },
      "UpdateProspectLayoutRequestDto": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid"
          },
          "teamId": {
            "type": "string",
            "format": "uuid"
          },
          "newJsonStructure": {
            "type": "string"
          }
        }
      },
      "UpdateProspectRequestDto": {
        "type": "object",
        "properties": {
          "prospectId": {
            "type": "string",
            "format": "uuid"
          },
          "teamId": {
            "type": "string",
            "format": "uuid"
          },
          "fields": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/CreateProspectFieldRequestDto"
            }
          }
        }
      },
      "UpdateTeamRoleRequestDto": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid"
          },
          "name": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "teamId": {
            "type": "string",
            "format": "uuid"
          },
          "permissions": {
            "type": "integer",
            "format": "int32"
          }
        }
      },
      "UpdateUserInfoRequestDto": {
        "required": [
          "username",
          "firstName",
          "lastName"
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
      "name": "TeamRole"
    },
    {
      "name": "TeamInvitation"
    },
    {
      "name": "Team"
    },
    {
      "name": "ProspectView"
    },
    {
      "name": "ProspectLayout"
    },
    {
      "name": "Prospect"
    }
  ]
}
