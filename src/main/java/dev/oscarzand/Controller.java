package dev.oscarzand;

import dev.oscarzand.models.Job;
import dev.oscarzand.models.Tipout;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@RequestMapping("")
public class Controller {

    @GetMapping("/test/{fileName}")
    public ResponseEntity<String> test(@PathVariable String fileName){
        try{
            return ResponseEntity.ok(StreamUtils.copyToString(new FileInputStream(new File("../brauh-money-calc/src/main/resources/static/js/test/"+fileName)), StandardCharsets.UTF_8));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
    @PostMapping("/download")
    public ResponseEntity<Map<String, String>> storePdf(@RequestBody Tipout tipout) throws IOException {
        tipout.print();
        PdfTipsGenerator.convert(tipout);
        return new ResponseEntity<Map<String,  String>>(Map.of("pdfUrl","/download/TipsRecord("+tipout.getDate()+").pdf"), HttpStatus.OK);
    }
    @GetMapping("/download/{fileName}")
    public ResponseEntity<Resource> findPdf(@PathVariable String fileName){
        try{
            Resource pdfDownload = new ByteArrayResource(new FileInputStream(new File("../brauh-money-calc/generatedPdfs/"+fileName)).readAllBytes());
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
