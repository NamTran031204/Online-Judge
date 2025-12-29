import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRatings } from "../../redux/slices/rating-slice"; 

import "./rating.css";

const mockRatingItems = [
  { user_id: 'user_A', contest_id: 'C101', rating: 1620, delta: 120 },
  { user_id: 'user_B', contest_id: 'C101', rating: 1750, delta: -50 },
  { user_id: 'user_C', contest_id: 'C101', rating: 1300, delta: 100 },
  { user_id: 'user_D', contest_id: 'C101', rating: 1950, delta: -50 },
  { user_id: 'user_E', contest_id: 'C101', rating: 1100, delta: 0 },
];

export default function RatingList() {
  const { contest_id } = useParams();
  const dispatch = useDispatch();
  const { items: fetchedItems, loading } = useSelector((state) => state.ratings);

  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    if (contest_id) {
        dispatch(fetchRatings({ contest_id, pageRequest: { page, size: pageSize } }));
    }
  }, [contest_id, dispatch, page]);

  const items = fetchedItems.length > 0 ? fetchedItems : mockRatingItems;
  const totalPages = 1; 

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="rating-page">
      {/* Header đồng bộ với ProblemList */}
      <div className="rating-header-section">
        <h1>Rating History</h1>
        <p className="subtitle">
          View rating changes and standings for {contest_id || "the contest"}
        </p>
      </div>

      {/* Table Wrapper */}
      <div className="rating-table-wrapper">
        <table className="rating-table">
          <thead>
            <tr>
              <th className="col-user">User ID</th>
              <th className="col-contest">Contest ID</th>
              <th>Rating Mới (Sau Contest)</th>
              <th className="col-delta">Rating Delta</th>
            </tr>
          </thead>

          <tbody>
            {items.map((r, index) => (
              <tr key={`${r.user_id}-${index}`}>
                <td className="user-id-cell">{r.user_id}</td>
                <td className="contest-id-cell">{r.contest_id}</td>
                <td className="rating-cell">{r.rating}</td>
                
                {/* Logic đổi màu Delta */}
                <td className={
                    r.delta > 0 ? "rating-up" : 
                    r.delta < 0 ? "rating-down" : 
                    "rating-zero"
                }>
                  {r.delta > 0 ? `+${r.delta}` : r.delta}
                </td>
              </tr>
            ))}

            {items.length === 0 && (
                <tr>
                    <td colSpan="4" className="empty">
                        Không có dữ liệu lịch sử xếp hạng nào.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button 
          disabled={page === 1} 
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={page === i + 1 ? "active" : ""}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}