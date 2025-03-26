package dev.oscarzand;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class HomePageController {
    @RequestMapping("")
    public String displayPage(){
        return "index.html";
    }
}
