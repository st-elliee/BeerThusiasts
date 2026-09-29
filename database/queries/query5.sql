SELECT b.beer_id, b.name
FROM beer b
WHERE b.beer_kind = 'lager'
  AND b.alcohol_content > 6;
