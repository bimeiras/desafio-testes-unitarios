import { AppError } from "../../../../shared/errors/AppError";

export namespace TransferAmountError {
  export class UserNotFound extends AppError {
    constructor() {
      super('User not found', 404);
    }
  }

  export class RecipientNotFound extends AppError {
    constructor() {
      super('Recipient not found', 404);
    }
  }

  export class InsufficientFunds extends AppError {
    constructor() {
      super('Insufficient funds', 400);
    }
  }
}
