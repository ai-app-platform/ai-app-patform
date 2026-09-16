package com.aibuilder.application.service;

import com.aibuilder.application.dto.AuthResponse;
import com.aibuilder.application.dto.LoginRequest;
import com.aibuilder.application.dto.RegisterRequest;
import com.aibuilder.domain.entity.User;
import com.aibuilder.domain.exception.BusinessException;
import com.aibuilder.domain.repository.UserRepository;
import com.aibuilder.infrastructure.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BusinessException("EMAIL_ALREADY_EXISTS",
                "A user with this email already exists");
        }

        User user = new User(request.email(), passwordEncoder.encode(request.password()),
            request.fullName());
        User savedUser = userRepository.save(user);

        String token = jwtTokenProvider.generateToken(savedUser);
        return new AuthResponse(token, savedUser.getId(), savedUser.getFullName(),
            savedUser.getEmail(), savedUser.getRole().name());
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
            .orElseThrow(() -> new BusinessException("INVALID_CREDENTIALS",
                "Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new BusinessException("INVALID_CREDENTIALS",
                "Invalid email or password");
        }

        if (!user.isActive()) {
            throw new BusinessException("ACCOUNT_INACTIVE",
                "Your account has been deactivated");
        }

        String token = jwtTokenProvider.generateToken(user);
        return new AuthResponse(token, user.getId(), user.getFullName(),
            user.getEmail(), user.getRole().name());
    }
}
