SET NAMES utf8mb4;

-- 1. role
CREATE TABLE role (
    role_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    role_name ENUM(
        'Admin','Normal_User','Pro_User',
        'Author','Tester','Participants',
        'Group_Admin','Group_Member'
    )
);

-- 2. permission
CREATE TABLE permission (
    permission_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    permission_name VARCHAR(255)
);

-- 3. user_details
CREATE TABLE user_details (
    user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    info JSON
);

-- 4. role_permission
CREATE TABLE role_permission (
    role_id BIGINT,
    permission_id BIGINT,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES role(role_id),
    FOREIGN KEY (permission_id) REFERENCES permission(permission_id)
);

-- 5. role_user
CREATE TABLE role_user (
    role_id BIGINT,
    user_id BIGINT,
    scope_id BIGINT NULL,
    scope_type ENUM('System','Contest','Problem','Group'),
    PRIMARY KEY (role_id, user_id, scope_type),
    FOREIGN KEY (role_id) REFERENCES role(role_id),
    FOREIGN KEY (user_id) REFERENCES user_details(user_id)
);

-- 6. auth_refresh_token
CREATE TABLE auth_refresh_token (
    token_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    refresh_token VARCHAR(255),
    issued_at DATETIME,
    expired_at DATETIME,
    revoked BOOLEAN DEFAULT FALSE,
    ip_addr VARCHAR(64),
    FOREIGN KEY (user_id) REFERENCES user_details(user_id)
);

-- 7. group
CREATE TABLE `group` (
    group_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    group_name VARCHAR(255),
    description TEXT,
    avatar VARCHAR(255),
    created_by BIGINT,
    created_at DATETIME,
    FOREIGN KEY (created_by) REFERENCES user_details(user_id)
);

-- 8. contest
CREATE TABLE contest (
    contest_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255),
    description TEXT,
    start_time DATETIME,
    duration INT,
    contest_status ENUM('Upcoming','Running','Finished'),
    contest_type ENUM('Draft','Gym','Official'),
    author BIGINT,
    rated BOOLEAN DEFAULT FALSE,
    visibility ENUM('public','private') DEFAULT 'private',
    group_id BIGINT
);

-- 9. submission_result
CREATE TABLE submission_result (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    contest_id BIGINT,
    result ENUM('SKIPPED','PENDING','AC','WA','TLE','MLE','CE'),
    submission_id VARCHAR(64),
    status ENUM('IN_CONTEST','PRACTICE'),
    created_at DATETIME
);

-- 10. contest_problem
CREATE TABLE contest_problem (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    contest_id BIGINT,
    problem_id VARCHAR(64)
);

-- 11. contest_registration
CREATE TABLE contest_registration (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    contest_id BIGINT,
    user_id BIGINT,
    registered_at DATETIME
);

-- 12. contest_participants
CREATE TABLE contest_participants (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    contest_id BIGINT,
    user_id BIGINT,
    penalty INT,
    total_score INT,
    ranking INT
);

-- 13. contest_testers
CREATE TABLE contest_testers (
    contest_id BIGINT,
    user_id BIGINT,
    total_score INT,
    PRIMARY KEY (contest_id, user_id),
    FOREIGN KEY (contest_id) REFERENCES contest(contest_id),
    FOREIGN KEY (user_id) REFERENCES user_details(user_id)
);

-- 14. tester_feedback
CREATE TABLE tester_feedback (
    problem_id VARCHAR(64),
    contest_id BIGINT,
    user_id BIGINT,
    `like` BOOLEAN,
    comment_id BIGINT,
    PRIMARY KEY (problem_id, contest_id, user_id),
    FOREIGN KEY (contest_id) REFERENCES contest(contest_id),
    FOREIGN KEY (user_id) REFERENCES user_details(user_id)
);

-- 15. contest_invitation
CREATE TABLE contest_invitation (
    invite_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    contest_id BIGINT,
    inviter_id BIGINT,
    invitee_id BIGINT,
    status ENUM('ACCEPTED','DECLINED','PENDING','EXPIRED')
);

-- 16. comment
CREATE TABLE comment (
    comment_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    contents TEXT,
    is_deleted BOOLEAN,
    parent_id BIGINT,
    source_id VARCHAR(64),
    type ENUM('tester_comment','official_comment'),
    FOREIGN KEY (user_id) REFERENCES user_details(user_id)
);

-- 17. user_rating_history
CREATE TABLE user_rating_history (
    user_id BIGINT,
    contest_id BIGINT,
    rating INT,
    delta INT,
    PRIMARY KEY (user_id, contest_id),
    FOREIGN KEY (user_id) REFERENCES user_details(user_id),
    FOREIGN KEY (contest_id) REFERENCES contest(contest_id)
);

-- 18. user_friendship
CREATE TABLE user_friendship (
    user_id BIGINT,
    friend_id BIGINT,
    status ENUM('ACCEPTED','BLOCKED'),
    PRIMARY KEY (user_id, friend_id),
    FOREIGN KEY (user_id) REFERENCES user_details(user_id),
    FOREIGN KEY (friend_id) REFERENCES user_details(user_id)
);

-- 19. group_member
CREATE TABLE group_member (
    group_id BIGINT,
    user_id BIGINT,
    invite_by_user_id BIGINT,
    joined_at DATETIME,
    PRIMARY KEY (group_id, user_id),
    FOREIGN KEY (group_id) REFERENCES `group`(group_id),
    FOREIGN KEY (user_id) REFERENCES user_details(user_id)
);

-- 20. group_invitation
CREATE TABLE group_invitation (
    invite_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    group_id BIGINT,
    inviter_id BIGINT,
    invitee_id BIGINT,
    status ENUM('PENDING','ACCEPTED','DECLINED','EXPIRED'),
    FOREIGN KEY (group_id) REFERENCES `group`(group_id),
    FOREIGN KEY (inviter_id) REFERENCES user_details(user_id),
    FOREIGN KEY (invitee_id) REFERENCES user_details(user_id)
);
