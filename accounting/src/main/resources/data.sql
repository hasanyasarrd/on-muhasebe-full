INSERT INTO persons (name, role, monthly_cost)
SELECT 'Kübra S.', 'Project Manager', 12000
    WHERE NOT EXISTS (
    SELECT 1 FROM persons WHERE name = 'Kübra S.'
);

