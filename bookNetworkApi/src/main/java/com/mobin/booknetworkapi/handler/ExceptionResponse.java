package com.mobin.booknetworkapi.handler;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.util.Map;
import java.util.Set;

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_EMPTY;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(NON_EMPTY) // used to include only the nonEmpty attributes
public class ExceptionResponse {
    private Integer businessErrorCode;
    private String businessErrorDescription;
    private String error;
    private Set<String> validationErrors;
    private Map<String,String>errors;
}
