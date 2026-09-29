SELECT c.customer_id, c.first_name, c.last_name
FROM customer c
WHERE c.customer_id NOT IN (
    SELECT crb.customer_id
    FROM customerreviewsbeer crb
);
