import { describe, test, jest, expect, beforeEach } from '@jest/globals';
import { Request, Response, NextFunction } from 'express';

process.env.JWT_SECRET = 'DQk8GINmCCuUUtHYFY6eMztjCJAJIXoaK3cgCPllhT0=';

import authorizationMiddleware from '../../../../src/middlewares/authorizationMiddleware';

let req = {} as any as Request;
let res = {} as any as Response;
let next: NextFunction = () => {};

describe('Authorization Middleware - JWT', () => {
  beforeEach(() => {
    req = {
      headers: {
        authorization: '',
      },
    } as any as Request;

    res = {
      status: jest.fn(() => {
        return res;
      }),
      json: jest.fn((value) => value),
    } as any as Response;

    next = jest.fn() as NextFunction;
  });

  test('Reject when any token is sent', () => {
    // eslint-disable-next-line max-len
    req.headers.authorization = '';

    authorizationMiddleware(req, res, next);

    expect(res.status).toBeCalled();
    expect(res.status).toReturn();
    expect(res.json).toBeCalled();
    expect(res.json).toReturn();
    expect(res.json).toReturnWith({ error: 'No token provided.' });
  });

  test('Reject token when something is sent instead Bearer', () => {
    // eslint-disable-next-line max-len
    req.headers.authorization =
      'token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIzfQ.RPq4-rXX3McIc71DAuOkTSybVKco09VnnwBss1aWIcY';

    authorizationMiddleware(req, res, next);

    expect(res.status).toBeCalled();
    expect(res.status).toReturn();
    expect(res.json).toBeCalled();
    expect(res.json).toReturn();
    expect(res.json).toReturnWith({ error: 'Malformed token.' });
  });

  test('Reject token when neither Bearer nor nothing else is sent', () => {
    // eslint-disable-next-line max-len
    req.headers.authorization =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIzfQ.RPq4-rXX3McIc71DAuOkTSybVKco09VnnwBss1aWIcY';

    authorizationMiddleware(req, res, next);

    expect(res.status).toBeCalled();
    expect(res.status).toReturn();
    expect(res.json).toBeCalled();
    expect(res.json).toReturn();
    expect(res.json).toReturnWith({ error: 'Failed to process request.' });
  });

  test('Reject when a invalid token is sent', () => {
    // eslint-disable-next-line max-len
    req.headers.authorization =
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIzfQ.RPq4-rXX3McIc71DAuOkTSybVKco09VnnwBss1aWIc';

    authorizationMiddleware(req, res, next);

    expect(res.status).toBeCalled();
    expect(res.status).toReturn();
    expect(res.json).toBeCalled();
    expect(res.json).toReturn();
    expect(res.json).toReturnWith({ error: 'Invalid token.' });
  });

  test('Accept token when everything is OK', () => {
    // eslint-disable-next-line max-len
    req.headers.authorization =
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIzfQ.RPq4-rXX3McIc71DAuOkTSybVKco09VnnwBss1aWIcY';

    authorizationMiddleware(req, res, next);

    expect(next).toBeCalled();
  });
});
