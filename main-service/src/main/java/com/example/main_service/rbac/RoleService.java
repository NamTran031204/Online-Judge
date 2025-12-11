package com.example.main_service.rbac;

import com.example.main_service.rbac.model.RoleEntity;
import com.example.main_service.rbac.model.RoleUserEntity;
import com.example.main_service.rbac.repo.RoleRepo;
import com.example.main_service.rbac.repo.RoleUserRepo;
import com.example.main_service.sharedAttribute.commonDto.PageResult;
import com.example.main_service.user.dto.RoleDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepo roleRepo;
    private final RoleUserRepo roleUserRepo;

    public PageResult<RoleDto> searchRoles(Pageable pageable) {
        Page<RoleEntity> page = roleRepo.findAll(pageable);

        List<RoleDto> roles = page.getContent().stream()
                .map(r -> new RoleDto(r.getRoleId(), r.getRoleName()))
                .collect(Collectors.toList());

        return new PageResult<>(page.getTotalElements(), roles);
    }

    public boolean hasSpecialContestRole(Long userId, Long contestId) {
        List<String> roles = roleUserRepo.findUserRolesForContest(
                userId,
                RoleUserEntity.ScopeType.Contest,          // contest scope
                String.valueOf(contestId),                // scopeId
                RoleUserEntity.ScopeType.System           // system scope
        );

        return roles.stream().anyMatch(role ->
                "Author".equals(role) ||
                        "Tester".equals(role)
        );
    }
}
