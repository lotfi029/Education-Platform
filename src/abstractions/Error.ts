import { HttpStatusCode } from "@angular/common/http";


export class MyError {
    constructor(description?: string, status?: number) {
        this.description = description;
        this.status = status;
    }
    description?: string;
    status?: number;

    public static non : MyError = new MyError(undefined, undefined);


    public static BadRequest(description?: string) : MyError {
        return new MyError(description, HttpStatusCode.BadRequest);
    }

    public static Unauthorized(description?: string) : MyError {
        return new MyError(description, HttpStatusCode.Unauthorized);
    }

    public static Forbidden(description?: string) : MyError {
        return new MyError(description, HttpStatusCode.Forbidden);
    }

    public static NotFound(description?: string) : MyError {
        return new MyError(description, HttpStatusCode.NotFound);
    }

    public static Conflict(description?: string) : MyError {
        return new MyError(description, HttpStatusCode.Conflict);
    }

    public static InternalServerError(description?: string) : MyError {
        return new MyError(description, HttpStatusCode.InternalServerError);
    }
}
  