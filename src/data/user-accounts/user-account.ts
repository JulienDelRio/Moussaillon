export class UserAccount {
    readonly userId: number;
    availableAmount: number = 0;

    constructor(userId: number) {
        this.userId = userId;
    }

    serialize() {
        return {
            "availableAmount": this.availableAmount,
        };
    }
}