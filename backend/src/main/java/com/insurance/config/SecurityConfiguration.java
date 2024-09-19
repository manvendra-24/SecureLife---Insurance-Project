package com.insurance.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;


import com.insurance.security.JwtAuthenticationEntryPoint;
import com.insurance.security.JwtAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfiguration {

	private final JwtAuthenticationEntryPoint authenticationEntryPoint;
	private final JwtAuthenticationFilter authenticationFilter;

	public SecurityConfiguration(JwtAuthenticationEntryPoint authenticationEntryPoint, JwtAuthenticationFilter authenticationFilter) {
		this.authenticationEntryPoint = authenticationEntryPoint;
		this.authenticationFilter = authenticationFilter;
	}
	

	@Bean
	public static PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	
	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
		return configuration.getAuthenticationManager();
	}
	
	
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
	    http
	    .cors(cors -> cors.configurationSource(corsConfigurationSource())) 
	        .csrf(csrf -> csrf.disable()) 
	        .authorizeHttpRequests(auth -> auth
	            .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/v3/api-docs.yaml", 
	                             "/swagger-resources/**", "/swagger-ui.html", "/webjars/**").permitAll()  
	            .requestMatchers("/SecureLife.com/customer/register").permitAll()
	            .requestMatchers("/SecureLife.com/login").permitAll() 
	            .requestMatchers("/SecureLife.com/profile/**").permitAll() 
	            .requestMatchers("/SecureLife.com/otp/**").permitAll() 
	            .requestMatchers("/SecureLife.com/password/**").permitAll() 
	            .requestMatchers("/SecureLife.com/getUsername").permitAll()  
	            .requestMatchers("/api/payment/**").authenticated()  
	            .requestMatchers("/SecureLife.com/allcities").permitAll()
	            .requestMatchers("/SecureLife.com/allstates").permitAll()
	            .requestMatchers("/SecureLife.com/transaction/**").permitAll()
	            .requestMatchers("/SecureLife.com/types").permitAll()
	            .anyRequest().authenticated()  
	        )
	        .exceptionHandling(exceptions -> exceptions
	            .authenticationEntryPoint(authenticationEntryPoint)  
	        )
	        .sessionManagement(session -> session
	            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)  
	        );

	  
	    http.addFilterBefore(authenticationFilter, UsernamePasswordAuthenticationFilter.class);
	    
	    return http.build();
	}
	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
	    CorsConfiguration configuration = new CorsConfiguration();
	    configuration.addAllowedOrigin("http://localhost:3000"); 
	    configuration.addAllowedMethod("*");  
	    configuration.addAllowedHeader("*");
	    configuration.setExposedHeaders(List.of(HttpHeaders.AUTHORIZATION));
	    configuration.setAllowCredentials(true);  

	 
	    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

	    source.registerCorsConfiguration("/**", configuration);

	    return source;  
	}


}
