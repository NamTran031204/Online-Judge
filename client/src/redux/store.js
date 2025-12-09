import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/user-slice";
import contestsListReducer from "./slices/contests-list-slice"
import contestReducer from "./slices/contest-slice"
import problemListReducer from "./slices/problems-list-slice"
import problemReducer from "./slices/problem-slice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    contestsList: contestsListReducer,
    contest: contestReducer,
    problemsList: problemListReducer,
    problem: problemReducer,
  },
});

export default store;
