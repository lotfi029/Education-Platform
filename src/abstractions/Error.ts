import { HttpStatusCode } from "@angular/common/http";


export class MyError {
    constructor(public descriptions?: string[], status?: number) {
        this.descriptions = descriptions ?? [];
        this.status = status;
    }
    // descriptions: string[];
    
    // description?: string;
    status?: number;

    public static non : MyError = new MyError(undefined, undefined);


    public static BadRequest(descriptions?: string[]) : MyError {
        return new MyError(descriptions, HttpStatusCode.BadRequest);
    }

    public static Unauthorized(descriptions?: string[]) : MyError {
        return new MyError(descriptions, HttpStatusCode.Unauthorized);
    }

    public static Forbidden(descriptions?: string[]) : MyError {
        return new MyError(descriptions, HttpStatusCode.Forbidden);
    }

    public static NotFound(descriptions?: string[]) : MyError {
        return new MyError(descriptions, HttpStatusCode.NotFound);
    }

    public static Conflict(descriptions?: string[]) : MyError {
        return new MyError(descriptions, HttpStatusCode.Conflict);
    }

    public static InternalServerError(descriptions?: string[]) : MyError {
        return new MyError(descriptions, HttpStatusCode.InternalServerError);
    }
}
  