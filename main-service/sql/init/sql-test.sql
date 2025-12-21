USE online_judge;
INSERT INTO role (role_name)
VALUES ('Author');

INSERT INTO permission (permission_name)
VALUES 
    ('contest:edit'),
    ('contest:invite'),
    ('contest:tester_comment'),
    ('contest:participants_comment');

INSERT INTO role_permission (role_id, permission_id) VALUES
    (2, 5),
    (2, 6),
    (2, 7),
    (2, 8);
ALTER TABLE contest 
MODIFY contest_status ENUM('UPCOMING','RUNNING','FINISHED') NOT NULL;
ALTER TABLE contest
MODIFY contest_type ENUM('DRAFT','GYM','OFFICIAL') NOT NULL;

ALTER TABLE contest
MODIFY visibility ENUM('PRIVATE','PUBLIC') NOT NULL;

USE online_judge;

INSERT INTO permission (permission_name) VALUES
    ('problem:view'),
    ('problem:edit'),
    ('problem:delete');contest_problem
    
INSERT INTO role_permission (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM role r, permission p
WHERE r.role_name = 'Author'
  AND p.permission_name IN ('problem:view', 'problem:edit', 'problem:delete');


