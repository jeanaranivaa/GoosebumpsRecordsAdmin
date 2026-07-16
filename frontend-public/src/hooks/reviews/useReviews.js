import { useState, useEffect, useCallback } from "react";
import apiClient from "../../api/apiClient";

export const useReviews = (vinylId) => {
  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReviews = useCallback(async () => {
    if (!vinylId) return;

    setLoading(true);
    setError(null);

    try {
      const res = await apiClient.get(`/reviews/vinyl/${vinylId}`);

      setReviews(res.data.reviews);
      setAverage(res.data.average);
      setTotal(res.data.total);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [vinylId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const saveReview = useCallback(
    async ({ userId, rating, comment }) => {
      const res = await apiClient.post("/reviews", {
        vinylId,
        userId,
        rating,
        comment,
      });

      await fetchReviews();
      return res.data;
    },
    [vinylId, fetchReviews]
  );

  return { reviews, average, total, loading, error, saveReview };
};
