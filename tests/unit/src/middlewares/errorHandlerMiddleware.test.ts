import { describe, test, jest, expect } from '@jest/globals';
import { Request, Response } from 'express';

import errorHandlerMiddleware from '../../../../src/middlewares/errorHandlerMiddleware';

describe('Middleware errorHandlerMiddleware', () => {
  test("When the middleware it's called in dev environment, return complete error", () => {
    const req = {
      app: {
        get: jest.fn(() => {
          return 'development';
        }),
      },
    } as unknown as Request;

    const res = {
      status: jest.fn(() => {
        return res;
      }),
      json: jest.fn((message) => {
        return message;
      }),
      locals: {
        error: {},
      },
    } as unknown as Response;

    const error = {
      message: 'Error occurred at test',
      status: 500,
    };

    errorHandlerMiddleware(error, req, res);

    expect(res.status).toBeCalled();
    expect(res.status).toBeCalledTimes(1);
    expect(res.json).toBeCalled();
    expect(res.json).toBeCalledTimes(1);
    expect(res.json).toReturnWith({ message: error.message });
    expect(res.locals.error.status).toEqual(500);
  });

  test("When the middleware it's called in a different environment, return generic error", () => {
    const req = {
      app: {
        get: jest.fn(() => {
          return 'test';
        }),
      },
    } as unknown as Request;

    const res = {
      status: jest.fn(() => {
        return res;
      }),
      json: jest.fn((message) => {
        return message;
      }),
      locals: {
        error: {},
      },
    } as unknown as Response;

    const error = {
      message: 'Error occurred at test',
      status: 510,
    };

    errorHandlerMiddleware(error, req, res);

    expect(res.status).toBeCalled();
    expect(res.status).toBeCalledTimes(1);
    expect(res.json).toBeCalled();
    expect(res.json).toBeCalledTimes(1);
    expect(res.json).toReturnWith({ message: error.message });
    expect(res.locals.error.status).toBeUndefined();
  });

  test("When the middleware it's called in a different environment without status code, return error 500", () => {
    const req = {
      app: {
        get: jest.fn(() => {
          return 'test';
        }),
      },
    } as unknown as Request;

    const res = {
      status: jest.fn(() => {
        return res;
      }),
      json: jest.fn((message) => {
        return message;
      }),
      locals: {
        error: {},
      },
    } as unknown as Response;

    const error = {
      message: 'Error occurred at test',
      status: undefined,
    };

    // @ts-expect-error
    errorHandlerMiddleware(error, req, res);

    expect(res.status).toBeCalled();
    expect(res.status).toBeCalledTimes(1);
    expect(res.json).toBeCalled();
    expect(res.json).toBeCalledTimes(1);
    expect(res.json).toReturnWith({ message: error.message });
    expect(res.locals.error.status).toBeUndefined();
  });

  test("When the middleware it's called in dev environment without status code, return error 500", () => {
    const req = {
      app: {
        get: jest.fn(() => {
          return 'development';
        }),
      },
    } as unknown as Request;

    const res = {
      status: jest.fn(() => {
        return res;
      }),
      json: jest.fn((message) => {
        return message;
      }),
      locals: {
        error: {},
      },
    } as unknown as Response;

    const error = {
      message: 'Error occurred at test',
      status: undefined,
    };

    // @ts-expect-error
    errorHandlerMiddleware(error, req, res);

    expect(res.status).toBeCalled();
    expect(res.status).toBeCalledTimes(1);
    expect(res.json).toBeCalled();
    expect(res.json).toBeCalledTimes(1);
    expect(res.json).toReturnWith({ message: error.message });
    expect(res.locals.error.status).toBeUndefined();
  });
});
