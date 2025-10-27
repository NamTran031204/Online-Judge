package com.example.jude_service.components;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class DockerComponent {

    @Value("${docker.docker-file-path}")
    private String DOCKER_FILE_PATH;

    @Bean
    public void dockerBuildImage() {
        try {
            buildImage("cpp-compiler", DOCKER_FILE_PATH + "/cpp-compiler", DOCKER_FILE_PATH);
        } catch (Exception e) {
            System.err.println(e.getMessage());
        }
    }

    void buildImage(String imageName, String dockerFilePath, String contextPath) throws IOException, InterruptedException {
        ProcessBuilder pb = new ProcessBuilder(
          "docker", "build",
                "-t", imageName + ":latest",
                "-f", dockerFilePath, contextPath
        );
        pb.inheritIO();
        Process process = pb.start();
        int exitCode = process.waitFor();
        if (exitCode != 0) {
            throw new RuntimeException("Failed to build image: " + imageName);
        }

        System.out.println("Build "+ contextPath + " complete.");
    }
}
