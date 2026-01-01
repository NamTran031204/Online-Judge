package com.example.main_service.dashboard.controller;

import com.example.main_service.dashboard.dtos.ContestRatingCalcResponseDto;
import com.example.main_service.dashboard.dtos.DashBoardPageResponseDto;
import com.example.main_service.dashboard.service.ContestRatingService;
import com.example.main_service.dashboard.service.DashBoardService;
import com.example.main_service.sharedAttribute.commonDto.CommonResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.prefix}/contest")
@RequiredArgsConstructor
@Validated
@Slf4j

// thêm api tính rating cho problem dựa trên trung bình rating user giải nó

public class DashBoardController {
    private final DashBoardService dashBoardService;
    private final ContestRatingService contestRatingService;

    // mỗi 5-10s FE gọi lại api này dựa trên page hiện tại của user
    @GetMapping("/dashboard/page/{contestId}")
    public CommonResponse<DashBoardPageResponseDto> getDashboard(
            @PathVariable Long contestId,
            @RequestParam(defaultValue = "0") int offset,
            @RequestParam(defaultValue = "10") int limit
    ) {
        return CommonResponse.success(
                dashBoardService.getDashBoard(contestId, offset, limit)
        );
    }

    @PostMapping("/{contestId}/calculate-rating") // k gọi api => dùng scheduler java
    public CommonResponse<ContestRatingCalcResponseDto> calculateRating(
            @PathVariable Long contestId
    ) {
        return CommonResponse.success(
                contestRatingService.calculateRating(contestId) // tính rating cho problem nữa
        );
    }
}
