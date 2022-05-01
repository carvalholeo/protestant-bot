import BlocklistRepository from './BlocklistRepository';
import ConfigurationRepository from './ConfigurationRepository';
import ContactRepository from './ContactRepository';
import LogServiceRepository from './LogServiceRepository';
import RateLimitRepository from './RateLimitRepository';
import RetweetLogRepository from './RetweetLogRepository';
import TweetQueueRepository from './TweetQueueRepository';
import UserRepository from './UserRepository';

export {
  BlocklistRepository,
  ConfigurationRepository,
  ContactRepository,
  LogServiceRepository,
  RateLimitRepository,
  RetweetLogRepository,
  TweetQueueRepository,
  UserRepository,
};


export default {
  BlocklistRepository: BlocklistRepository,
  ConfigurationRepository: ConfigurationRepository,
  ContactRepository: ContactRepository,
  LogService: LogServiceRepository,
  RateLimitRepository: RateLimitRepository,
  RetweetLogRepository: RetweetLogRepository,
  TweetQueueRepository: TweetQueueRepository,
  UserRepository: UserRepository,
};
