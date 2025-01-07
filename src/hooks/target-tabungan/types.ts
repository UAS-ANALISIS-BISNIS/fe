import { LogoutOptions, RedirectLoginOptions, PopupLoginOptions } from '@auth0/auth0-react';

// ----------------------------------------------------------------------

export type ActionMapType<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export type TabunganType = null | Record<string, any>;

export type TabunganStateType = {
  status?: string;
  loading: boolean;
  tabungan: TabunganType;
};

// ----------------------------------------------------------------------

type CanRemove = {
  save?: (jumlah: string, deadline: string) => Promise<void>;
  update?: (jumlah: string, deadline: string, id: string) => Promise<void>;
};

export type TabunganContextType = CanRemove & {
  tabungan: TabunganType;
  method: string;
  loading: boolean;
  get?: () => Promise<void>;
  detail?: (id: string) => Promise<void>;
  save?: (jumlah: string, deadline: string) => Promise<void>;
  update?: (jumlah: string, deadline: string, id: string) => Promise<void>;
  logout: () => Promise<void>;
}
