import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSubmission } from "../../redux/slices/submissions-list-slice";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
} from "@mui/material"; 
import { useNavigate } from "react-router-dom";
import "./submission.css"; 

const LANGS = [
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
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

  const { loading, error } = useSelector((state) => state.submissionList);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      problem_id: problemId,
      lang,
      source_code: sourceCode,
    };

    if (contestId.trim()) {
      payload.contest_id = contestId.trim();
    }

    try {
      const submission = await dispatch(createSubmission(payload)).unwrap();
      navigate(`/submissions/${submission.submission_id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}> 
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}> 
        Create Submission
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Problem ID"
          value={problemId}
          onChange={(e) => setProblemId(e.target.value)}
          fullWidth
          required
          sx={{ mb: 3 }} 
        />

        {/* Contest ID */}
        <TextField
          label="Contest ID (optional)"
          value={contestId}
          onChange={(e) => setContestId(e.target.value)}
          fullWidth
          sx={{ mb: 3 }}
        />

        {/* Language */}
        <TextField
          select
          label="Language"
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          fullWidth
          sx={{ mb: 3 }}
        >
          {LANGS.map((l) => (
            <MenuItem key={l.value} value={l.value}>
              {l.label}
            </MenuItem>
          ))}
        </TextField>

        {/* Source Code */}
        <TextField
          label="Source Code"
          value={sourceCode}
          onChange={(e) => setSourceCode(e.target.value)}
          fullWidth
          multiline
          minRows={12}
          required
          sx={{ mb: 4 }}
        />

        <Button 
          type="submit" 
          variant="contained" 
          disabled={loading}
          fullWidth
          size="large"
          sx={{ py: 1.5 }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : "Create Submission"}
        </Button>
      </form>
    </Box>
  );
}