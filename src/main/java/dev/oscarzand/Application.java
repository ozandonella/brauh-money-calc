package dev.oscarzand;
import com.itextpdf.text.DocumentException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {
    public static final Logger log = LoggerFactory.getLogger(Application.class);
    public static void main(String[] args) throws DocumentException {
        SpringApplication.run(Application.class, args);
    }
}