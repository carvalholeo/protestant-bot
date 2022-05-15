import { Bouncer, bounce } from 'express-limit-bouncer';

const bouncerConfigObject = {
  blackList: [],
  blackListMessage:
    'ACCESS DENIED: This IP address is denylisted from this resource',
  limitMessage:
    'ENHANCE YOUR CALM: Too many recent requests to this resource, please try again later',
  limitStatus: 420,
  logger: false,
  reqLimit: 1000,
  saveAddressLists: {
    blackList: false,
    whiteList: false,
  },
  windowDur: 1000 * 60 * 15,
  whitelist: ['127.0.0.1', 'localhost', '::1', '::ffff:127.0.0.1'],
};

if (process.env.NODE_ENV === 'test') {
  bouncerConfigObject.blackList = [
    // @ts-expect-error
    '192.168.0.1',
  ];
}

const bouncerConfiguration = new Bouncer(bouncerConfigObject);

const bouncerLimiter = bounce(bouncerConfiguration);

export default bouncerLimiter;
