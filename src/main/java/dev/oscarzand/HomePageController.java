package dev.oscarzand;

import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/")
public class HomePageController {
    @RequestMapping("")
    public String displayPage(){
        return "calculator.html";
    }
    @PostMapping("/download")
    public ResponseEntity<byte[]> download(@RequestBody ResponseEntity<String> tipInfo) throws IOException {
        System.out.println(tipInfo);
        System.out.println();
        ResponseEntity<byte[]> response = new ResponseEntity<>(
                new FileInputStream("C:/Users/Oxsar/OneDrive/Pictures/Screenshots/Money.jpg").readAllBytes(),
                HttpStatusCode.valueOf(200)
        );
        return response;
    }

}
