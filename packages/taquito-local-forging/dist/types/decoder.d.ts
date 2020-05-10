import { Uint8ArrayConsumer } from './uint8array-consumer';
export declare type Decoder = (val: Uint8ArrayConsumer) => string | number | {} | undefined;
export declare const decoders: {
    [key: string]: Decoder;
};
