import { describe, test, jest, expect } from '@jest/globals';
import { Request, Response, NextFunction } from 'express';

import bouncerLimiter from '../../../../src/middlewares/bouncerLimiter';

describe('Express Bouncer Limiter', () => {
  test('When overpass requests, request is blocked', () => {
    const req = {
      ip: '8.8.8.8',
      connection: {
        remoteAddress: '8.8.8.8',
      },
    } as unknown as Request;

    const res = {
      send: jest.fn((value) => {
        return value;
      }),
      statusCode: 0,
    } as unknown as Response;

    const next: NextFunction = jest.fn();

    const message =
      'ENHANCE YOUR CALM: Too many recent requests to this resource, please try again later';

    for (let i = 0; i < 1500; i++) {
      bouncerLimiter(req, res, next);
    }

    expect(res.send).toBeCalled();
    expect(res.statusCode).toEqual(420);
    expect(res.send).toReturnWith(message);
  });

  test('When overpass requests coming from a allowlisted IP, request is allowed', () => {
    const req = {
      ip: '127.0.0.1',
      connection: {
        remoteAddress: '127.0.0.1',
      },
    } as unknown as Request;

    const res = {
      send: jest.fn((value) => {
        return value;
      }),
      statusCode: 0,
    } as unknown as Response;

    const next: NextFunction = jest.fn();

    for (let i = 0; i < 1000; i++) {
      bouncerLimiter(req, res, next);
    }

    expect(next).toBeCalled();
  });

  test('When a request come from a denylisted IP, request is blocked', () => {
    const req = {
      ip: '192.168.0.1',
      connection: {
        remoteAddress: '192.168.0.1',
      },
    } as unknown as Request;

    const res = {
      send: jest.fn((value) => {
        return value;
      }),
      statusCode: 0,
    } as unknown as Response;

    const next: NextFunction = jest.fn();
    const message =
      'ACCESS DENIED: This IP address is denylisted from this resource';

    bouncerLimiter(req, res, next);

    expect(res.send).toBeCalled();
    expect(res.send).toReturn();
    expect(res.send).toReturnWith(message);
    expect(res.statusCode).toEqual(403);
  });
});
