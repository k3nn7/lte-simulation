export enum Type {
  Data = 0,
  Ack = 1,
}

export interface DataUnit {
  readonly tint: number;
  readonly size: number;
  readonly type: Type;
}
