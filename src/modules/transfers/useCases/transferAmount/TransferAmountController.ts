import { Request, Response } from "express";
import { container } from "tsyringe";
import { TransferAmountUseCase } from "./TransferAmountUseCase";




class TransferAmountController {

  async execute(request: Request, response: Response): Promise<Response> {
    const { amount, description } = request.body
    const recipient_id = (request.headers['user_id']) as string
    const { id: sender_id } = request.user

    const transferAmountUseCase = container.resolve(TransferAmountUseCase)

    await transferAmountUseCase.execute({
      recipient_id,
      sender_id,
      amount,
      description
    })


    return response.send()
  }
}

export { TransferAmountController }
