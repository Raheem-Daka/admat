import { useState } from "react";
import { apiFetch } from "../api/api";
import { toast } from "sonner";

const RatingInput = ({ itemId, onRated, initialRating }) => {
  const [rating, setRating] = useState(initialRating || 0);
  const [loading, setLoading] = useState(false);

  const submitRating = async (value) => {

    if (loading) return

      setRating(value);
      setLoading(true);
    
  try {  
    const data = await apiFetch(`/reviews/${itemId}/`, {
        method: "POST",
        body: JSON.stringify({ rating: value }),
      });

      console.log("SUCCESS:", data);  

      // ✅ refresh parent
      if (onRated) onRated();

      toast.success(data.message || "Rating submitted ✅");

    } catch (error) {
      console.error(error);
      toast.error(error?.detail || "Failed to submit rating");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className={`flex gap-1 ${loading ? "opacity-50" : "cursor-pointer"}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          onClick={() => submitRating(star)}
          width="20"
          height="20"
          viewBox="0 0 18 17"
          fill={rating >= star ? "#ea4a00" : "#ccc"}
        >
          <path d="M8.049.927c.3-.921 1.603-.921 1.902 0l1.294 3.983a1 1 0 0 0 .951.69h4.188c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 0 0-.364 1.118l1.295 3.983c.299.921-.756 1.688-1.54 1.118L9.589 13.63a1 1 0 0 0-1.176 0l-3.389 2.46c-.783.57-1.838-.197-1.539-1.118L4.78 10.99a1 1 0 0 0-.363-1.118L1.028 7.41c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 0 0 .95-.69z"/>
        </svg>
      ))}
    </div>
  );
};

export default RatingInput;