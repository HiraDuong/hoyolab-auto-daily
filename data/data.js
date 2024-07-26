//  sau nay se luu vao database

class Account {
    constructor(nickname, token, genshin = true, honkai_star_rail = true, honkai_3 = true) {
        this.nickname = nickname;
        this.token = token;
        this.genshin = genshin;
        this.honkai_star_rail = honkai_star_rail;
        this.honkai_3 = honkai_3;

        // Validate token format (example)
        if (!this.validateToken(token)) {
            throw new Error("Invalid token format!");
        }
    }

    validateToken(token) {
        // Implement your token format validation logic here
        // This example checks for a minimum length
        return token.length >= 10;
    }
}

const listAccounts = [
    new Account("Haru", "your_actual_token_1", true, true, true),
    new Account("Man", "your_actual_token_2", false, true, false),
    // ... add more accounts with nicknames
];

export default listAccounts;