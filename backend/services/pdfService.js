var PDFDocument = require("pdfkit");
var getStream = require("get-stream");
class PdfKitService {

  async generatePdf(name_student,name_trainer) {
    try {
      const doc = new PDFDocument({
        size: [800, 520],
        margins: { top: 1, bottom: 1, left: 1, right: 1 },
      });
      const distanceMargin = 18;
      doc
        .fillAndStroke("#0e8cc3")
        .lineWidth(20)
        .lineJoin("round")
        .rect(
          distanceMargin,
          distanceMargin,
          doc.page.width - distanceMargin * 2,
          doc.page.height - distanceMargin * 2
        )
        .stroke();
      // on cree une image au centre
      const maxWidth = 170;
      const maxHeight = 90;
      doc.image(
        "src/assets/default-image/logo.png",
        doc.page.width / 2 - maxWidth / 2,
        50,
        {
          fit: [maxWidth, maxHeight],
          align: "center",
        }
      );
      // on cree l'image de qr code
      const maxWidthQr = 130;
      const maxHeightQr = 70;
      doc.image(
        "src/assets/default-image/Qr_code.jpg",
        doc.page.width / 2 - maxWidthQr / 2,
        410,
        {
          fit: [maxWidthQr, maxHeightQr],
          align: "center",
        }
      );
      jumpLine(doc, 9);
      doc.fontSize(10).fill("#021c27").text("Super Course for Awesomes", {
        align: "center",
      });
      jumpLine(doc, 3);
      doc.fontSize(20).fill("#021c27").text("CERTIFICATE OF COMPLETION", {
        align: "center",
      });
      jumpLine(doc, 1);
      doc.fontSize(9).fill("#021c27").text("Present to", {
        align: "center",
      });
      jumpLine(doc, 2);
      doc
        .fontSize(20)
        .font("Helvetica-Bold")
        .fill("#021c27")
        .text(name_student, {
          // name_student
          align: "center",
        });
      jumpLine(doc, 1);
      doc
        .fontSize(10)
        .fill("#021c27")
        .text("Successfully completed the super course for awesomes", {
          align: "center",
        });
      // trainer
      const lineSize = 174;
      const signatureHeight = 340;
      doc.lineWidth(1);
      doc.fillAndStroke("#021c27");
      doc.strokeOpacity(0.2);
      const startLine1 = 100;
      const endLine1 = 100 + lineSize;
      // Creates a line
      doc
        .moveTo(startLine1, signatureHeight)
        .lineTo(endLine1, signatureHeight)
        .stroke();
      // Evaluator info
      doc
        .fontSize(10)
        .fill("#021c27")
        .text(
          name_trainer, //name_trainer
          startLine1,
          signatureHeight + 10,
          {
            columns: 1,
            columnGap: 0,
            height: 40,
            width: lineSize,
            align: "center",
          }
        );
      doc
        .fontSize(10)
        .fill("#021c27")
        .text("Associate Professor", startLine1, signatureHeight + 25, {
          columns: 1,
          columnGap: 0,
          height: 40,
          width: lineSize,
          align: "center",
        });
      // student
      const signatureHeight2 = 340;
      doc.lineWidth(1);
      doc.fillAndStroke("#021c27");
      doc.strokeOpacity(0.2);
      const startLine2 = 525;
      const endLine2 = 525 + lineSize;
      doc
        .moveTo(startLine2, signatureHeight)
        .lineTo(endLine2, signatureHeight)
        .stroke();

      doc
        .fontSize(10)
        .fill("#021c27")
        .text(
          name_student, // name_student
          startLine2,
          signatureHeight + 10,
          {
            columns: 1,
            columnGap: 0,
            height: 40,
            width: lineSize,
            align: "center",
          }
        );
      doc
        .fontSize(10)
        .fill("#021c27")
        .text("Student", startLine2, signatureHeight + 25, {
          columns: 1,
          columnGap: 0,
          height: 40,
          width: lineSize,
          align: "center",
        });
      doc.end();
      const pdfStream = await getStream.buffer(doc);
      return pdfStream;
    } catch (error) {
      return null;
    }
  }
}
module.export={
  PdfKitService,
};
