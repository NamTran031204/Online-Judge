package com.example.jude_service.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@Configuration
@EnableMongoAuditing
public class DbConfig extends AbstractMongoClientConfiguration {

    @Value ("${spring.data.mongodb.database}")
    private String databaseName;

    @Override
    protected String getDatabaseName() {
        return databaseName;
    }

//    @Bean
//    public AuditorAware<String> auditorProvider() {
//        return () -> Optional.of(SecurityContextHolder.getContext().getAuthentication().getName());
//    } // dùng cho audit people
}