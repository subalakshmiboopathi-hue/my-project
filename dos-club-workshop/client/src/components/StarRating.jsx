import React, { useState } from 'react';
import { Star } from 'lucide-react';

export const StarRating = ({
  rating = 0,
  maxRating = 5,
  interactive = false,
  onChange = () => {},
  size = 'w-4 h-4',
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }, (_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= displayRating;

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange(starValue)}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={`${
              interactive ? 'cursor-pointer transform hover:scale-110 transition-transform' : 'cursor-default'
            } focus:outline-none`}
          >
            <Star
              className={`${size} ${
                isFilled
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-slate-600 fill-transparent'
              } transition-colors`}
            />
          </button>
        );
      })}
    </div>
  );
};
