
package com.textilestore.textile_store.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
            .cors(Customizer.withDefaults())

            .csrf(csrf -> csrf.disable())

            .authorizeHttpRequests(auth -> auth

                // Public registration
                .requestMatchers("/api/users/register").permitAll()

                // Public login
                .requestMatchers("/api/auth/**").permitAll()

                // Existing local testing permissions
                .requestMatchers("/api/cart/**").permitAll()
                .requestMatchers("/api/orders/**").permitAll()
                .requestMatchers("/api/reviews/**").permitAll()
                .requestMatchers("/api/addresses/**").permitAll()

                // TEMPORARY: Dashboard statistics testing only
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/admin/dashboard/stats"
                ).permitAll()

                // Public product and category viewing
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/products/**",
                    "/api/categories/**"
                ).permitAll()
                .requestMatchers("/api/wishlist/**").permitAll()

                .requestMatchers("/error").permitAll()

                // All other endpoints require authentication
                .anyRequest().authenticated()
            )

            .httpBasic(basic -> basic.disable())

            .formLogin(form -> form.disable());

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
