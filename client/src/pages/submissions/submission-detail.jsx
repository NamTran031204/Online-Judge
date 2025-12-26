import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  getSubmissionDetail,
  clearSubmissionDetail,
} from "../../redux/slices/submission-slice";
import "./submission.css";

export default function SubmissionDetail() {
  const { submission_id } = useParams();
  const dispatch = useDispatch();
  
  const [isExpanded, setIsExpanded] = useState(true);

  const { detail, loading, error } = useSelector((state) => state.submission);

  useEffect(() => {
    if (submission_id) {
      dispatch(getSubmissionDetail(submission_id));
    }
    return () => {
      dispatch(clearSubmissionDetail());
    };
  }, [submission_id, dispatch]);

  if (loading) return (
    <Box textAlign="center" mt={10}>
      <CircularProgress />
      <Typography sx={{ mt: 2, color: '#666' }}>Đang tải dữ liệu...</Typography>
    </Box>
  );

  if (error) return (
    <Box textAlign="center" mt={10}>
      <Typography color="error" variant="h6">{error}</Typography>
    </Box>
  );

  if (!detail) return null;

  const codeLines = detail.source_code ? detail.source_code.trim().split('\n') : [];
  const testCases = detail.result_detail || [];
  const totalScore = testCases.reduce((sum, item) => sum + (item.score || 0), 0);

  // Helper xác định màu sắc trạng thái
  const getStatusStyle = (status) => {
    const s = status?.toLowerCase();
    if (s === "accepted") return "status-accepted";
    if (s === "wrong answer") return "status-wrong";
    return "status-other";
  };

  return (
    <div className="submission-detail-container">
      {/* BÊN TRÁI: BẢNG TEST CASES & SOURCE CODE */}
      <div className="submission-main-content">
        <h2 className="submission-title">Test case</h2>
        
        <table className="testcase-table">
          <thead>
            <tr>
              <th style={{ width: '60px', textAlign: 'center' }}>#</th>
              <th>Trạng thái</th>
              <th>Điểm</th>
              <th>Thời gian (ms)</th>
              <th>Bộ nhớ (MB)</th>
            </tr>
          </thead>
          <tbody>
            {testCases.map((tc, index) => (
              <tr key={index}>
                <td style={{ textAlign: 'center', color: '#888' }}>{tc.test_id}</td>
                <td className={getStatusStyle(tc.status)}>
                  {tc.status === "Accepted" ? (
                    <span className="icon-check">✔ </span>
                  ) : (
                    <span className="icon-error">✘ {tc.status}</span>
                  )}
                </td>
                <td>{tc.score}</td>
                <td>{tc.time_limit}</td>
                <td>{tc.memory_limit}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PHẦN MÃ NGUỒN */}
        <div className="source-code-header-row">
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
            Mã nguồn
          </Typography>
          <button 
            className={`expand-btn ${isExpanded ? 'active' : ''}`}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <KeyboardArrowDownIcon />
          </button>
        </div>

        {isExpanded && detail.source_code && (
          <div className="source-code-wrapper">
            <div className="line-numbers">
              {codeLines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <pre className="code-display">
              <code>{detail.source_code}</code>
            </pre>
          </div>
        )}
      </div>

      {/* BÊN PHẢI: SIDEBAR THÔNG TIN CHI TIẾT */}
      <div className="submission-sidebar">
        <div className="sidebar-item">
          <span className="sidebar-label">Kết quả </span>
          <span className={`sidebar-value ${getStatusStyle(detail.result)}`} style={{ fontWeight: 'bold', fontSize: '18px' }}>
            {detail.result}
          </span>
        </div>

        <div className="sidebar-item">
          <span className="sidebar-label">Điểm số</span>
          <span className="sidebar-value" style={{ fontWeight: '700', fontSize: '24px', color: '#000' }}>
            {totalScore}
          </span>
        </div>

        <div className="sidebar-item">
          <span className="sidebar-label">Ngôn ngữ</span>
          <span className="sidebar-value">{detail.lang}</span>
        </div>

        <div className="sidebar-item">
          <span className="sidebar-label">Thời gian chạy</span>
          <span className="sidebar-value">{detail.submit_time} ms</span>
        </div>

        <div className="sidebar-item">
          <span className="sidebar-label">ID Bài tập</span>
          <span className="sidebar-value" style={{ color: '#3b82f6' }}>{detail.problem_id}</span>
        </div>

        <div className="sidebar-item">
          <span className="sidebar-label">Thời gian nộp</span>
          <span className="sidebar-value" style={{ fontSize: '13px', color: '#666' }}>
            {new Date(detail.created_at).toLocaleString('vi-VN')}
          </span>
        </div>
      </div>
    </div>
  );
}