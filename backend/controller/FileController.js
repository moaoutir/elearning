const { PdfKitService } = require("../services/pdfService");

class FileController {
  static async show(name_student,name_trainer, res){
      const nameCertificate = name_student+Date.now()+".pdf"
      const pdfKitService = new PdfKitService();
      const pdfStream = await pdfKitService.generatePdf(name_student,name_trainer);
      res
        .writeHead(200, {
          'Content-Length': Buffer.byteLength(pdfStream),
          'Content-Type': 'application/pdf',
          'Content-disposition': 'attachment;filename='+nameCertificate,
        })
        .end(pdfStream);

    }
  }

module.exports = FileController;
