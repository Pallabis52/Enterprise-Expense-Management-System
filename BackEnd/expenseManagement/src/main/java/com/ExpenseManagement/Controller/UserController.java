package com.ExpenseManagement.Controller;

import com.ExpenseManagement.DTO.AuthRequestDto;
import com.ExpenseManagement.DTO.AuthResponse;
import com.ExpenseManagement.DTO.AuthResponseDto;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ExpenseManagement.Services.UserService;

@RestController
@RequestMapping("api/auth")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    //localhost:8080/api/auth/login
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@RequestBody AuthRequestDto authRequestDto){
        String token = userService.login(authRequestDto.username(),authRequestDto.password());
        if (token!=null){
            return ResponseEntity.status(HttpStatus.OK).body(new AuthResponseDto(token, AuthResponse.LOGIN_SUCCESS));
        }
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new AuthResponseDto(null,AuthResponse.LOGIN_FAILED));
    }

    //localhost:8080/api/auth/signup
    @PostMapping("/signup")
    public ResponseEntity<AuthResponseDto> signup(@RequestBody AuthRequestDto authRequestDto){
        try{
            String token = userService.signup(authRequestDto.name(),authRequestDto.username(),authRequestDto.password());
            return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponseDto(token, AuthResponse.USER_CREATED));

        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new AuthResponseDto(null, AuthResponse.USER_EXIST));
        }
    }
}
