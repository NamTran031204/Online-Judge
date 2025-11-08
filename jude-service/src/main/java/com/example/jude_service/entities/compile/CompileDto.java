package com.example.jude_service.entities.compile;

import com.example.jude_service.enums.LanguageType;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompileDto {
    @JsonProperty("problemId")
    private int problemId;

    @JsonProperty("code")
    private String solution;

    @JsonProperty("language")
    private LanguageType language;

    @JsonProperty("operation")
    private String operation;

}
