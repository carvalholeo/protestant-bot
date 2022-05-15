import { describe, test, jest, expect } from '@jest/globals';
import { Request, Response } from 'express';

import logUniqueIdentifier from '../../../../src/middlewares/logUniqueIdentifier';

describe('Middleware logUniqueIdentifier', () => {
  test("When the middleware it's called, insert a string into request", () => {
    const req = {
      app: {
        get: jest.fn((key) => {
          return req.app.settings[key];
        }),
        set: jest.fn((key, value) => {
          req.app.settings[key] = value;
        }),
        settings: {},
      },
    } as any as Request;
    const res = null as any as Response;
    const next = jest.fn();

    logUniqueIdentifier(req, res, next);

    expect(req.app.set).toBeCalled();
    expect(req.app.set).toBeCalledTimes(1);
    expect(req.app.get('uniqueIdentifier')).toHaveLength(36);
    expect(next).toBeCalled();
    expect(next).toBeCalledTimes(1);
  });
});
