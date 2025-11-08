import { Request, Response } from 'express';
import { authMiddleware, AuthRequest } from '../src/middleware/auth';
import { generateToken } from '../src/services/jwtService';

describe('Auth Middleware', () => {
  let mockRequest: Partial<AuthRequest>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    nextFunction = jest.fn();
  });

  it('should call next() with valid token', () => {
    const token = generateToken('test-user-id');
    mockRequest.headers = {
      authorization: `Bearer ${token}`,
    };

    authMiddleware(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.userId).toBe('test-user-id');
  });

  it('should return 401 when no token provided', () => {
    authMiddleware(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Unauthorized: No token provided',
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should return 401 when token is invalid', () => {
    mockRequest.headers = {
      authorization: 'Bearer invalid-token',
    };

    authMiddleware(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Unauthorized: Invalid token',
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should return 401 when authorization header is malformed', () => {
    mockRequest.headers = {
      authorization: 'InvalidFormat token',
    };

    authMiddleware(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(nextFunction).not.toHaveBeenCalled();
  });
});
