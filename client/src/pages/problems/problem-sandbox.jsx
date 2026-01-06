import { useState } from "react";
import {
    useCreateProblemMutation,
    useUpdateProblemMutation,
    useDeleteProblemMutation,
    useSearchProblemsQuery,
} from "../../services/problemApi";

import Pagination from "../../components/pagination/pagination";

import {
    Plus,
    Edit,
    Trash2,
    X,
    FileCode,
} from "lucide-react";

import "./problem-sandbox.css";
import { SERVER_URL } from '../../config/config';

const PAGE_SIZE = 10;

const emptyProblem = {
    problemId: null,
    title: "",
    description: "",
    timeLimit: 1000,
    memoryLimit: 256,
    tags: [],
    score: 100,
    rating: 1500,
    solution: "",
    testcaseEntities: [],
    supportedLanguage: ["CPP", "PYTHON", "JAVA"],
    level: "MEDIUM",
    inputType: "stdin",
    outputType: "stdout",
};

export default function ProblemSandbox() {
    const [page, setPage] = useState(1);

    const { data, isLoading } = useSearchProblemsQuery({
        maxResultCount: PAGE_SIZE,
        skipCount: (page - 1) * PAGE_SIZE,
        sorting: "createdAt desc",
        filter: {},
    });

    const [createProblem] = useCreateProblemMutation();
    const [updateProblem] = useUpdateProblemMutation();
    const [deleteProblem] = useDeleteProblemMutation();

    const problems = data?.data?.data || [];
    const totalCount = data?.data?.totalCount || 0;

    const [editing, setEditing] = useState(null);
    const [tagInput, setTagInput] = useState("");

    const uploadFile = async (content, filename) => {
        const file = new File([content], filename, { type: "text/plain" });
        const formData = new FormData();
        formData.append("file", file);

        const token = localStorage.getItem("accessToken");
        const res = await fetch(`${SERVER_URL}/file/upload`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");
        const json = await res.json();
        return json.data;
    };

    const openCreate = () => {
        setEditing({ ...emptyProblem });
        setTagInput("");
    };

    const openEdit = (p) => {
        setEditing({
            ...emptyProblem,
            ...p,
            tags: p.tags ?? [],
            testcaseEntities: p.testcaseEntities ?? [],
        });
        setTagInput("");
    };

    const closeModal = () => {
        setEditing(null);
        setTagInput("");
    };

    const addTestcase = () => {
        setEditing({
            ...editing,
            testcaseEntities: [
                ...editing.testcaseEntities,
                {
                    testcaseName: `Test ${editing.testcaseEntities.length + 1}`,
                    input: "",
                    output: "",
                    isSample: false,
                    description: "",
                },
            ],
        });
    };

    const updateTestcase = (index, field, value) => {
        const updated = [...editing.testcaseEntities];
        updated[index][field] = value;
        setEditing({ ...editing, testcaseEntities: updated });
    };

    const removeTestcase = (index) => {
        const updated = editing.testcaseEntities.filter((_, i) => i !== index);
        setEditing({ ...editing, testcaseEntities: updated });
    };

    const handleSave = async () => {
        if (!editing.title) {
            alert("Title is required");
            return;
        }

        try {
            const uploadedTestcases = await Promise.all(
                editing.testcaseEntities.map(async (tc) => {
                    const inputObjectName = tc.input
                        ? await uploadFile(tc.input, `input_${Date.now()}.txt`)
                        : null;
                    const outputObjectName = tc.output
                        ? await uploadFile(tc.output, `output_${Date.now()}.txt`)
                        : null;

                    return {
                        testcaseName: tc.testcaseName,
                        input: inputObjectName,
                        output: outputObjectName,
                        isSample: tc.isSample,
                        description: tc.description || "",
                    };
                })
            );

            const payload = {
                title: editing.title,
                description: editing.description,
                tags: editing.tags ?? [],
                imageUrls: [],
                level: editing.level,
                supportedLanguage: editing.supportedLanguage,
                solution: editing.solution,
                rating: Number(editing.rating),
                score: Number(editing.score),
                timeLimit: Number(editing.timeLimit),
                memoryLimit: Number(editing.memoryLimit),
                inputType: editing.inputType,
                outputType: editing.outputType,
                testcaseEntities: uploadedTestcases,
            };

            if (editing.problemId) {
                await updateProblem({
                    problem_id: editing.problemId,
                    data: payload,
                }).unwrap();
            } else {
                await createProblem(payload).unwrap();
            }

            closeModal();
        } catch (e) {
            console.error(e);
            alert("Save problem failed: " + e.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this problem?")) return;
        await deleteProblem(id).unwrap();
    };

    return (
        <div className="ps-container">
            <div className="ps-header">
                <div>
                    <h1>Problem Sandbox</h1>
                    <p>Create and manage problems</p>
                </div>
                <button className="btn-primary" onClick={openCreate}>
                    <Plus size={16} /> Create Problem
                </button>
            </div>

            {!isLoading && problems.length === 0 && !editing && (
                <div className="ps-empty">
                    <FileCode size={56} />
                    <h3>No problems yet</h3>
                    <button className="btn-outline" onClick={openCreate}>
                        <Plus size={16} /> Create Problem
                    </button>
                </div>
            )}

            {problems.length > 0 && (
                <>
                    <div className="ps-card">
                        <table className="ps-table">
                            <thead>
                            <tr>
                                <th className="ps-col-id">ID</th>
                                <th className="ps-col-title">Title</th>
                                <th className="ps-col-score">Score</th>
                                <th className="ps-col-rating">Rating</th>
                                <th className="ps-col-testcase">Testcases</th>
                                <th />
                            </tr>
                            </thead>
                            <tbody>
                            {problems.map((p) => (
                                <tr key={p.problemId}>
                                    <td className="mono">{p.problemId}</td>
                                    <td className="bold">{p.title}</td>
                                    <td>{p.score}</td>
                                    <td>{p.rating}</td>
                                    <td>{p.testcaseEntities?.length || 0}</td>
                                    <td className="actions">
                                        <button onClick={() => openEdit(p)} className="sandbox-actions">
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            className="danger sandbox-actions"
                                            onClick={() => handleDelete(p.problemId)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {totalCount > PAGE_SIZE && (
                        <Pagination
                            page={page}
                            pageSize={PAGE_SIZE}
                            total={totalCount}
                            onPageChange={setPage}
                        />
                    )}
                </>
            )}

            {editing && (
                <div className="ps-modal-backdrop">
                    <div className="ps-modal">
                        <div className="ps-modal-header">
                            <h3>
                                {editing.problemId ? "Edit Problem" : "Create Problem"}
                            </h3>
                            <button onClick={closeModal} className="sandbox-actions">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="ps-modal-body">
                            <label>Title *</label>
                            <input
                                value={editing.title}
                                onChange={(e) =>
                                    setEditing({ ...editing, title: e.target.value })
                                }
                            />

                            <label>Description</label>
                            <textarea
                                value={editing.description}
                                onChange={(e) =>
                                    setEditing({ ...editing, description: e.target.value })
                                }
                            />

                            <div className="grid-2">
                                <div>
                                    <label>Time Limit (ms)</label>
                                    <input
                                        type="number"
                                        value={editing.timeLimit}
                                        onChange={(e) =>
                                            setEditing({
                                                ...editing,
                                                timeLimit: +e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div>
                                    <label>Memory Limit (MB)</label>
                                    <input
                                        type="number"
                                        value={editing.memoryLimit}
                                        onChange={(e) =>
                                            setEditing({
                                                ...editing,
                                                memoryLimit: +e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="grid-2">
                                <div>
                                    <label>Score</label>
                                    <input
                                        type="number"
                                        value={editing.score}
                                        onChange={(e) =>
                                            setEditing({
                                                ...editing,
                                                score: +e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div>
                                    <label>Rating</label>
                                    <input
                                        type="number"
                                        value={editing.rating}
                                        onChange={(e) =>
                                            setEditing({
                                                ...editing,
                                                rating: +e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <label>Level</label>
                            <select
                                value={editing.level}
                                onChange={(e) =>
                                    setEditing({ ...editing, level: e.target.value })
                                }
                            >
                                <option value="EASY">Easy</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HARD">Hard</option>
                            </select>

                            <label>Tags</label>
                            <div className="tag-row">
                                <input
                                    placeholder="Add tag"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                />
                                <button
                                    className="btn-outline"
                                    onClick={() => {
                                        if (!tagInput) return;
                                        setEditing({
                                            ...editing,
                                            tags: [...editing.tags, tagInput],
                                        });
                                        setTagInput("");
                                    }}
                                >
                                    Add
                                </button>
                            </div>

                            {editing.tags.length > 0 && (
                                <div className="tag-list">
                                    {editing.tags.map((t) => (
                                        <span key={t} className="tag">
                      {t}
                    </span>
                                    ))}
                                </div>
                            )}

                            <div className="section-header">
                                <h4>Testcases</h4>
                                <button className="btn-outline" onClick={addTestcase}>
                                    + Add Testcase
                                </button>
                            </div>

                            {editing.testcaseEntities.map((tc, i) => (
                                <div className="card" key={i}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <strong>{tc.testcaseName}</strong>
                                        <button
                                            className="btn-outline danger"
                                            onClick={() => removeTestcase(i)}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>

                                    <label>Testcase Name</label>
                                    <input
                                        value={tc.testcaseName}
                                        onChange={(e) =>
                                            updateTestcase(i, "testcaseName", e.target.value)
                                        }
                                    />

                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={tc.isSample}
                                            onChange={(e) =>
                                                updateTestcase(i, "isSample", e.target.checked)
                                            }
                                        />
                                        {" "}Is Sample (visible to users)
                                    </label>

                                    <label>Description</label>
                                    <input
                                        value={tc.description}
                                        onChange={(e) =>
                                            updateTestcase(i, "description", e.target.value)
                                        }
                                    />

                                    <div className="grid-2">
                                        <div>
                                            <label>Input</label>
                                            <textarea
                                                placeholder="Input content"
                                                value={tc.input}
                                                onChange={(e) =>
                                                    updateTestcase(i, "input", e.target.value)
                                                }
                                            />
                                        </div>
                                        <div>
                                            <label>Output</label>
                                            <textarea
                                                placeholder="Output content"
                                                value={tc.output}
                                                onChange={(e) =>
                                                    updateTestcase(i, "output", e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <label>Solution Code (for validation)</label>
                            <textarea
                                value={editing.solution}
                                onChange={(e) =>
                                    setEditing({
                                        ...editing,
                                        solution: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="ps-modal-footer">
                            <button className="btn-outline" onClick={closeModal}>
                                Cancel
                            </button>
                            <button className="btn-primary" onClick={handleSave}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}