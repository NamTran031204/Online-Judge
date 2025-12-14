import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRatings } from "../../redux/slices/rating-slice";

import "./rating.css";

// Dữ liệu giả định (Mock Data)
const mockRatingItems = [
  { user_id: 'user_A', old_rating: 1500, new_rating: 1620, diff: -120, rank: 1, performance: 1800 },
  { user_id: 'user_B', old_rating: 1800, new_rating: 1750, diff: 50, rank: 2, performance: 1650 },
  { user_id: 'user_C', old_rating: 1200, new_rating: 1300, diff: -100, rank: 3, performance: 1400 },
  { user_id: 'user_D', old_rating: 2000, new_rating: 1950, diff: 50, rank: 4, performance: 1750 },
  { user_id: 'user_E', old_rating: 1100, new_rating: 1100, diff: 0, rank: 5, performance: 1100 },
];

export default function RatingList() {
  const { contest_id } = useParams();
  const dispatch = useDispatch();
  const { items: fetchedItems, loading } = useSelector((state) => state.ratings);

  useEffect(() => {
    if (contest_id) {
        dispatch(fetchRatings({ contest_id }));
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
          Ratings — Contest #{contest_id}
        </h5>

        <table className="rating-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Old Rating</th>
              <th>New Rating</th>
              <th>Rating Diff</th>
              <th>Rank</th>
              <th>Performance</th>
            </tr>
          </thead>

          <tbody>
            {items.map((r) => (
              <tr key={r.user_id}>
                <td className="user-id-cell">{r.user_id}</td>
                <td>{r.old_rating}</td>
                <td>{r.new_rating}</td>

                <td className={r.diff >= 0 ? "rating-up" : "rating-down"}>
                  {r.diff >= 0 ? "+" : ""}
                  {r.diff}
                </td>

                <td>{r.rank}</td>
                <td>{r.performance}</td>
              </tr>
            ))}
            {items.length === 0 && fetchedItems.length === 0 && (
                <tr>
                    <td colSpan="6" className="no-data">
                        Không có dữ liệu xếp hạng nào.
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