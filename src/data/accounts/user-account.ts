export class UserAccount {
    static readonly DB_COLLECTION_NAME = "users";
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