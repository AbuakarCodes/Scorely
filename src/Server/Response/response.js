export class SuccessResponse {
    constructor(message, data = null) {
        this.message = message
        this.data = data
    }
}

export class ErrorResponse {
    constructor(message, data = null) {
        this.message = message
        this.data = data
    }
}