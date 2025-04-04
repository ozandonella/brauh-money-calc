package dev.oscarzand;

import dev.oscarzand.job.Job;
import dev.oscarzand.tipout.Tipout;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("")
public class HomePageController {

    @PostMapping("/test")
    public void test(@RequestBody Job res){
        System.out.println(res);
    }
    @PostMapping("/download")
    public void download(@RequestBody Tipout tipout) throws IOException {
        tipout.print();
    }

}
