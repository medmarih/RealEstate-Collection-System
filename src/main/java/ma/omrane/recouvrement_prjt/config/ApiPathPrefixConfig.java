package ma.omrane.recouvrement_prjt.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Préfixe toutes les API métier avec {@code /api} pour que les URLs du SPA
 * ({@code /recouvrements}, {@code /dashboard}, etc.) puissent être servies sans
 * entrer en conflit avec les contrôleurs REST.
 */
@Configuration
public class ApiPathPrefixConfig implements WebMvcConfigurer {

    @Override
    public void configurePathMatch(PathMatchConfigurer configurer) {
        configurer.addPathPrefix(
                "/api",
                c -> c.isAnnotationPresent(RestController.class)
                        && c.getPackageName().startsWith("ma.omrane.recouvrement_prjt.controller"));
    }
}
