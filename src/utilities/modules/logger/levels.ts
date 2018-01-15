import { Level } from '@/models/logger';

/** Priority levels for logging in The Agriculture Core */
export default [
  {
    name: 'silly',
    priority: 6,
    handleExceptions: false,
  },
  {
    name: 'debug',
    priority: 5,
    handleExceptions: false,
  },
  {
    name: 'verbose',
    priority: 4,
    handleExceptions: false,
  },
  {
    name: 'info',
    priority: 3,
    handleExceptions: false,
  },
  {
    name: 'warn',
    priority: 2,
    handleExceptions: false,
  },
  {
    name: 'error',
    priority: 1,
    handleExceptions: true,
  },
] as Level[];
