CREATE DATABASE IF NOT EXISTS `online_judge` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `online_judge`;

-- Bảng user_details
CREATE TABLE `user_details` (
  `user_id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_name` VARCHAR(255) DEFAULT NULL,
  `email` VARCHAR(255) DEFAULT NULL,
  `password` VARCHAR(255) DEFAULT NULL,
  `info` JSON DEFAULT NULL,
  `is_deleted` TINYINT(1) DEFAULT '0',
  PRIMARY KEY (`user_id`)
);

-- Bảng permission
CREATE TABLE `permission` (
  `permission_id` BIGINT NOT NULL AUTO_INCREMENT,
  `permission_name` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`permission_id`)
);

-- Bảng role
CREATE TABLE `role` (
  `role_id` BIGINT NOT NULL AUTO_INCREMENT,
  `role_name` ENUM('Admin','Normal_User','Pro_User','Author','Tester','Participants','Group_Admin','Group_Member') DEFAULT NULL,
  PRIMARY KEY (`role_id`)
);

-- Bảng role_permission (thêm id PK)
CREATE TABLE `role_permission` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `role_id` BIGINT NOT NULL,
  `permission_id` BIGINT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_permission` (`role_id`,`permission_id`),
  KEY `permission_id` (`permission_id`)
);

-- Bảng role_user (thêm id PK)
CREATE TABLE `role_user` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `role_id` BIGINT NOT NULL,
  `user_id` BIGINT NOT NULL,
  `scope_id` BIGINT DEFAULT NULL,
  `scope_type` ENUM('System','Contest','Problem','Group') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_user` (`role_id`,`user_id`,`scope_type`),
  KEY `user_id` (`user_id`)
);

CREATE TABLE `auth_refresh_token` (
  `token_id` bigint NOT NULL AUTO_INCREMENT,
  `expired_at` datetime(6) NOT NULL,
  `ip_addr` varchar(50) DEFAULT NULL,
  `issued_at` datetime(6) NOT NULL,
  `refresh_token` varchar(512) NOT NULL,
  `revoked` bit(1) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`token_id`)
);

-- Bảng group
CREATE TABLE `group` (
  `group_id` BIGINT NOT NULL AUTO_INCREMENT,
  `group_name` VARCHAR(255) DEFAULT NULL,
  `description` TEXT,
  `avatar` VARCHAR(255) DEFAULT NULL,
  `created_by` BIGINT DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`group_id`),
  KEY `created_by` (`created_by`)
);

-- Bảng group_invitation (thêm id PK)
CREATE TABLE `group_invitation` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `group_id` BIGINT DEFAULT NULL,
  `inviter_id` BIGINT DEFAULT NULL,
  `invitee_id` BIGINT DEFAULT NULL,
  `status` ENUM('PENDING','ACCEPTED','DECLINED','EXPIRED') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `group_id` (`group_id`),
  KEY `inviter_id` (`inviter_id`),
  KEY `invitee_id` (`invitee_id`)
);

-- Bảng group_member (thêm id PK)
CREATE TABLE `group_member` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `group_id` BIGINT NOT NULL,
  `user_id` BIGINT NOT NULL,
  `invite_by_user_id` BIGINT DEFAULT NULL,
  `joined_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_group_member` (`group_id`,`user_id`),
  KEY `user_id` (`user_id`)
);

-- Bảng contest
CREATE TABLE `contest` (
  `contest_id` BIGINT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) DEFAULT NULL,
  `description` TEXT,
  `start_time` DATETIME DEFAULT NULL,
  `duration` INT DEFAULT NULL,
  `contest_status` ENUM('Upcoming','Running','Finished') DEFAULT NULL,
  `contest_type` ENUM('Draft','Gym','Official') DEFAULT NULL,
  `author` BIGINT DEFAULT NULL,
  `rated` BIGINT DEFAULT '0',
  `visibility` ENUM('public','private') DEFAULT 'private',
  `group_id` BIGINT DEFAULT NULL,
  PRIMARY KEY (`contest_id`),
  KEY `author` (`author`),
  KEY `group_id` (`group_id`)
);

-- Bảng contest_invitation (thêm id PK)
CREATE TABLE `contest_invitation` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `contest_id` BIGINT DEFAULT NULL,
  `inviter_id` BIGINT DEFAULT NULL,
  `invitee_id` BIGINT DEFAULT NULL,
  `status` ENUM('ACCEPTED','DECLINED','PENDING','EXPIRED') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `contest_id` (`contest_id`),
  KEY `inviter_id` (`inviter_id`),
  KEY `invitee_id` (`invitee_id`)
);

-- Bảng contest_participants (thêm id PK)
CREATE TABLE `contest_participants` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `contest_id` BIGINT NOT NULL,
  `user_id` BIGINT NOT NULL,
  `penalty` INT DEFAULT NULL,
  `total_score` INT DEFAULT NULL,
  `ranking` INT DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_contest_participants` (`contest_id`,`user_id`),
  KEY `user_id` (`user_id`)
);

-- Bảng contest_problem (thêm id PK)
CREATE TABLE `contest_problem` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `contest_id` BIGINT NOT NULL,
  `problem_id` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_contest_problem` (`contest_id`,`problem_id`)
);

-- Bảng contest_registration (thêm id PK)
CREATE TABLE `contest_registration` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `contest_id` BIGINT NOT NULL,
  `user_id` BIGINT NOT NULL,
  `registered_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_contest_registration` (`contest_id`,`user_id`),
  KEY `user_id` (`user_id`)
);

-- Bảng contest_testers (thêm id PK)
CREATE TABLE `contest_testers` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `contest_id` BIGINT NOT NULL,
  `user_id` BIGINT NOT NULL,
  `total_score` INT DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_contest_testers` (`contest_id`,`user_id`),
  KEY `user_id` (`user_id`)
);

-- Bảng user_friendship (thêm id PK)
CREATE TABLE `user_friendship` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `friend_id` BIGINT NOT NULL,
  `status` ENUM('ACCEPTED','BLOCKED') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_friendship` (`user_id`,`friend_id`),
  KEY `friend_id` (`friend_id`)
);

-- Bảng user_rating_history (thêm id PK)contest
CREATE TABLE `user_rating_history` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `contest_id` BIGINT NOT NULL,
  `rating` INT DEFAULT NULL,
  `delta` INT DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_rating_history` (`user_id`,`contest_id`),
  KEY `contest_id` (`contest_id`)
);


