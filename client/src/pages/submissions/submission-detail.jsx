import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Paper, Typography, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  getSubmissionDetail,
  clearSubmissionDetail,
} from "../../redux/slices/submission-slice";
import "./submission.css";

export default function SubmissionDetail() {
  const { submission_id } = useParams();
  const dispatch = useDispatch();

  const { detail, loading, error } = useSelector(
    (state) => state.submission
  );

  useEffect(() => {
    if (submission_id) {
      dispatch(getSubmissionDetail(submission_id));
    }

    return () => {
      dispatch(clearSubmissionDetail());
    };
  }, [submission_id, dispatch]);

  if (loading)
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box textAlign="center" mt={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );

  if (!detail) return null;

  return (
    <Box className="submission-detail-container">
      <Typography variant="h5" mb={2}>
        Submission #{detail.submission_id}
      </Typography>

      <Paper className="submission-detail-info">
        <Typography><b>User:</b> {detail.user_id}</Typography>
        <Typography><b>Problem:</b> {detail.problem_id}</Typography>
        <Typography><b>Status:</b> {detail.status}</Typography>
        <Typography><b>Result:</b> {detail.result}</Typography>
        <Typography><b>Time:</b> {detail.created_at}</Typography>
      </Paper>

      {detail.source_code && (
        <>
          <Typography variant="h6" mt={2} mb={1}>
            Source Code
          </Typography>
          <Paper className="source-code-box">
            <pre>{detail.source_code}</pre>
          </Paper>
        </>
      )}
    </Box>
  );
}
