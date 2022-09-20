import { createClient, RealtimeChannel } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
console.log(import.meta);
const supabase = createClient(
  'https://vuosvpakhkjjnnunxunr.supabase.co',
  import.meta.env.VITE_SB_TOKEN,
);

export default supabase;

export type UserMetaType = {
  id: string;
  name: string;
  color: string;
};

export type RealTimeUserType = {
  userChannel?: RealtimeChannel;
  activeFile?: string;
  cursorChannel?: RealtimeChannel;
  userData: Partial<UserMetaType>;
  setUser(user: UserMetaType): void;
  getUserChannel(fileId: string): RealtimeChannel;
  getCursorChannel(): RealtimeChannel;
  cursorChange(args: {
    activeFile: string;
    tempAccountId: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }): Promise<any>;
  fileChange(args: { activeFile: string; tempAccountId: string; objects: any[] }): Promise<any>;
};

export const realtimeUser: RealTimeUserType = {
  userChannel: undefined,
  activeFile: undefined,
  cursorChannel: undefined,
  userData: {},
  setUser({ name, color, id }: UserMetaType) {
    this.userData = {
      name,
      color,
      id,
    };
  },
  getUserChannel(fileId: string) {
    if (this.userChannel && this.activeFile === fileId) {
      return this.userChannel;
    } else {
      this.userChannel = supabase.channel(`onlineUsers(${fileId})`);
      this.userChannel.subscribe();
      this.activeFile = fileId;
      this.userChannel.track(this.userData);
      this.getCursorChannel();
      return this.userChannel;
    }
  },
  getCursorChannel() {
    if (this.cursorChannel) {
      return this.cursorChannel;
    } else {
      this.cursorChannel = supabase.channel('user-location', {
        configs: {
          broadcast: { ack: true },
        },
      });
      this.cursorChannel.subscribe();
      return this.cursorChannel;
    }
  },
  async cursorChange({ activeFile, tempAccountId, x, y, width, height }) {
    await this.cursorChannel?.send({
      type: `broadcast`,
      event: `location(${activeFile})(${tempAccountId})`,
      payload: {
        x,
        y,
        width,
        height,
      },
    });
    return;
  },
  async fileChange({ activeFile, tempAccountId, objects }) {
    const response = await this.cursorChannel?.send({
      type: `broadcast`,
      event: `location(${activeFile})(${tempAccountId})`,
      payload: {
        type: 'added',
        data: {
          objects,
        },
      },
    });
    return response;
  },
};
