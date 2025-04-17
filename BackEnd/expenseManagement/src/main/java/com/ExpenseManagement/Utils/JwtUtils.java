package com.ExpenseManagement.Utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.apache.commons.lang3.time.DateUtils;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

public class JwtUtils {
    public static SecretKey secretKey = Jwts.SIG.HS256.key().build();
    public  static String ISSUER = "Nik Developer";


    public static boolean validateToken(String token) {
        return parser(token)!=null;
    }

    public static Claims parser(String token){
        JwtParser build = Jwts.parser()
                .verifyWith(secretKey)
                .build();
        try {
            return build.parseSignedClaims(token).getPayload();
        } catch (JwtException | IllegalArgumentException e) {
            throw new RuntimeException(e);
        }
    }

    public static String getUsernameFromToken(String token) {
        return parser(token).getSubject();
    }

    public static String generateToken(String username){
        Date currentdate = new Date();
        Date expirationdate = DateUtils.addMinutes(currentdate, 15);
        return Jwts.builder()
                .subject(username)
                .issuer(ISSUER)
                .issuedAt(currentdate)
                .expiration(expirationdate)
                .signWith(secretKey)
                .compact();
    }
}
