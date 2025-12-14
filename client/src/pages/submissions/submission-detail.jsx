import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Paper, Typography, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  getSubmissionDetail,
} from "../../redux/slices/submission-slice";
import "./submission.css";

export default function SubmissionDetail() {
  const { submission_id } = useParams();
  const dispatch = useDispatch();

  const { data, loading } = useSelector((state) => state.submissionDetail);

  useEffect(() => {
    dispatch(getSubmissionDetail(submission_id));
  }, [submission_id, dispatch]);

  if (loading || !data)
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box className="submission-detail-container">
      <Typography variant="h5" mb={2}>
        Submission #{data.submission_id}
      </Typography>

      <Paper className="submission-detail-info">
        <Typography><b>User:</b> {data.user_id}</Typography>
        <Typography><b>Problem:</b> {data.problem_id}</Typography>
        <Typography><b>Status:</b> {data.status}</Typography>
        <Typography><b>Result:</b> {data.result}</Typography>
        <Typography><b>Time:</b> {data.created_at}</Typography>
      </Paper>

      {data.source_code && (
        <>
          <Typography variant="h6" mb={1}>Source Code</Typography>
          <Paper className="source-code-box">
            <pre>{data.source_code}</pre>
          </Paper>
        </>
      )}
    </Box>
  );
}
