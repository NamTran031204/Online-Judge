import React, { useEffect, useState } from "react";
import {Link, useParams} from "react-router-dom";
import {
    Box, Typography, CircularProgress, Modal, Backdrop, Fade, IconButton
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CloseIcon from '@mui/icons-material/Close';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import InfoIcon from '@mui/icons-material/Info';

import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import cpp from 'react-syntax-highlighter/dist/esm/languages/hljs/cpp';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import java from 'react-syntax-highlighter/dist/esm/languages/hljs/java';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import { getSubmissionDetail, clearSubmissionDetail } from "../../redux/slices/submission-slice";
import { useGetProblemDetailQuery } from "../../services/problemApi";
import { SERVER_URL } from '../../config/config';
import "./submission-detail.css";
import {ArrowLeft} from "lucide-react";

SyntaxHighlighter.registerLanguage('cpp', cpp);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('java', java);

export default function SubmissionDetail() {
    const { submission_id } = useParams();
    const dispatch = useDispatch();
    const [isExpanded, setIsExpanded] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [selectedTestCase, setSelectedTestCase] = useState(null);

    // State để lưu nội dung đã download
    const [sourceCodeContent, setSourceCodeContent] = useState("");
    const [loadingSourceCode, setLoadingSourceCode] = useState(false);

    const { detail, loading, error } = useSelector((state) => state.submission);

    // Fetch problem detail to get testcase input/output
    const { data: problemData } = useGetProblemDetailQuery(detail?.problem_id, {
        skip: !detail?.problem_id,
    });

    const problemTestcases = problemData?.data?.testcaseEntities || [];

    // Hàm download file từ Minio
    const downloadFile = async (objectName) => {
        if (!objectName) return "N/A";

        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch(`${SERVER_URL}/file/download/${objectName}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error("Download failed");
            }

            return await res.text();
        } catch (err) {
            console.error("Download error:", err);
            return "Error loading content";
        }
    };

    useEffect(() => {
        if (submission_id) dispatch(getSubmissionDetail(submission_id));
        return () => dispatch(clearSubmissionDetail());
    }, [submission_id, dispatch]);

    // Download source code khi detail đã load
    useEffect(() => {
        const loadSourceCode = async () => {
            if (detail?.source_code) {
                setLoadingSourceCode(true);
                const content = await downloadFile(detail.source_code);
                setSourceCodeContent(content);
                setLoadingSourceCode(false);
            }
        };

        loadSourceCode();
    }, [detail?.source_code]);

    const getLanguageMode = (lang) => {
        if (!lang) return "cpp";
        const l = lang.toLowerCase();
        if (l.includes("python")) return "python";
        if (l.includes("java")) return "java";
        return "cpp";
    };

    const handleCopy = (text) => {
        if (text) navigator.clipboard.writeText(text);
    };

    // Map submission testcase với problem testcase và download content
    const handleOpenModal = async (tc, index) => {
        const problemTestcase = problemTestcases[index];

        // Download input và expected output từ problem testcase
        const [inputContent, expectedOutputContent, actualOutputContent] = await Promise.all([
            downloadFile(problemTestcase?.input),
            downloadFile(problemTestcase?.output),
            downloadFile(tc?.output)
        ]);

        setSelectedTestCase({
            ...tc,
            input: inputContent,
            expectedOutput: expectedOutputContent,
            output: actualOutputContent,
        });
        setOpenModal(true);
    };

    if (loading) return <Box textAlign="center" mt={10}><CircularProgress /></Box>;
    if (error || !detail) return <Box textAlign="center" mt={10}><Typography color="error">Không tìm thấy dữ liệu</Typography></Box>;

    return (
        <div className="submission-detail-container">
            <div className="submission-main-content">
                <Link
                    to={`/problem/${detail?.problem_id}`}
                    className="back-link"
                >
                    <ArrowLeft size={16} />
                    Back
                </Link>
                <h2 className="submission-title">Test case</h2>
                <table className="testcase-table">
                    <thead>
                    <tr>
                        <th style={{ width: '80px', textAlign: 'center' }}>Tính điểm</th>
                        <th>Điểm</th>
                        <th>Thông báo</th>
                        <th>Thời gian chạy (s)</th>
                        <th>Bộ nhớ (Kb)</th>
                        <th style={{ textAlign: 'center' }}>Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Array.isArray(detail.testcases) && detail.testcases.length > 0 ? (
                        detail.testcases.map((tc, index) => (
                            <tr key={index} className={index % 2 === 0 ? "" : "row-highlight"}>
                                <td style={{ textAlign: "center" }}>
                                    {tc.status === "AC"
                                        ? <span className="check-icon">✔</span>
                                        : <span className="cross-icon">✘</span>}
                                </td>
                                <td>—</td>
                                <td className={tc.status === "AC" ? "status-accepted" : "status-wrong"}>
                                    {tc.status}
                                </td>
                                <td>{tc.time}</td>
                                <td>{tc.memory}</td>
                                <td style={{ textAlign: "center" }}>
                                    <IconButton
                                        onClick={() => handleOpenModal(tc, index)}
                                        className="icon-info-btn"
                                    >
                                        <InfoIcon />
                                    </IconButton>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} style={{ textAlign: "center" }}>
                                Chưa có test case
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>

                <div className="source-code-header-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>Mã nguồn</Typography>
                        <KeyboardArrowDownIcon
                            className={`expand-icon ${isExpanded ? '' : 'collapsed'}`}
                            onClick={() => setIsExpanded(!isExpanded)}
                            style={{ cursor: 'pointer', color: '#3b82f6' }}
                        />
                    </div>
                </div>

                {isExpanded && (
                    <div className="code-editor-container">
                        {loadingSourceCode ? (
                            <Box textAlign="center" p={3}>
                                <CircularProgress size={24} />
                                <Typography variant="body2" mt={1}>Loading source code...</Typography>
                            </Box>
                        ) : (
                            <SyntaxHighlighter
                                language={getLanguageMode(detail.lang)}
                                style={atomOneDark}
                                showLineNumbers={true}
                                customStyle={{ margin: 0, padding: '20px', borderRadius: '8px', fontSize: '14px', backgroundColor: '#282c34' }}
                                lineNumberStyle={{ color: '#636d83', paddingRight: '20px', minWidth: '35px', textAlign: 'right' }}
                            >
                                {sourceCodeContent || ""}
                            </SyntaxHighlighter>
                        )}
                    </div>
                )}
            </div>

            <div className="submission-sidebar">
                <div className="sidebar-card">
                    <div className="sidebar-item">
                        <span className="sidebar-label">KẾT QUẢ </span>
                        <span className="sidebar-value result-highlight">
              {detail.allAccepted ? "AC" : "WA"}
            </span>

                    </div>
                    <div className="sidebar-item">
                        <span className="sidebar-label">ĐIỂM SỐ</span>
                        <span className="sidebar-value score-text">{detail.score || 0}</span>
                    </div>
                    <div className="sidebar-item"><span className="sidebar-label">NGÔN NGỮ</span><span className="sidebar-value">{detail.lang}</span></div>
                    <div className="sidebar-item"><span className="sidebar-label">ID BÀI TẬP</span><span className="sidebar-value link-text">{detail.problem_id}</span></div>
                    <div className="sidebar-item"><span className="sidebar-label">THỜI GIAN NỘP</span><span className="sidebar-value time-text">{new Date(detail.created_at).toLocaleString()}</span></div>
                </div>
            </div>

            <Modal open={openModal} onClose={() => setOpenModal(false)} closeAfterTransition slots={{ backdrop: Backdrop }}>
                <Fade in={openModal}>
                    <Box className="testcase-modal-custom">
                        <div className="modal-header-custom">
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>Xem chi tiết</Typography>
                            <IconButton onClick={() => setOpenModal(false)} size="small"><CloseIcon /></IconButton>
                        </div>
                        <div className="modal-body-custom">
                            {!selectedTestCase ? (
                                <Box textAlign="center" p={3}>
                                    <CircularProgress size={24} />
                                    <Typography variant="body2" mt={1}>Loading test case data...</Typography>
                                </Box>
                            ) : (
                                <>
                                    <div className="output-row">
                                        <div className="output-column">
                                            <Typography className="label-text">Đầu ra đúng</Typography>
                                            <div className="data-box-small">
                                                <code>{selectedTestCase?.expectedOutput ?? "N/A"}</code>
                                                <button
                                                    className="copy-btn-inner"
                                                    onClick={() => handleCopy(selectedTestCase?.expectedOutput)}
                                                >
                                                    <ContentPasteIcon fontSize="inherit" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="output-column">
                                            <Typography className="label-text">Đầu ra chương trình</Typography>
                                            <div className="data-box-small">
                                                <code>{selectedTestCase?.output ?? "N/A"}</code>
                                                <button
                                                    className="copy-btn-inner"
                                                    onClick={() => handleCopy(selectedTestCase?.output)}
                                                >
                                                    <ContentPasteIcon fontSize="inherit" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="input-section">
                                        <Typography className="label-text">Đầu vào</Typography>
                                        <div className="data-box-large">
                                            <pre>{selectedTestCase?.input || "N/A"}</pre>
                                            <button className="copy-btn-inner" onClick={() => handleCopy(selectedTestCase?.input)}><ContentPasteIcon fontSize="inherit" /></button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}