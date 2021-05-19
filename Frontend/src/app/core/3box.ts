export interface Threebox {
    public: KeyValueStore;
    private: KeyValueStore;
    close(): void;
    logout(): void;
  }
  
  export interface KeyValueStore {
    log(): Array<object>;
    get(key: string): string;
    set(key: string, value: string): boolean;
    remove(key: string): boolean;
  }
  
  export interface BoxOptions {
    ipfsOptions: object;
    orbitPath: string;
    consentCallback: () => void;
  }
  
  export interface GetProfileOptions {
    ipfsOptions: object;
    orbitPath: string;
    addressServer: string;
  }