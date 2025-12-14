import { useParams } from "react-router-dom";
import { useEffect } from "react";
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

  useEffect(() => {
    if (contest_id) {
        dispatch(fetchRatings({ contest_id, pageRequest: {} }));
    }
  }, [contest_id, dispatch]);

  const items = fetchedItems.length > 0 ? fetchedItems : mockRatingItems;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="rating-page">
      <div className="content-container"> 
        
        <h5 className="rating-header">
          Rating History — Contest #{contest_id}
        </h5>

        <table className="rating-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Contest ID</th>
              <th>Rating Mới (Sau Contest)</th>
              <th>Rating Delta</th>
            </tr>
          </thead>

          <tbody>
            {items.map((r, index) => (
              <tr key={`${r.user_id}-${index}`}>
                <td className="user-id-cell">{r.user_id}</td>
                <td>{r.contest_id}</td>
                <td>{r.rating}</td>
                
                <td className={r.delta >= 0 ? "rating-up" : "rating-down"}>
                  {r.delta >= 0 ? "+" : ""}
                  {r.delta}
                </td>
              </tr>
            ))}
            {items.length === 0 && fetchedItems.length === 0 && (
                <tr>
                    <td colSpan="4" className="no-data">
                        Không có dữ liệu lịch sử xếp hạng nào.
                    </td>
                </tr>
            )}
          </tbody>
        </table>

        <div className="pagination-container">
          <span className="pagination-text">Prev</span>
          <button className="pagination-button">1</button>
          <span className="pagination-text">Next</span>
        </div>
      </div>
    </div>
  );
}