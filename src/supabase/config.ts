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

export type CursorChangeTypeArgs = {
  activeFile: string;
  tempAccountId: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type FileChangeArgs = {
  activeFile: string;
  tempAccountId: string;
  objects: any[];
  type: 'added' | 'modified' | 'removed';
};

class RealtimeUser {
  userChannel?: RealtimeChannel;
  activeFile?: string;
  cursorChannel?: RealtimeChannel;
  userData: Partial<UserMetaType> = {};
  meta: Record<string, any> = {};

  setUser({ name, color, id }: UserMetaType) {
    this.userChannel;
    this.userData = {
      name,
      color,
      id,
    };
  }

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
  }

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
  }

  async cursorChange({ activeFile, tempAccountId, x, y, width, height }: CursorChangeTypeArgs) {
    if (!this.meta.cursorApiTimer) {
      // limiting the cursor change call to 300ms per request
      this.meta.cursorApiTimer = setTimeout(() => {
        this.meta.cursorApiTimer = undefined;
      }, 300);
      const res = await this.cursorChannel?.send({
        type: `broadcast`,
        event: `location(${activeFile})(${tempAccountId})`,
        payload: {
          x,
          y,
          width,
          height,
        },
      });
      if (res !== 'ok') {
        console.error(res);
      }
      return res;
    } else {
      return;
    }
  }

  async fileChange({ activeFile, tempAccountId, objects, type }: FileChangeArgs) {
    let response: any;
    while (response !== 'ok') {
      await new Promise((res) => {
        setTimeout(
          async () => {
            response = await this.cursorChannel?.send({
              type: 'broadcast',
              event: `location(${activeFile})(${tempAccountId})`,
              payload: {
                type,
                data: {
                  objects,
                },
              },
            });
            res(response);
          },
          response ? 500 : 0,
        );
      });
    }
    return response;
  }

  signOut() {
    return this.userChannel?.untrack();
  }
}

export const realtimeUser = new RealtimeUser();
