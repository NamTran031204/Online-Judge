package com.example.main_service.contest.repo;

import com.example.main_service.contest.model.SubmissionResultEntity;
import com.example.main_service.contest.repo.projections.SubmissionDeleteValidationCheckProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface SubmissionResultRepo extends JpaRepository<SubmissionResultEntity, Long> {
    Optional<SubmissionResultEntity> findBySubmissionId(String submissionId);

    @Query(value = """
        SELECT
            sr.user_id AS userId,
            sr.problem_id AS problemId,
            c.contest_id AS contestId,
            sr.submission_id AS submissionId,
            c.contest_status AS contestStatus,
            c.contest_type AS contestType,
            c.visibility AS contestVisibility,
            c.rated AS rated,
            c.author AS author,
            c.group_id AS groupId,
            cp.score AS score
        FROM submission_result sr
        JOIN contest c ON c.contest_id = sr.contest_id
        JOIN contest_problem cp ON cp.contest_id = sr.contest_id
        WHERE sr.submission_id = :submissionId
    """, nativeQuery = true)
    Optional<SubmissionDeleteValidationCheckProjection> findValidationCheckBySubmissionId(@Param("submissionId") String submissionId);

    @Query(value = """
        SELECT
            sr.user_id AS userId,
            sr.problem_id AS problemId,
            c.contest_id AS contestId,
            sr.submission_id AS submissionId,
            c.contest_status AS contestStatus,
            c.contest_type AS contestType,
            c.visibility AS contestVisibility,
            c.rated AS rated,
            c.author AS author,
            c.group_id AS groupId,
            cp.score AS score
        FROM submission_result sr
        JOIN contest c ON c.contest_id = sr.contest_id
        JOIN contest_problem cp ON cp.contest_id = sr.contest_id
        WHERE sr.problem_id = :problemId
    """, nativeQuery = true)
    Optional<SubmissionDeleteValidationCheckProjection> findValidationCheckByProblemId(@Param("problemId") String problemId);

    @Query(value = """
        SELECT
            sr.user_id AS userId,
            sr.problem_id AS problemId,
            c.contest_id AS contestId,
            sr.submission_id AS submissionId,
            c.contest_status AS contestStatus,
            c.contest_type AS contestType,
            c.visibility AS contestVisibility,
            c.rated AS rated,
            c.author AS author,
            c.group_id AS groupId,
            cp.score AS score
        FROM submission_result sr
        JOIN contest c ON c.contest_id = sr.contest_id
        JOIN contest_problem cp ON cp.contest_id = sr.contest_id
        WHERE sr.user_id = :userId
    """, nativeQuery = true)
    Optional<SubmissionDeleteValidationCheckProjection> findValidationCheckByUserId(@Param("userId") Long userId);

}
