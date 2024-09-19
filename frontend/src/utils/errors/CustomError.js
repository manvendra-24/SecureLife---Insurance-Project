export class CustomError extends Error {
    constructor(statusCode, message, specificMessage) {
        super(message)
        this.statusCode = statusCode
        this.specificMessage = specificMessage
    }
}