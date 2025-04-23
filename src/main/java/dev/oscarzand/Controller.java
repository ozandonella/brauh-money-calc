package dev.oscarzand;
import dev.oscarzand.models.Tipout;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.util.Map;

@RestController
@RequestMapping("")
public class Controller {

    @GetMapping("/")
    public ResponseEntity<Void> redirect(){
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.LOCATION, "calculator");
        return new ResponseEntity<>(headers, HttpStatus.MOVED_PERMANENTLY);
    }
    @GetMapping("/calculator")
    public ResponseEntity<Resource> displayCalculator() {
        Resource calcHtml = new ClassPathResource("html/calculator.html");
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, MediaType.TEXT_HTML_VALUE);
        return new ResponseEntity<>(calcHtml, headers, HttpStatus.OK);
    }
    @GetMapping("/confirm")
    public ResponseEntity<Resource> displayConfirm() {
        Resource calcHtml = new ClassPathResource("html/confirm.html");
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, MediaType.TEXT_HTML_VALUE);
        return new ResponseEntity<>(calcHtml, headers, HttpStatus.OK);
    }

    @GetMapping("/test/{fileName}")
    public ResponseEntity<Resource> test(@PathVariable String fileName){
        Resource jsonFile = new ClassPathResource("jsonTests/"+fileName);
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
        return new ResponseEntity<>(jsonFile, headers, HttpStatus.OK);
    }
    @PostMapping("/download")
    public ResponseEntity<Map<String, String>> storePdf(@RequestBody Tipout tipout) throws IOException {
        tipout.print();
        PdfTipsGenerator.convert(tipout);
        return new ResponseEntity<>(Map.of("pdfUrl","/download/TipsRecord("+tipout.getDate()+").pdf"), HttpStatus.OK);
    }
    @GetMapping("/download/{fileName}")
    public ResponseEntity<Resource> findPdf(@PathVariable String fileName){
        try{
            Resource pdfDownload = new ClassPathResource("generatedPdfs/"+fileName);
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_OCTET_STREAM_VALUE);
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\""+fileName+"\"");
            headers.add(HttpHeaders.CONTENT_LENGTH, String.valueOf(pdfDownload.contentLength()));
            ResponseEntity<Resource> response = new ResponseEntity<>(pdfDownload, headers, HttpStatus.OK);
            return response;

        }catch(Exception e){
            e.printStackTrace();
        }
        return new ResponseEntity<Resource>(HttpStatus.NO_CONTENT);
    }

}
