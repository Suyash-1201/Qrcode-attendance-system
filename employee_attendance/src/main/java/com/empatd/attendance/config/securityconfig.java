package com.empatd.attendance.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.password4j.BcryptPassword4jPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.stereotype.Component;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import jakarta.servlet.http.HttpServletRequest;

@Configuration
@Component
public class securityconfig {
	
	@Bean
	public PasswordEncoder encoding() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public SecurityFilterChain filterchain(HttpSecurity http) {
		
		http.cors(cor->cor.configurationSource(corsconfig())).csrf(csrf->csrf.disable()).authorizeHttpRequests(auth->auth.anyRequest().permitAll());
		
		return http.build();
		
	}
	
	@Bean
	public CorsConfigurationSource corsconfig() {
		CorsConfiguration con=new CorsConfiguration();
		
		con.setAllowedOrigins(List.of("http://localhost:5173","http://127.0.0.1:5173","https://qrcode-attendance-system-indol.vercel.app","http://localhost:3000"));
		con.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type","X-XSRF-TOKEN", "X-Requested-With"));
		con.setAllowedMethods(List.of("POST","GET","PUT","DELETE","OPTIONS"));
		con.setAllowCredentials(true);
		
		UrlBasedCorsConfigurationSource source=new UrlBasedCorsConfigurationSource();
		
		source.registerCorsConfiguration("/**", con);
		return source;
	}
}
