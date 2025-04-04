package dev.oscarzand;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;

import java.io.FileInputStream;
import java.io.FileOutputStream;

import dev.oscarzand.models.Tipout;

public class PdfTipsGenerator {
    private static Document document;
    public static void convert(Tipout tipout){
        try {
            document = new Document(PageSize.A4, 0, 0, 10, 10);
            PdfWriter.getInstance(document, new FileOutputStream("generatedPdfs/TipsRecord(" + tipout.getDate() + ").pdf"));
            document.open();
            setHeader(tipout);
            document.close();
        }catch (Exception e){
            e.printStackTrace();
        }
    }
    private static void setHeader(Tipout tipOut){
        try{
            PdfPTable table = new PdfPTable(new float[]{1,3});
            table.setWidthPercentage(100);
            table.setHorizontalAlignment(Element.ALIGN_LEFT);

            table.addCell(new Jpeg(new FileInputStream("C:/Users/Oxsar/OneDrive/Pictures/Screenshots/Money.jpg").readAllBytes()));

            Paragraph title = new Paragraph();
            title.setFont(new Font(Font.FontFamily.TIMES_ROMAN, 32, Font.BOLD));
            title.add("\nTip Record: "+ tipOut.getDate());

            Paragraph subTitle = new Paragraph();
            subTitle.setFont(new Font(Font.FontFamily.TIMES_ROMAN, 16, Font.ITALIC));
            subTitle.add("Lead: " + tipOut.getPrimaryPerson() + "\nSecondary: " + tipOut.getSecondaryPerson());

            title.add(0,subTitle);
            table.addCell(title);

            table.getRows().forEach((row) -> {
                for(PdfPCell cell : row.getCells()){
                    cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                    cell.setBorder(Rectangle.NO_BORDER);
                }
            });
            document.add(table);
        }catch (Exception e){
            e.printStackTrace();
        }
    }

}
