import { install } from 'source-map-support';
import isProduction from '@/utilities/isProduction';

!isProduction && install();

import { Server } from '@/server';

const server = new Server();
server.start();
