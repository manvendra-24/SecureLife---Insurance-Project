import { CustomError } from "./CustomError";

export class NotFoundError extends CustomError {
    constructor(specificMessage) {
        super(404, "Not Found", specificMessage)
    }
}

export class UnAuthorized extends CustomError {
    constructor(specificMessage) {
        super(405, "UnAuthorized", specificMessage)
    }
}
export class UnAuthorizedError extends CustomError {
    constructor(specificMessage) {
        super(405, "UnAuthorized", specificMessage)
    }
}
export class ValidationError extends CustomError {
    constructor(specificMessage) {
        super(500, "Bad Request", specificMessage)
    }
}

export class InvalidCredentialError extends CustomError{
    constructor(specificMessage){
        super(400, "Invalid Credentials", specificMessage)
    }
}

export class InternalServerError extends CustomError{
    constructor(specificMessage){
        super(400, "Internal Server Error", specificMessage)
    }
}

export class AlreadyExists extends CustomError{
    constructor(specificMessage){
        super(400,"Already Exists", specificMessage )
    }
}
