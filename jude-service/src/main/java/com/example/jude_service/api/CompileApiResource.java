//package com.example.jude_service.controllers;
//
//import com.example.jude_service.entities.compile.CompileDto;
//import com.example.jude_service.services.AuthService;
//import com.example.jude_service.services.CPPCompileService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.validation.annotation.Validated;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import java.io.IOException;
//
//@RestController
//@RequestMapping("${api.prefix}/compile")
//@RequiredArgsConstructor
//@Validated
//public class CompileController {
//
//    private final CPPCompileService cppCompileService;
//    private final AuthService authService;
//
//    @PostMapping("")
//    ResponseEntity<?> getRequest(@RequestBody CompileDto compileDto) {
//
//        try {
//            authService.verifyUser(compileDto.getUserId(), compileDto.getProblemId());
//
//            String result;
//
//            switch (compileDto.getProgrammeLanguage()) {
//                case CPP:
//                    result = cppCompileService.compile(compileDto.getSolution());
//                    break;
//                default:
//                    return ResponseEntity.badRequest().body("Unsupported language: " + compileDto.getProgrammeLanguage());
//            }
//
//            if (result.contains("COMPILE ERROR") || result.contains("RUNTIME ERROR")) {
//                return ResponseEntity.status(400).body(result);
//            }
//
//            return ResponseEntity.ok(result);
//
//        } catch (IOException | InterruptedException e) {
//            return ResponseEntity.status(500).body("Server error: " + e.getMessage());
//        }
//
//    }
//}
