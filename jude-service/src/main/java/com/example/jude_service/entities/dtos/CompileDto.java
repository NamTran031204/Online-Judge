package com.example.jude_service.entities.dtos;

import com.example.jude_service.enums.LanguageType;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompileDto {
    @JsonProperty("id")
    private int id;

    @JsonProperty("user-id")
    private int userId;

    @JsonProperty("problem-id")
    private int problemId;

    @JsonProperty("solution")
    private String solution;

    @JsonProperty("programme-language")
    private LanguageType programmeLanguage;

}
