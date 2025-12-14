import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProblemDetail } from "../../redux/slices/problem-slice";
import { useParams } from "react-router-dom";
import "./problems.css";

export default function ProblemDetail() {
  const { problem_id } = useParams();
  const dispatch = useDispatch();

  // Lấy dữ liệu từ slice
  const { problem: p, loading } = useSelector((state) => state.problem);

  // fake test result
  const [runResult, setRunResult] = useState(null);

  useEffect(() => {
    dispatch(getProblemDetail(problem_id)); // gọi API từ slice
  }, [problem_id]);

  const handleRun = () => {
    const fakeResult = {
      status: "Accepted",
      time: "0.012s",
      memory: "4 MB",
      output: "3",
      expected: "3",
    };
    setRunResult(fakeResult);
  };

  if (loading || !p)
    return <div className="problem-container">Loading...</div>;

  return (
    <div className="problem-container">
      <h2 className="problem-title">
        {p.problem_id}. {p.title}
      </h2>

      {/* Tags + Rating */}
      <div className="problem-info">
        <div className="tag-list">
          {p.tags?.map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>

        <span className="rating">Rating: {p.rating}</span>
      </div>

      {/*  PROBLEM DESCRIPTION  */}
      <div className="problem-card">
        <h3>Description</h3>
        <pre className="statement">{p.description}</pre>

        <h3>Constraints</h3>
        <p>Time Limit: {p.time_limit} ms</p>
        <p>Memory Limit: {p.memory_limit} MB</p>

        <h3>Sample Tests</h3>
        {p.sample?.map((ex, index) => (
          <div key={index} className="example-box">
            <div>
              <b>Input</b>
              <pre>{ex.input}</pre>
            </div>
            <div>
              <b>Output</b>
              <pre>{ex.output}</pre>
            </div>
          </div>
        ))}

        <h3>Score</h3>
        <p>{p.score}</p>

        <h3>Solution</h3>
        <pre className="statement">{p.solution}</pre>

        <h3>Tutorial</h3>
        <pre className="statement">{p.tutorial}</pre>
      </div>

      {/*  CODE EDITOR SECTION  */}
      <div className="editor-section">
        <h3>Write Your Solution</h3>

        <label className="editor-label">Language</label>
        <select className="editor-select">
          <option>C++ 17</option>
          <option>Java</option>
          <option>Python 3</option>
          <option>JavaScript (Node.js)</option>
        </select>

        <textarea
          className="code-editor"
          placeholder="// Write your code here..."
        ></textarea>

        <div className="action-cell">
          <button className="view-btn" onClick={handleRun}>Run</button>
          <button className="create-btn">Submit</button>
        </div>
      </div>

      {/*  RUN RESULT SECTION  */}
      {runResult && (
        <div className="run-result">
          <h3>Run Result</h3>

          <div className="result-row">
            <span>Status:</span>
            <span className={`result-status ${runResult.status.toLowerCase()}`}>
              {runResult.status}
            </span>
          </div>

          <div className="result-row">
            <span>Time:</span>
            <span>{runResult.time}</span>
          </div>

          <div className="result-row">
            <span>Memory:</span>
            <span>{runResult.memory}</span>
          </div>

          <div className="result-block">
            <b>Your Output</b>
            <pre>{runResult.output}</pre>
          </div>

          <div className="result-block">
            <b>Expected Output</b>
            <pre>{runResult.expected}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
