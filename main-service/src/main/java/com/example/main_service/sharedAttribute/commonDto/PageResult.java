package com.example.main_service.sharedAttribute.commonDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PageResult<TEntity> {
    private long totalCount;
    private List<TEntity> data;
}
