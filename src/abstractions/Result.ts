import { MyError } from "./Error";

export class Result {
    constructor(public isSucceed: boolean, public error: MyError) {
        if (isSucceed && error != MyError.non || !isSucceed && error == MyError.non) {
        throw new Error('Invalid arguments');
        }
    }

    protected static createSuccess(): Result {
        return new Result(true, MyError.non);
    }

    protected static createFailure(error: MyError): Result {
        return new Result(false, error);
    }

    public static success(): Result {
        return Result.createSuccess();
    }

    public static fail(error: MyError): Result {
        return Result.createFailure(error);
    }

    public isSuccess(): this is Result {
        return this.isSucceed;
    }

    public isFailure(): this is Result {
        return !this.isSucceed;
    }
}

export class TResult<T> extends Result {

    constructor(isSucceed: boolean, error: MyError, private _data?: T) {
        super(isSucceed, error);
    }

    public get data() : T {
        if (!this.isSucceed) {
            throw new Error('Data is not available');
        }
        return this._data as T;
    }

    public static override success<T>(data?: T) : TResult<T> {
        return new TResult<T>(true, MyError.non, data);
    }

    public static override fail<T>(error: MyError) : TResult<T> {
        return new TResult<T>(false, error, undefined);
    }
    // map, flatMap, match, getOrElse, getOrThrow 
    
}
  
  