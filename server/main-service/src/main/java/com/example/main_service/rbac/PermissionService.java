package com.example.main_service.rbac;

import com.example.main_service.rbac.model.PermissionEntity;
import com.example.main_service.rbac.repo.PermissionRepo;
import com.example.main_service.sharedAttribute.commonDto.PageResult;
import com.example.main_service.user.dto.PermissionDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PermissionService {

    private final PermissionRepo permissionRepo;

    public PageResult<PermissionDto> searchPermissions(Pageable pageable) {
        Page<PermissionEntity> page = permissionRepo.findAll(pageable);

        List<PermissionDto> perms = page.getContent().stream()
                .map(p -> new PermissionDto(p.getPermissionId(), p.getPermissionName()))
                .collect(Collectors.toList());

        return new PageResult<>(page.getTotalElements(), perms);
    }
}
