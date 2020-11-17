import { STATUS_CODE } from './status_code';
export * from './status_code';
interface HttpRequestOptions {
    url: string;
    method?: 'GET' | 'POST';
    timeout?: number;
    json?: boolean;
    query?: {
        [key: string]: any;
    };
    headers?: {
        [key: string]: string;
    };
}
export declare class HttpResponseError implements Error {
    message: string;
    status: STATUS_CODE;
    statusText: string;
    body: string;
    url: string;
    name: string;
    constructor(message: string, status: STATUS_CODE, statusText: string, body: string, url: string);
}
export declare class HttpRequestFailed implements Error {
    url: string;
    innerEvent: any;
    name: string;
    message: string;
    constructor(url: string, innerEvent: any);
}
export declare class HttpBackend {
    private serialize;
    private createXHR;
    /**
     *
     * @param options contains options to be passed for the HTTP request (url, method and timeout)
     */
    createRequest<T>({ url, method, timeout, query, headers, json }: HttpRequestOptions, data?: {}): Promise<T>;
}
