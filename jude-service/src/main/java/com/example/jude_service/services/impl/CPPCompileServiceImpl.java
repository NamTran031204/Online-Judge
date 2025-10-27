package com.example.jude_service.services.impl;

import com.example.jude_service.services.CPPCompileService;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.UUID;

@Service
public class CPPCompileServiceImpl implements CPPCompileService {

    private static final String DOCKER_IMAGE = "cpp-compiler";
    private static final String TEMP_DIR = "temp-compile";

    @Override
    public String compile(String solution) throws IOException, InterruptedException {
        String sessionId = UUID.randomUUID().toString();
        Path sessionDir = Paths.get(TEMP_DIR, sessionId);

        try {
            Files.createDirectories(sessionDir);

            Path solutionPath = sessionDir.resolve("solution.txt");
            Path inputPath = sessionDir.resolve("input.txt");
            Path outputPath = sessionDir.resolve("output.txt");

            Files.writeString(solutionPath, solution, StandardOpenOption.CREATE);
            Files.writeString(inputPath, input, StandardOpenOption.CREATE);
            Files.createFile(outputPath);

            String absolutePath = sessionDir.toAbsolutePath().toString();

            ProcessBuilder pb = new ProcessBuilder(
                    "docker", "run",
                    "--rm",
                    "-e", "SOLUTION=solution.txt",
                    "-e", "INPUT=input.txt",
                    "-v", absolutePath + "/solution.txt:/workspace/solution.txt",
                    "-v", absolutePath + "/input.txt:/workspace/input.txt",
                    "-v", absolutePath + "/output.txt:/workspace/output.txt",
                    DOCKER_IMAGE + ":latest"
            );

            Process process = pb.start();
            int exitCode = process.waitFor();

            String output = Files.readString(outputPath);

            if (output.contains("COMPILE ERROR")) {
                return "COMPILATION ERROR:\n" + output;
            } else if (output.contains("RUNTIME ERROR")) {
                return "RUNTIME ERROR:\n" + output;
            } else if (output.contains("SUCCESS")) {
                return output;
            } else {
                return "UNKNOWN ERROR:\n" + output;
            }
        } finally {
            cleanupSessionDirectory(sessionDir);
        }

    }

    private void cleanupSessionDirectory(Path sessionDir) {
        try {
            if (Files.exists(sessionDir)) {
                Files.walk(sessionDir)
                        .sorted((a, b) -> b.compareTo(a))
                        .forEach(path -> {
                            try {
                                Files.delete(path);
                            } catch (IOException e) {
                                System.err.println("Không thể xóa: " + path);
                            }
                        });
            }
        } catch (IOException e) {
            System.err.println("Lỗi khi dọn dẹp session: " + e.getMessage());
        }
    }
}
