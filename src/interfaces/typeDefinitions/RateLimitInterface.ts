interface RateLimitInterface {
  resource: string;
  limit: number;
  nextReset?: number;
  next_reset?: number;
  nextAction?: string;
  resources?: string;
}

export default RateLimitInterface;
