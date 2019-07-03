export declare const hasProto: boolean;
export declare class Observer {
    value: any;
    callback?: Function;
    vmCount: number;
    constructor(value: any, callback?: Function);
    walk(obj: Object): void;
    /**
     * Observe a list of Array items.
     */
    observeArray(items: any[], callback?: Function): void;
}
export declare function defineReactive(obj: any, key: string, callback: any, val?: any, shallow?: boolean): void;
export declare function observe(value: any, asRootData?: boolean, callback?: Function): Observer | void;
