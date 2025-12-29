import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, Link, useLocation } from "react-router-dom";
import { useRef } from "react";
import { useGetProblemDetailQuery } from "../../services/problemApi";
import { useSubmitSolutionMutation } from "../../services/submissionApi";
import Editor from "@monaco-editor/react";
import {
  Clock,
  HardDrive,
  ArrowLeft,
  Play,
  RotateCcw,
  CheckCircle,
  Send,
} from "lucide-react";


import "./problem-detail.css";
import SubmissionList from "../submissions/submission-list";

/* CODE TEMPLATES */
const LANGUAGE_TEMPLATES = {
  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // Your solution here

    return 0;
}`,
  python: `def solve():
    # Your solution here
    pass

if __name__ == "__main__":
    solve()`,
  java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Your solution here
    }
}`,
};

const MONACO_LANGUAGE_MAP = {
  cpp: "cpp",
  python: "python",
  java: "java",
};

export default function ProblemDetail() {
  const { problem_id } = useParams();
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);

  const isContestProblem = pathParts[0] === "contest" || pathParts[0] === "gym";
  const contest_id = isContestProblem ? Number(pathParts[1]) : null;

  const currentUser = useSelector((state) => state.user);

  const { data, isLoading: loading, isError } = useGetProblemDetailQuery(problem_id);
  const p = data?.data;

  const [submitSolution, { isLoading: isSubmitting }] = useSubmitSolutionMutation();

  const [activeTab, setActiveTab] = useState("description");
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(LANGUAGE_TEMPLATES.cpp);
  const [langOpen, setLangOpen] = useState(false);
  const dropdownRef = useRef(null);


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(LANGUAGE_TEMPLATES[lang]);
  };

  const handleReset = () => {
    setCode(LANGUAGE_TEMPLATES[language]);
  };

  const handleSubmit = async () => {
    if (!currentUser.isAuthenticated) {
      alert("You must login to submit");
      return;
    }

    const payload = {
      problem_id: problem_id,
      lang: language,
      source_code: code,
    };

    if (isContestProblem && contest_id) {
      payload.contest_id = contest_id;
    }

    try {
      const res = await submitSolution(payload).unwrap();
      console.log("Submission ID:", res.submission_id);

      // optional: navigate to submissions / toast success
    } catch (err) {
      console.error("Submit failed:", err);
    }
  };

  if (loading || !p) {
    return <div className="problem-detail-loading">Loading...</div>;
  }

  return (
    <div className="problem-detail-layout">
      {/* LEFT */}
      <div className="problem-left">
        <div className="problem-left-inner">
          {/* Header */}
          <div className="problem-header">
            <Link
              to={location.state?.from || "/problems"}
              className="back-link"
            >
              <ArrowLeft size={16} />
              Back
            </Link>

            <div className="title-row">
              <h1>{p.title}</h1>
              <span className="score-pill">{p.score} points</span>
            </div>
          </div>

          {/* Meta */}
          <div className="problem-meta">
            <span>
              <Clock size={14} /> {p.time_limit}s
            </span>
            <span>
              <HardDrive size={14} /> {p.memory_limit} MB
            </span>
            <span>
              <CheckCircle size={14} /> {p.rating}% accepted
            </span>
          </div>

          {/* Tags */}
          <div className="problem-tags">
            {p.tags?.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>

          {/* Tabs */}
          <div className="problem-tabs">
            <button
              className={`tab ${activeTab === "description" ? "active" : ""}`}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>

            <button
              className={`tab ${activeTab === "submissions" ? "active" : ""}`}
              onClick={() => setActiveTab("submissions")}
            >
              Submissions
            </button>
          </div>

          {/* Content */}
          <div className="problem-content">
            {activeTab === "description" && (
              <>
                <section>
                  <h3>Problem</h3>
                  <p className="pre-wrap">{p.description}</p>
                </section>

                {p.sample?.length > 0 && (
                  <section className="examples-section">
                    <h3>Examples</h3>

                    {p.sample.map((ex, i) => (
                      <div key={i} className="example-card">
                        <div className="example-block">
                          <div className="example-label">Input</div>
                          <pre className="example-content">{ex.input}</pre>
                        </div>

                        <div className="example-block">
                          <div className="example-label">Output</div>
                          <pre className="example-content">{ex.output}</pre>
                        </div>

                        {ex.explanation && (
                          <div className="example-explanation">
                            <span>Explanation:</span> {ex.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </section>
                )}
              </>
            )}

            {activeTab === "submissions" && (
              // nhannx
              // <div className="submissions-empty">
              //   <div className="submissions-card">
              //     <p>Your submissions for this problem will appear here.</p>
              //     <Link to="/submissions" className="submissions-link">
              //       View all submissions
              //     </Link>
              //   </div>
              // </div>

              // phongdt
              <SubmissionList minimal={true} />
            )}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="problem-right">
        {/* Editor Header */}
        <div className="editor-header">
          <div className="language-dropdown" ref={dropdownRef}>
            <button
              className="language-trigger"
              onClick={() => setLangOpen(!langOpen)}
            >
              {language.toUpperCase()}
            </button>

            {langOpen && (
              <div className="language-menu">
                <button onClick={() => {
                  handleLanguageChange("cpp");
                  setLangOpen(false);
                }}>
                  C++
                </button>

                <button onClick={() => {
                  handleLanguageChange("python");
                  setLangOpen(false);
                }}>
                  Python
                </button>

                <button onClick={() => {
                  handleLanguageChange("java");
                  setLangOpen(false);
                }}>
                  Java
                </button>
              </div>
            )}
          </div>

          <button className="reset-btn" onClick={handleReset}>
            <RotateCcw size={14} />
            Reset
          </button>
        </div>

        {/* Editor */}
        <div className="editor-body">
          <Editor
            height="100%"
            language={MONACO_LANGUAGE_MAP[language]}
            value={code}
            onChange={(value) => setCode(value || "")}
            theme="vs-dark"
            options={{
              fontSize: 14,
              fontFamily: "'JetBrains Mono', monospace",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              padding: { top: 16 },
              lineNumbers: "on",
              tabSize: 4,
              automaticLayout: true,
            }}
          />
        </div>

        {/* Footer */}
        <div className="editor-footer">
          <span className="editor-lines">
            {code.split("\n").length} lines
          </span>

          <div className="editor-actions">
            <button className="run-btn">
              <Play size={14} />
              Run
            </button>
            <button
              className="submit-btn"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              <Send size={14} />
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
