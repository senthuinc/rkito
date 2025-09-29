import { safeAll, isObject } from "./util";

export class RESTfulException extends Error {
  public statusCode: number;
  public details?: any;
  constructor(message: string, statusCode: number, details?: any[]) {
    super(message);
    this.statusCode = statusCode;
    this.details = isObject(details) ? safeAll([details]) : details;
    this.name = "RESTfulException";
    Object.setPrototypeOf(this, RESTfulException.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RESTfulException);
    }
  }
}

export class IllegalArgumentException extends RESTfulException {
  constructor(message: string, details?: any[]) {
    super(message, 400 /*bad request*/, details);
    this.name = "IllegalArgumentException";
    Object.setPrototypeOf(this, IllegalArgumentException.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, IllegalArgumentException);
    }
  }

  public static null(param: string) {
    const msg = `@param ${param} cannot be null`;
    return new IllegalArgumentException(msg);
  }

  public static invalid(param: string) {
    const msg = `@param ${param} is invalid`;
    return new IllegalArgumentException(msg);
  }
}

export class IllegalStateException extends RESTfulException {
  constructor(message: string, details?: any[]) {
    super(message, 409 /*conflict*/, details);
    this.name = "IllegalStateException";
    Object.setPrototypeOf(this, IllegalStateException.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, IllegalStateException);
    }
  }
}

export class IllegalOperationException extends RESTfulException {
  constructor(message: string, details?: any[]) {
    super(message, 401 /*unauthorized*/, details);
    this.name = "IllegalOperationException";
    Object.setPrototypeOf(this, IllegalOperationException.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, IllegalOperationException);
    }
  }
}

export class InvalidOperationException extends RESTfulException {
  constructor(message: string, details?: any[]) {
    super(message, 403 /*forbidden*/, details);
    this.name = "InvalidOperationException";
    Object.setPrototypeOf(this, InvalidOperationException.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidOperationException);
    }
  }
}

export class NotFoundException extends RESTfulException {
  constructor(message: string, details?: any[]) {
    super(message, 404 /*Not found*/, details);
    this.name = "NotFoundException";
    Object.setPrototypeOf(this, NotFoundException.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundException);
    }
  }

  public static object(object: string, uid: string) {
    const msg = `${object} not found: ${uid}`;
    return new NotFoundException(msg);
  }
}

export class SystemError extends RESTfulException {
  constructor(message: string, details?: any[]) {
    super(message, 500, details);
    this.name = "SystemError";
    Object.setPrototypeOf(this, SystemError.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SystemError);
    }
  }

  public static object(object: string, uid: string, details?: any[]) {
    const msg = `${object} System error: ${uid}`;
    return new SystemError(msg, details);
  }
}
