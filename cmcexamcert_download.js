document.addEventListener("DOMContentLoaded", () => {
    const submitButton = document.getElementById("submit");
  
    submitButton.addEventListener("click", async () => {
      const inputName = document.querySelector("#name");
      const inputIssueDate = document.querySelector("#Issue_Date");
      const inputFathersName = document.querySelector("#father_name");
      const inputClass = document.querySelector("#class");
      const inputRank = document.querySelector("#rank");
      const inputImage = document.getElementById("image");
  
      if (!inputName || !inputIssueDate || !inputFathersName || !inputClass || !inputRank || !inputImage) {
        alert("Some input fields are missing. Please check your form.");
        return;
      }
  
      const name = inputName.value.trim();
      const issuedate = inputIssueDate.value.trim();
      const fathername = inputFathersName.value.trim();
      const inclass = inputClass.value.trim();
      const rank = inputRank.value.trim();
      const imageFile = inputImage.files[0];
  
      if (name && issuedate && fathername && inclass && rank && imageFile) {
        try {
          const imageBytes = await imageFile.arrayBuffer();
          generatePDF(name, fathername, issuedate, inclass, rank, imageBytes);
        } catch (error) {
          console.error("Error processing form data:", error);
          alert("An error occurred while generating the certificate.");
        }
      } else {
        alert("Please fill out all fields and upload an image to generate the certificate.");
      }
    });
  });
  
  const generatePDF = async (
    name,
    Fathers_Name,
    Issue_Date,
    InClass,
    Rank,
    uploadedImageBytes
  ) => {
    const { PDFDocument, rgb } = PDFLib; // Import rgb here
  
    // Fetch certificate PDF
    const exBytes = await fetch("./CMC_Exam_Certificate_latest.pdf").then(
      (res) => res.arrayBuffer()
    );
  
    // Fetch fonts
    const exFont = await fetch("./Sanchez-Regular.ttf").then((res) =>
      res.arrayBuffer()
    );
    const exFontName = await fetch("./Yellowtail-Regular.ttf").then((res) =>
      res.arrayBuffer()
    );
    const exFontFather = await fetch(
      "./YanoneKaffeesatz-VariableFont_wght.ttf"
    ).then((res) => res.arrayBuffer());
    const exClass = await fetch(
        "FacultyGlyphic-Regular.ttf"
      ).then((res) => res.arrayBuffer());
  
    const pdfDoc = await PDFDocument.load(exBytes);
    pdfDoc.registerFontkit(fontkit);
  
    // Embed fonts
    const myFont = await pdfDoc.embedFont(exFont);
    const myFontName = await pdfDoc.embedFont(exFontName);
    const myFontFather = await pdfDoc.embedFont(exFontFather);
    const myClass = await pdfDoc.embedFont(exClass);
  
    const pages = pdfDoc.getPages();
    const firstPg = pages[0];
  
    const { degrees } = PDFLib;
  
    // Embed uploaded image
    try {
      const uploadedImage = await pdfDoc.embedPng(uploadedImageBytes);
      const uploadedImageDims = uploadedImage.scale(0.30);
  
      firstPg.drawImage(uploadedImage, {
        x: firstPg.getWidth() / 2 - uploadedImageDims.width / 2 - 460,
        y: firstPg.getHeight() / 2 - uploadedImageDims.height / 2 - 15,
        width: uploadedImageDims.width,
        height: uploadedImageDims.height,
        // rotate: degrees(90), // Angle should be in radians, not degrees
        // rotateOrigin: [315, 265] // Adjust rotation center to the text position
      });
    } catch (error) {
      console.error("Error embedding PNG:", error);
      alert("Failed to embed the uploaded image. Ensure it's a valid PNG file.");
      return;
    }

    const nameWidth = myFont.widthOfTextAtSize(name, 16);
    const nameX = (firstPg.getWidth() - nameWidth) / 2;
  
    // Draw text
    firstPg.drawText(name, {
      x: 500,
      y: nameX - 250,
      color: PDFLib.rgb(1, 0, 0),
      size: 90,
      font: myFontName,
    //   rotate: degrees(90), // Angle should be in radians, not degrees
    //   rotateOrigin: [315, 265] // Adjust rotation center to the text position
    });
  
    firstPg.drawText(Fathers_Name, {
      x: 500,
      y: 195,
      color: PDFLib.rgb(0.247, 0.188, 0.851),
      size: 70,
      font: myFontFather,
    //   rotate: degrees(90), // Angle should be in radians, not degrees
    //   rotateOrigin: [315, 265] // Adjust rotation center to the text position
    });
  
    firstPg.drawText(Issue_Date, {
      x: 900,
      y: 62,
      size: 30,
      font: myFont,
    //   rotate: degrees(90), // Angle should be in radians, not degrees
    //   rotateOrigin: [315, 265] // Adjust rotation center to the text position
    });
  
    // const awardedToWidth = myFont.widthOfTextAtSize(InClass, 16);
    // const awardedToX = (firstPg.getWidth() - awardedToWidth) / 2;
    firstPg.drawText(InClass, {
      x: 85,
      y: 37,
      size: 55,
      font: myClass,
      color: PDFLib.rgb(1.0, 1.0, 1.0),
    //   rotate: degrees(90), // Angle should be in radians, not degrees
    //   rotateOrigin: [315, 265] // Adjust rotation center to the text position
    });

    firstPg.drawText(Rank, {
        x: 285,
        y: 312,
        size: 37,
        font: myFont,
        color: PDFLib.rgb(1.0, 1.0, 1.0),
        // rotate: degrees(90), // Angle should be in radians, not degrees
        // rotateOrigin: [315, 265] // Adjust rotation center to the text position
      });
  
    // Save the modified PDF
    const uri = await pdfDoc.saveAsBase64({ dataUri: true });
    saveAs(uri, name + ".pdf", { autoBom: true });
  };