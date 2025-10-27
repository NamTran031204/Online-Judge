package com.example.jude_service.services;

import java.io.IOException;

public interface CPPCompileService {

    String compile(String solution) throws IOException, InterruptedException;
}
