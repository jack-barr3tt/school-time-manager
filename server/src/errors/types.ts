export class APIError extends Error {
    public code: number
    public message: string
    public data?: object
  
    constructor(message: string, code?: number, data?: object) {
      super(message)
      this.code = code || 400
      this.message = message
      this.data = data
    }
}