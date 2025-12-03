package com.example.main_service.contest.specification;

import com.example.main_service.sharedAttribute.enums.ContestStatus;
import com.example.main_service.sharedAttribute.enums.ContestType;
import com.example.main_service.sharedAttribute.enums.ContestVisibility;
import lombok.experimental.UtilityClass;
import org.springframework.data.jpa.domain.Specification;

@UtilityClass
public class ContestSpec {
    public<T> Specification<T> hasRated(Long rated) {
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("rated"), rated);
    }

    public<T> Specification<T> hasContestStatus(ContestStatus contestStatus) {
        return (root, query, cb) -> cb.equal(root.get("contestStatus"), contestStatus);
    }

    public<T> Specification<T> hasContestType(ContestType contestType) {
        return (root, query, cb) -> cb.equal(root.get("contestType"), contestType);
    }

    public<T> Specification<T> hasVisibility(ContestVisibility contestVisibility) {
        return (root, query, cb) -> cb.equal(root.get("contestVisibility"), contestVisibility);
    }

    public<T> Specification<T> hasGroupId(Long groupId) {
        return (root, query, cb) -> cb.equal(root.get("groupId"), groupId);
    }

    public<T> Specification<T> hasAuthorId(Long authorId) {
        return (root, query, cb) -> cb.equal(root.get("author"), authorId);
    }
}
