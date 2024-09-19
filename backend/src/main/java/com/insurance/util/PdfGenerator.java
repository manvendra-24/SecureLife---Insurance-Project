package com.insurance.util;

import com.insurance.response.ReceiptData;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.util.List;

@Component
public class PdfGenerator {

    public String generatePdf(String title, List<String> headers, List<List<String>> data, String pdfPath, String fileName) throws DocumentException {
        File reportDir = new File(pdfPath);
        if (!reportDir.exists()) {
            reportDir.mkdirs();
        }
        String filename = reportDir + "/" + fileName + ".pdf";
        try {
            Document document = new Document(PageSize.A4, 36, 36, 36, 36); 
            PdfWriter.getInstance(document, new FileOutputStream(filename));
            document.open();

            Font titleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD, BaseColor.BLACK);
            Paragraph titleParagraph = new Paragraph(title, titleFont);
            titleParagraph.setAlignment(Element.ALIGN_CENTER);
            titleParagraph.setSpacingAfter(20);
            document.add(titleParagraph);

            PdfPTable table = new PdfPTable(headers.size());
            table.setWidthPercentage(100); 
            table.setSpacingBefore(10);
            table.setSpacingAfter(10);

            float[] columnWidths = calculateColumnWidths(headers, data);
            table.setWidths(columnWidths);

            Font headerFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD, BaseColor.WHITE);
            headers.forEach(columnTitle -> {
                PdfPCell header = new PdfPCell();
                header.setBackgroundColor(new BaseColor(0, 121, 182));
                header.setPadding(10); 
                header.setPhrase(new Phrase(columnTitle, headerFont));
                header.setHorizontalAlignment(Element.ALIGN_CENTER);
                table.addCell(header);
            });

            Font dataFont = new Font(Font.FontFamily.HELVETICA, 11, Font.NORMAL, BaseColor.BLACK);
            for (List<String> rowData : data) {
                for (String cellData : rowData) {
                    PdfPCell dataCell = new PdfPCell(new Phrase(cellData, dataFont));
                    dataCell.setPadding(8); 
                    dataCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                    dataCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                    table.addCell(dataCell);
                }
            }

            document.add(table);
            document.close();

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }

        return filename;
    }

   
    private float[] calculateColumnWidths(List<String> headers, List<List<String>> data) {
        int[] maxColumnLengths = new int[headers.size()];

        for (int i = 0; i < headers.size(); i++) {
            maxColumnLengths[i] = headers.get(i).length();
        }

        for (List<String> rowData : data) {
            for (int i = 0; i < rowData.size(); i++) {
                maxColumnLengths[i] = Math.max(maxColumnLengths[i], rowData.get(i).length());
            }
        }

        float[] columnWidths = new float[headers.size()];
        int totalLength = 0;
        for (int length : maxColumnLengths) {
            totalLength += length;
        }

        for (int i = 0; i < headers.size(); i++) {
            columnWidths[i] = (float) maxColumnLengths[i] / totalLength * 100;
        }

        return columnWidths;
    }
   

    public String generateReceiptPdf(String pdfPath, String fileName, ReceiptData receiptData) throws DocumentException {
        File reportDir = new File(pdfPath);
        if (!reportDir.exists()) {
            reportDir.mkdirs();
        }
        String filename = reportDir + "/" + fileName + ".pdf";
        try {
            Document document = new Document(PageSize.A4, 36, 36, 36, 36);
            PdfWriter.getInstance(document, new FileOutputStream(filename));
            document.open();

            Font titleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD, BaseColor.BLACK);
            PdfPTable titleTable = new PdfPTable(1);
            titleTable.setWidthPercentage(100);
            PdfPCell titleCell = new PdfPCell(new Phrase("Payment Receipt", titleFont));
            titleCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            titleCell.setPadding(10);
            titleCell.setBorder(Rectangle.NO_BORDER);
            titleCell.setBackgroundColor(new BaseColor(230, 230, 250));
            titleTable.addCell(titleCell);
            document.add(titleTable);

            document.add(new Paragraph("\n"));

            Font labelFont = new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD, BaseColor.BLACK);
            Font valueFont = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL, BaseColor.BLACK);

            PdfPTable detailTable = new PdfPTable(2);
            detailTable.setWidthPercentage(100);
            detailTable.setSpacingBefore(10f);
            detailTable.setSpacingAfter(10f);
            detailTable.setWidths(new float[] { 1, 2 });

            addReceiptDetail(detailTable, "Transaction ID:", receiptData.getTransactionId(), labelFont, valueFont, true);
            addReceiptDetail(detailTable, "Customer ID:", receiptData.getCustomerId(), labelFont, valueFont, false);
            addReceiptDetail(detailTable, "Customer Name:", receiptData.getCustomerName(), labelFont, valueFont, true);
            addReceiptDetail(detailTable, "Amount:", String.format("Rs. %.2f", receiptData.getAmount()), labelFont, valueFont, false);
            addReceiptDetail(detailTable, "Date:", receiptData.getDate(), labelFont, valueFont, true);
            addReceiptDetail(detailTable, "Description:", receiptData.getDescription(), labelFont, valueFont, false);

            document.add(detailTable);

            document.add(new Paragraph("\n"));

            Font successFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD, BaseColor.GREEN);
            PdfPCell successCell = new PdfPCell(new Phrase("Transaction Successful", successFont));
            successCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            successCell.setPadding(10);
            successCell.setBorder(Rectangle.BOX);
            successCell.setBackgroundColor(new BaseColor(230, 255, 230));
            PdfPTable successTable = new PdfPTable(1);
            successTable.setWidthPercentage(100);
            successTable.addCell(successCell);
            document.add(successTable);

            document.close();

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }

        return filename;
    }

    private void addReceiptDetail(PdfPTable table, String label, String value, Font labelFont, Font valueFont, boolean isShaded) {
        BaseColor rowColor = isShaded ? new BaseColor(245, 245, 245) : BaseColor.WHITE;

        PdfPCell labelCell = new PdfPCell(new Phrase(label, labelFont));
        labelCell.setBorder(Rectangle.BOX);
        labelCell.setPadding(5);
        labelCell.setBackgroundColor(rowColor);

        PdfPCell valueCell = new PdfPCell(new Phrase(value, valueFont));
        valueCell.setBorder(Rectangle.BOX);
        valueCell.setPadding(5);
        valueCell.setBackgroundColor(rowColor);

        table.addCell(labelCell);
        table.addCell(valueCell);
    }
}
