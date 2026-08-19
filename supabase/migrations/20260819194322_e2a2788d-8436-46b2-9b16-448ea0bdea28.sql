insert into public.user_roles (user_id, role) 
values ('e67ff4c7-bbe3-49d6-bb10-7d664f05a67f', 'admin')
on conflict (user_id, role) do nothing;