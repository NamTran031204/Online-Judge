import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/user-slice";
import contestsListReducer from "./slices/contests-list-slice"
import contestReducer from "./slices/contest-slice"
import problemListReducer from "./slices/problems-list-slice"
import problemReducer from "./slices/problem-slice"
import commentsListReducer from "./slices/comment-list-slice";
import commentReducer from "./slices/comment-slice" ;
import submissionReducer from "./slices/submission-slice";
import submissionListReducer from "./slices/submissions-list-slice";
import groupsListReducer from "./slices/group-list-slice";
import groupsReducer from "./slices/groups-slice";
import ratingsReducer from "./slices/rating-slice";
import dashboardReducer from "./slices/dashboard-slice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    contestsList: contestsListReducer,
    contest: contestReducer,
    problemsList: problemListReducer,
    problem: problemReducer,
    ratings: ratingsReducer,
    commentList: commentsListReducer,
    comment: commentReducer,
    submissionList: submissionListReducer,
    submission: submissionReducer,
    groupList: groupsListReducer,
    group: groupsReducer,
    dashboard: dashboardReducer,
  },
});

export default store;
