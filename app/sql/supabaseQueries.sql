-- check duplicates when updating rez
CREATE OR REPLACE FUNCTION check_duplicate_reservations(reservation_id int, user_id uuid)
  RETURNS TABLE(
    id int,
    reservation_date date,
    time_slot_id int
  )
  AS $$
BEGIN
  RETURN query
  SELECT
    r.id,
    r.date AS reservation_date,
    r.time_slot_id
  FROM
    reservations r
  WHERE
    r.user_id = check_duplicate_reservations.user_id
    AND r.date =(
      SELECT
        r2.date
      FROM
        reservations r2
      WHERE
        r2.id = check_duplicate_reservations.reservation_id)
    AND r.time_slot_id =(
      SELECT
        r2.time_slot_id
      FROM
        reservations r2
      WHERE
        r2.id = check_duplicate_reservations.reservation_id);
END;
$$
LANGUAGE plpgsql;

