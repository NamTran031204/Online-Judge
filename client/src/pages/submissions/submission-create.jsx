import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSubmission } from "../../redux/slices/submissions-list-slice";
import { Box, Paper, Typography, TextField, Button, MenuItem, CircularProgress, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./submission.css";

const LANGS = [
  { value: "cpp", label: "C++ (g++)" },
  { value: "c", label: "C (gcc)" },
  { value: "py", label: "Python 3" },
  { value: "java", label: "Java" },
];

export default function SubmissionCreate() {
  const [problemId, setProblemId] = useState("");
  const [contestId, setContestId] = useState("");
  const [lang, setLang] = useState("cpp");
  const [sourceCode, setSourceCode] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, success } = useSelector((state) => state.submissions);

  useEffect(() => {
    if (success?.submission_id) {
      navigate(`/submission/${success.submission_id}`);
    }
  }, [success]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      problem_id: problemId,
      lang,
      source_code: sourceCode,
    };

    if (contestId.trim()) payload.contest_id = contestId.trim();

    dispatch(createSubmission(payload));
  };

  const handleReset = () => {
    setProblemId("");
    setContestId("");
    setSourceCode("");

    dispatch(resetSubmissionState());
  };

  return (
    <Box className="submission-create">
      <Typography variant="h5" mb={2}>Create Submission</Typography>

      <Paper className="submission-container">
        {error && <Alert severity="error" className="alert">{error}</Alert>}
        {success && <Alert severity="success" className="alert">Tạo submission thành công!</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Problem ID"
            value={problemId}
            onChange={(e) => setProblemId(e.target.value)}
            fullWidth
            required
            className="input"
          />

          <TextField
            label="Contest ID (optional)"
            value={contestId}
            onChange={(e) => setContestId(e.target.value)}
            fullWidth
            className="input"
          />

          <TextField
            select
            label="Language"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            fullWidth
            className="input"
          >
            {LANGS.map((l) => (
              <MenuItem key={l.value} value={l.value}>{l.label}</MenuItem>
            ))}
          </TextField>

          <TextField
            label="Source Code"
            value={sourceCode}
            onChange={(e) => setSourceCode(e.target.value)}
            fullWidth
            multiline
            minRows={12}
            className="code-editor"
          />

          <Box className="btn-row">
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={20} /> : "Submit"}
            </Button>

            <Button variant="outlined" onClick={handleReset}>
              Reset
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
