package com.ExpenseManagement.Services;

import com.ExpenseManagement.Entities.Role_Name;
import com.ExpenseManagement.Entities.Roles;
import com.ExpenseManagement.Entities.Users;
import com.ExpenseManagement.Repository.RolesRepo;
import com.ExpenseManagement.Repository.UserRepo;
import com.ExpenseManagement.Utils.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final AuthenticationManager authenticationManager;
    private final UserRepo userRepo;
    private final PasswordEncoder encoder;
    private final RolesRepo rolesRepo;

    @Override
    public String login(String username, String password) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username, password);
        Authentication authenticate = authenticationManager.authenticate(authenticationToken);
        UserDetails userDetails = (UserDetails)(authenticate.getPrincipal());
        String uname = userDetails.getUsername();
        return JwtUtils.generateToken(uname);
    }

    @Override
    public String signup(String name, String username, String password) {
        //if UserAlreadyExist
        Optional<Users> userfound = userRepo.findByUsername(username);
        if(userfound.isPresent()){
            throw new RuntimeException("Username Exist");
        }


        Users user = Users.builder()
                .username(username)
                .password(encoder.encode(password))
                .name(name)
                .build();
        Roles role = rolesRepo.findByName(Role_Name.ROLE_USER);
        if(role==null){
            throw new RuntimeException("Role Not Found");
        }
        Set<Roles> roleSet = new HashSet<>();
        roleSet.add(role);
        user.setRoles(roleSet);
        userRepo.save(user);
        return JwtUtils.generateToken(username);
    }
}
