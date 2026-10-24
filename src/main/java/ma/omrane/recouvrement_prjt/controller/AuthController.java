package ma.omrane.recouvrement_prjt.controller;

import ma.omrane.recouvrement_prjt.entity.User;
import ma.omrane.recouvrement_prjt.repository.UserRepository;
import ma.omrane.recouvrement_prjt.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, JwtService jwtService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    public record RegisterRequest(
            String nom,
            String prenom,
            String email,
            String telephone,
            String adresse,
            String password
    ) {}

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody User user) {
        String username = user.getUsername() == null ? "" : user.getUsername().trim();
        if (username.isBlank()) {
            throw new RuntimeException("Username requis");
        }

        User dbUser = userRepository
                .findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        String raw = user.getPassword() == null ? "" : user.getPassword();
        boolean validPassword;
        try {
            validPassword = passwordEncoder.matches(raw, dbUser.getPassword());
        } catch (IllegalArgumentException e) {
            validPassword = dbUser.getPassword().equals(raw);
        }

        if (!validPassword) {
            throw new RuntimeException("Mot de passe incorrect");
        }

        // Migration douce: ancien mot de passe en clair -> hash BCrypt
        if (dbUser.getPassword().equals(raw)) {
            dbUser.setPassword(passwordEncoder.encode(raw));
            userRepository.save(dbUser);
        }

        String token = jwtService.generateToken(dbUser.getUsername());
        String role = dbUser.getRole() != null ? dbUser.getRole() : "USER";

        return Map.of(
                "token", token,
                "username", dbUser.getUsername(),
                "role", role
        );
    }

    @PostMapping("/register")
    public Map<String, String> register(@RequestBody RegisterRequest body) {
        if (body.email() == null || body.email().isBlank()) {
            throw new RuntimeException("Email requis");
        }
        if (body.password() == null || body.password().length() < 3) {
            throw new RuntimeException("Mot de passe invalide");
        }
        if (userRepository.findByUsername(body.email().trim()).isPresent()) {
            throw new RuntimeException("Cet email est déjà utilisé");
        }

        User u = new User();
        u.setUsername(body.email().trim());
        u.setPassword(passwordEncoder.encode(body.password()));
        u.setRole("USER");
        userRepository.save(u);

        String token = jwtService.generateToken(u.getUsername());
        return Map.of(
                "token", token,
                "username", u.getUsername(),
                "role", u.getRole()
        );
    }
}