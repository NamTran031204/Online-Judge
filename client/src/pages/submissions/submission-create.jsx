import { useEffect, useState } from "react"; 
import { useDispatch, useSelector } from "react-redux";
import { 
  createSubmission,
  clearCreateError, 
} from "../../redux/slices/submissions-list-slice"; 
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

  const { loading, createError } = useSelector( 
    (state) => state.submissionList
  );

  useEffect(() => {
    if (createError) {
        dispatch(clearCreateError());
    }
    dispatch(clearCreateError()); 
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!problemId.trim() || !sourceCode.trim()) return; 

    const payload = {
      problem_id: problemId.trim(),
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
    }
  };

  return (
    <div className="submission-container"> 
      
      <form className="submission-form" onSubmit={handleSubmit}>
        <h2>Create Submission</h2>

        {createError && <div className="gc-error">{createError}</div>}

        <label>Problem ID</label>
        <input
          type="text"
          value={problemId}
          onChange={(e) => setProblemId(e.target.value)}
          required
        />

        <label>Contest ID (optional)</label>
        <input
          type="text"
          value={contestId}
          onChange={(e) => setContestId(e.target.value)}
        />

        <label>Language</label>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
        >
          {LANGS.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>

        <label>Source Code</label>
        <textarea
          value={sourceCode}
          onChange={(e) => setSourceCode(e.target.value)}
          required
        />

        <button 
          type="submit" 
          disabled={loading || !problemId.trim() || !sourceCode.trim()} 
        >
          {loading ? "Creating..." : "Create Submission"}
        </button>
      </form>
    </div>
  );
}