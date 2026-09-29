SELECT b.beer_id, b.name, br.brand_id, br.website
FROM beer b
JOIN brand br ON b.brand_id = br.brand_id
WHERE b.alcohol_content > 5
  AND b.beer_kind = 'lager'
  AND br.country_of_origin = 'USA';
