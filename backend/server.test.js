import { describe, it, expect } from "vitest";
import { getUserEmail, verifyUser, getBoards, getScores } from "./server.js";

describe('test of getUserEmail function', () => {
    it('User should not exist', () => {
        expect(getUserEmail("users_test.json", "test12@gmail.com")).toBe(null);
    })

    it('User should exist', () => {
        expect(getUserEmail("users_test.json", "test@gmail.com")).toBe("test@gmail.com");
    })
});

describe('test of verifyUser function', () => {
    it('Verify that the email and password does not match', () => {
        expect(verifyUser("users_test.json", "test@gmail.com", "12")).toBe(null);
    })

    it('Verify that the email and password matches', () => {
        expect(verifyUser("users_test.json", "test@gmail.com", "123")).toBe("test@gmail.com");
    })
});

describe('test of getBoards function', () => {
    it('Verify that the board does not exist', () => {
        expect(getBoards("boards_test.json", "test12@gmail.com")).toBe(null);
    })

    it('Verify that the board exist', () => {
        expect(getBoards("boards_test.json", "test@gmail.com")[0].gameId).toBe("Game 1");
    })
});

describe('test of getBoards function', () => {
    it('Verify that the score does not exist', () => {
        expect(getScores("scores_empty.json", "test12@gmail.com")).toBe(null);
    })

    it('Verify that the score exist', () => {
        expect(getScores("scores_test.json", "test12@gmail.com").length).toBe(5);
    })
});
