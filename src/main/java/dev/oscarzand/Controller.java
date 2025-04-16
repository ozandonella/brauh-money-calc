package dev.oscarzand;

import dev.oscarzand.models.Job;
import dev.oscarzand.models.Tipout;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("")
public class Controller {

    @PostMapping("/test")
    public void test(@RequestBody Job res){
        System.out.println(res);
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
