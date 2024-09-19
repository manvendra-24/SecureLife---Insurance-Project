package com.insurance.util;

import com.insurance.entities.User;
import com.insurance.exceptions.ResourceNotFoundException;
import com.insurance.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;
import java.util.Set;

@Service
public class CustomUserDetails implements UserDetailsService {

    private UserRepository userRepository;

    public CustomUserDetails(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
    	Optional<User> oUser = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail);
    	
    	if(oUser.isEmpty()) {
    		throw new ResourceNotFoundException("User not found: "+ usernameOrEmail);
    	}
        User user = oUser.get();
    	GrantedAuthority authority = new SimpleGrantedAuthority(user.getRole().getName());
    	Set<GrantedAuthority> authorities = Collections.singleton(authority);

        
        return new org.springframework.security.core.userdetails.User(user.getEmail(),user.getPassword(), authorities);
    }
    
}
