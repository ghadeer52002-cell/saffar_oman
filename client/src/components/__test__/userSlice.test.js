import { describe, it, expect } from 'vitest';
import reducer, { logout } from '../../features/UserSlice';

const test_state = {
    user: null,
    message: "",
    error: "",
    isSuccess: false,
    isLoading: false
}

describe("testing slice", () => {

    it("testing initial state", () => {

        expect(
            reducer(undefined, { type: undefined })
        ).toEqual(test_state);

    });

    it("testing logout user", () => {

        const state = {
            user: {
                fullName: "Huda",
                email: "huda@gmail.com"
            },
            message: "success",
            error: "",
            isSuccess: true,
            isLoading: false
        }

        expect(
            reducer(state, logout()).user
        ).toEqual(null);

    });

    it("testing logout message", () => {

        const state = {
            user: {
                fullName: "Huda"
            },
            message: "success",
            error: "",
            isSuccess: true,
            isLoading: false
        }

        expect(
            reducer(state, logout()).message
        ).toEqual("");

    });

    it("testing logout success", () => {

        const state = {
            user: {
                fullName: "Huda"
            },
            message: "",
            error: "",
            isSuccess: true,
            isLoading: false
        }

        expect(
            reducer(state, logout()).isSuccess
        ).toEqual(false);

    });

});