package com.mobin.booknetworkapi.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;

import static io.swagger.v3.oas.annotations.enums.SecuritySchemeIn.HEADER;
import static io.swagger.v3.oas.annotations.enums.SecuritySchemeType.*;

@OpenAPIDefinition(
        info = @Info(
                contact = @Contact(
                        name = "Mohamed",
                        email = "contact@Mobin.com",
                        url = "https://mobincoding.com/courses"
                ),
                description = "OpenApi doc for spring boot",
                title = "OpenApi Documentation - M0bin",
                license = @License(
                        name = "License name",
                        url = "https://some-url.com"
                ),
                termsOfService = "Terms of service"
        ),
        servers = {@Server(
                description = "Local Env",
                url = "http://localhost:8080/api/v1"
        ),
         @Server(
                 description = "Prod Env",
                 url = "https://mobin.com/courses"
         )
        },
        security = {
                @SecurityRequirement(
                        name = "bearerAuth"
                )
        }
)
@SecurityScheme(
        name = "bearerAuth",
        description = "Jwt Auth Description",
        scheme = "bearer",
        type = HTTP,
        bearerFormat = "JWT",
        in = HEADER
)
public class OpenApiConfig {
}
