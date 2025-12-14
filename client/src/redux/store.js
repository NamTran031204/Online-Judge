import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/user-slice";
import commentsListReducer from "./slices/comment-list-slice";
import commentReducer from "./slices/comment-slice" ;
import submissionReducer from "./slices/submission-slice";
import submissionListReducer from "./slices/submissions-list-slice";
import groupsListReducer from "./slices/group-list-slice";
import groupsReducer from "./slices/groups-slice";
import ratingsReducer from "./slices/rating-slice";


export const store = configureStore({
  reducer: {
    ratings: ratingsReducer,
    user: userReducer,
    commentList: commentsListReducer,
    comment: commentReducer,
    submissionList: submissionListReducer,
    submission: submissionReducer,
    groupList: groupsListReducer,
    group: groupsReducer,
  },
});

export default store;