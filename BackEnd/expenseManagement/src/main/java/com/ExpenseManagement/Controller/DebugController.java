package com.expensemanagement.Controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/public")
public class DebugController {

    @GetMapping("/debug-auth")
    public Map<String, Object> debugAuth(HttpServletRequest request) {
        Map<String, Object> debugInfo = new HashMap<>();
        debugInfo.put("version", "v3-STABILITY-PROPER-SOLVE-ACTIVE");

        // Headers
        Map<String, String> headers = new HashMap<>();
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String name = headerNames.nextElement();
            headers.put(name, request.getHeader(name));
        }
        debugInfo.put("headers", headers);

        // Parameters
        Map<String, String> params = new HashMap<>();
        Enumeration<String> parameterNames = request.getParameterNames();
        while (parameterNames.hasMoreElements()) {
            String name = parameterNames.nextElement();
            params.put(name, request.getParameter(name));
        }
        debugInfo.put("parameters", params);

        // Request Details
        debugInfo.put("uri", request.getRequestURI());
        debugInfo.put("queryString", request.getQueryString());
        debugInfo.put("method", request.getMethod());
        debugInfo.put("remoteAddr", request.getRemoteAddr());

        return debugInfo;
    }
}
