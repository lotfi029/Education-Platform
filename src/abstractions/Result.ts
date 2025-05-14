import { MyError } from "./Error";

export class Result {
    constructor(public isSucceed: boolean, public error: MyError) {
        if (isSucceed && error != MyError.non || !isSucceed && error == MyError.non) {
        throw new Error('Invalid arguments');
        }
    }

    public static success() : Result {
        return new Result(true, MyError.non);
    }
    public static fail(error: MyError) : Result {
        return new Result(false, error);
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
}
  
  