SELECT beer_id, AVG(rating) AS avgRating
FROM customerreviewsbeer
GROUP BY beer_id;
