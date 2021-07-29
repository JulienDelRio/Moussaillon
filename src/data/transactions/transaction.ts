export class Transaction {
    readonly amount: number;
    readonly userId: number;
    readonly sellerId: number | undefined;
    status: TransactionStatus;
    readonly date: Date;
    id: string | undefined;


    constructor(amount: number, userId: number, date: Date) {
        this.amount = amount;
        this.userId = userId;
        this.date = date;
        this.status = TransactionStatus.ordered;
    }

    serialize() {
        return {
            "amount": this.amount,
            "userId": this.userId,
            "data": this.date,
            "status": this.status,
        };
    }
}

export enum TransactionStatus {
    ordered,
    payed,
    closed
}