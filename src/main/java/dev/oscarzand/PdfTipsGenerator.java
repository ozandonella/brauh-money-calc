package dev.oscarzand;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;

import java.io.FileInputStream;
import java.io.FileOutputStream;

import dev.oscarzand.models.Checkout;
import dev.oscarzand.models.Employee;
import dev.oscarzand.models.Tipout;

public class PdfTipsGenerator {
    private static Document document;
    private static final Font columnHeaderCellFont = new Font(Font.FontFamily.TIMES_ROMAN, 13, Font.BOLD);
    private static final Font tableTitleFont = new Font(Font.FontFamily.TIMES_ROMAN, 18, Font.BOLD);
    private static final Font tableCellFont = new Font(Font.FontFamily.TIMES_ROMAN, 13);
                public static void convert(Tipout tipout){
        try {
            document = new Document(PageSize.A4, 0, 0, 10, 10);
            FileOutputStream out = new FileOutputStream("C:/Users/Oxsar/Coding/JavaScript/brauh-money-calc/src/main/resources/generatedPdfs/TipsRecord(" + tipout.getDate() + ").pdf");
            PdfWriter.getInstance(document, out);
            document.open();
            setHeader(tipout);
            setBody(tipout);
            document.close();
            out.close();
        }catch (Exception e){
            e.printStackTrace();
        }
    }
    private static void setHeader(Tipout tipout){
        try{
            PdfPTable table = new PdfPTable(new float[]{1,3});
            table.setWidthPercentage(100);
            table.setHorizontalAlignment(Element.ALIGN_LEFT);

            table.addCell(new Jpeg(new FileInputStream("C:/Users/Oxsar/OneDrive/Pictures/Screenshots/Money.jpg").readAllBytes()));

            Paragraph title = new Paragraph();
            title.setFont(new Font(Font.FontFamily.TIMES_ROMAN, 32, Font.BOLD));
            title.add("\nTip Record: "+ tipout.getDate());

            Paragraph subTitle = new Paragraph();
            subTitle.setFont(new Font(Font.FontFamily.TIMES_ROMAN, 16, Font.ITALIC));
            subTitle.add("Lead: " + tipout.getPrimaryPerson() + "\nSecondary: " + tipout.getSecondaryPerson());

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
    private static void setBody(Tipout tipout){
        try {

            PdfPTable body = new PdfPTable(new float[]{3, 1});
            body.setWidthPercentage(100);
            body.setHorizontalAlignment(Element.ALIGN_LEFT);
            body.addCell(getStringCell("EMPLOYEES", tableTitleFont, false));
            body.addCell(getStringCell("TIP POOL", tableTitleFont, false));

            PdfPTable employeeTable = new PdfPTable(new float[]{2, 2, 1, 1});
            employeeTable.setWidthPercentage(98);

            employeeTable.addCell(getStringCell("NAME", columnHeaderCellFont, true));
            employeeTable.addCell(getStringCell("JOB", columnHeaderCellFont, true));
            employeeTable.addCell(getStringCell("HOURS", columnHeaderCellFont,true));
            employeeTable.addCell(getStringCell("TIPS", columnHeaderCellFont, true));

            for(Employee emp : tipout.getEmployeeList()){
                employeeTable.addCell(getStringCell(emp.getName(), tableCellFont, true));
                employeeTable.addCell(getStringCell(emp.getJob().getName() + "("+emp.getJob().getPoints()+")", tableCellFont, true));
                employeeTable.addCell(getStringCell(String.valueOf(emp.getHours()), tableCellFont,true));
                employeeTable.addCell(getStringCell("$"+(int)emp.getTips(), tableCellFont, true));
            }

            PdfPCell employeeListCell = new PdfPCell();
            employeeListCell.setBorder(Rectangle.NO_BORDER);
            employeeListCell.addElement(employeeTable);

            body.addCell(employeeListCell);

            PdfPTable checkoutTable = new PdfPTable(new float[]{1,1});
            checkoutTable.setWidthPercentage(98);
            checkoutTable.addCell(getStringCell("NAME", columnHeaderCellFont, true));
            checkoutTable.addCell(getStringCell("AMOUNT", columnHeaderCellFont, true));

            for(Checkout check : tipout.getCheckoutList()){
                checkoutTable.addCell(getStringCell(check.getName(), tableCellFont, true));
                checkoutTable.addCell(getStringCell("$"+check.getAmount(), tableCellFont, true));
            }

            checkoutTable.addCell(getStringCell("TOTAL:", columnHeaderCellFont, false));
            checkoutTable.addCell(getStringCell("$"+tipout.getTotalTips(), columnHeaderCellFont, false));

            checkoutTable.addCell(getStringCell("RATE(1.0):", columnHeaderCellFont, false));
            checkoutTable.addCell(getStringCell("$"+tipout.getSinglePointHourly(), columnHeaderCellFont, false));

            PdfPCell checkoutTableCell = new PdfPCell();
            checkoutTableCell.setBorder(Rectangle.NO_BORDER);
            checkoutTableCell.addElement(checkoutTable);

            body.addCell(checkoutTableCell);

            document.add(body);


        } catch(Exception e){
            e.printStackTrace();
        }
    }
    static PdfPCell getStringCell(String content, Font font, boolean border){
        Paragraph p = new Paragraph(content, font);
        PdfPCell cell = new PdfPCell(p);
        cell.setPaddingBottom(5);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        if(!border) cell.setBorder(Rectangle.NO_BORDER);
        return cell;
    }

}
