import React, { useEffect, useState } from "react";
import EventModal from "../Modal/EventModal";

const API_BASE = "https://6915405984e8bd126af939c3.mockapi.io/user";

export default function ShowList() {
    var [rows, setRows] = useState([]);      //행사 목록 저장 
    var [modalOpen, setModalOpen] = useState(false);        //모달 닫힘.
    var [isEditMode, setIsEditMode] = useState(false); // false=POST, true=PUT 한다.
    var [currentRow, setCurrentRow] = useState(null);  // 수정할때 선택되는 row

    useEffect(function () {
        loadList();
    }, []);

    function loadList() {
        fetch(API_BASE)
            .then(function (res) { return res.json(); })
            .then(function (data) { renderRows(data); })
            .catch(function () { alert("목록 조회 중 오류가 발생했습니다.");});
    }

    function renderRows(data) {
        setRows(data || []);
    }

    function openAddModal() {
        setIsEditMode(false);
        setCurrentRow(null);
        setModalOpen(true);
    }

    function openEditModal(id) {
        fetch(API_BASE + "/" + id)
            .then(function (res) { return res.json(); })
            .then(function (r) {
                setIsEditMode(true);
                setCurrentRow(r);
                setModalOpen(true);
            })
            .catch(function () {
                alert("상세 조회 중 오류가 발생했습니다.");
            });
    }

    function deleteEvent(id) {
        if (!window.confirm("정말 삭제할까요? (id: " + id + ")")) return;

        fetch(API_BASE + "/" + id, { method: "DELETE" })
            .then(function () {
                alert("삭제되었습니다.");
                loadList();
            })
            .catch(function () {
                alert("삭제 중 오류가 발생했습니다.");
            });
    }

    return (
        <div className="container my-4">
            <nav className="navbar bg-white border-bottom mb-3">
                <div className="container">
                    <span className="navbar-brand">전산전자공학부 학부행사 관리</span>
                </div>
            </nav>

            <div className="card mb-3" style={{ maxWidth: "800px", margin: "0 auto" }}>
                <div className="card-body">
                    <div className="d-flex justify-content-end align-items-center mb-2">
                        <button id="btn_add_open" className="btn btn-primary btn-sm" onClick={openAddModal}>+ 행사 추가</button>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th style={{ width: "60px" }}>id</th>
                                    <th>제목</th>
                                    <th style={{ width: "260px" }}>시간</th>
                                    <th>장소</th>
                                    <th style={{ width: "140px" }}>Actions</th>
                                </tr>
                            </thead>

                            <tbody id="tbody_list">
                                {rows.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center text-muted">데이터가 없습니다.</td>
                                    </tr>
                                )}

                                {rows.map(function (r) {
                                    var when = "";
                                    if (r.start) when += r.start;
                                    if (r.end) when += " ~ " + r.end;

                                    return (
                                        <tr key={r.id}>
                                            <td>{r.id || ""}</td>
                                            <td>{r.title || ""}</td>
                                            <td>{when || "-"}</td>
                                            <td>{r.location || ""}</td>
                                            <td>
                                                <button className="btn btn-sm btn-outline-primary me-1" onClick={function () { openEditModal(r.id); }}>수정</button>
                                                <button className="btn btn-sm btn-outline-danger" onClick={function () { deleteEvent(r.id); }}>삭제</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {modalOpen && (
                <EventModal
                    isEditMode={isEditMode}
                    currentRow={currentRow}
                    API_BASE={API_BASE}
                    onClose={function () { setModalOpen(false); }}
                    onSaved={function () {
                        setModalOpen(false);
                        loadList();
                    }}
                />
            )}
        </div>
    );
}
 
