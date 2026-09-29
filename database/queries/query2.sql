SELECT crb.comment AS description, crb.rating
FROM customerreviewsbeer crb
JOIN customer c ON crb.customer_id = c.customer_id
JOIN beer b ON crb.beer_id = b.beer_id
JOIN brand br ON b.brand_id = br.brand_id
WHERE c.country = 'Greece'
  AND (crb.rating > 4 OR crb.rating < 1)
  AND (br.name = 'Guinness' OR br.name = 'Murphy');
