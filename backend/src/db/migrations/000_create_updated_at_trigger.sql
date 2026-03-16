-- 000: Reusable updated_at trigger function
-- Applied to any table with an updated_at column

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
