SELECT b.beer_id, b.name
FROM beer b
WHERE b.beer_id NOT IN (
    SELECT ohb.beer_id
    FROM orderhasbeer ohb
);
