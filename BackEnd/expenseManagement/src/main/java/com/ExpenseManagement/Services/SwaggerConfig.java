package com.ExpenseManagement.Services;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.security.SecuritySchemes;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(title = "Expense Management API", version = "1.0", description = "API Documentation"),
        security = @SecurityRequirement(name = "BearerAuth")  // Apply security globally
)
@SecuritySchemes({
        @SecurityScheme(
                name = "BearerAuth",
                scheme = "bearer",
                type = SecuritySchemeType.HTTP,
                bearerFormat = "JWT"
        )
})
public class SwaggerConfig {
}
