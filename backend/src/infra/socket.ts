import { Server } from 'http';
import socketIO, { Socket } from 'socket.io';

export const IO = {
  client: (null as unknown) as Socket,
  connect(server: Server): void {
    this.client = (socketIO as any)(server, {
      cors: {
        origin: '*',
        methods: ['*'],
      },
    });
  },
};
