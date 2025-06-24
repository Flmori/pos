import logoImage from '../../assets/images/logo_meko_no_mori.png';

/**
 * Adds the official header to the given jsPDF instance.
 * @param {jsPDF} pdf - The jsPDF instance to add the header to.
 */
export async function addPdfHeader(pdf) {
  // Coordinates and sizes
  const pageWidth = pdf.internal.pageSize.getWidth();
  const headerHeight = 18;
  const logoWidth = 10;
  const logoHeight = 10;
  const margin = 8;
  const textStartX = margin + logoWidth + 4;
  const centerY = headerHeight / 2;

  // Draw white background for header
  pdf.setFillColor(255, 255, 255);
  pdf.rect(0, 0, pageWidth, headerHeight, 'F');

  // Draw horizontal line below header
  pdf.setDrawColor(0);
  pdf.setLineWidth(0.5);
  pdf.line(0, headerHeight + 4, pageWidth, headerHeight + 4);

  // Add logo image on left
  try {
    pdf.addImage(logoImage, 'PNG', margin, (headerHeight - logoHeight) / 2, logoWidth, logoHeight);
  } catch (error) {
    // If image loading fails, fallback to placeholder text
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.text('[LOGO TOKO KYURYU]', margin, centerY);
  }

  // Add store name and contact info on right side of logo
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.text('TOKO KYURYU', textStartX, 7);

  pdf.setFontSize(6);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Jl. Contoh Raya No. 123, Surabaya, Jawa Timur', textStartX, 12);
  pdf.text('Telp: 0812-3456-7890', textStartX, 16);
  pdf.text('Email: info@tokokyuryu.com', textStartX, 19);
}

export async function addPdfHeaderReceiving(pdf) {
  // Coordinates and sizes for A4 paper
  const pageWidth = pdf.internal.pageSize.getWidth();
  const headerHeight = 40;
  const logoWidth = 30;
  const logoHeight = 30;
  const margin = 15;
  const textStartX = margin + logoWidth + 10;
  const centerY = headerHeight / 2;

  // Draw white background for header
  pdf.setFillColor(255, 255, 255);
  pdf.rect(0, 0, pageWidth, headerHeight, 'F');

  // Draw horizontal line below header
  pdf.setDrawColor(0);
  pdf.setLineWidth(0.5);
  pdf.line(0, headerHeight + 4, pageWidth, headerHeight + 4);

  // Add logo image on left
  try {
    pdf.addImage(logoImage, 'PNG', margin, (headerHeight - logoHeight) / 2, logoWidth, logoHeight);
  } catch (error) {
    // If image loading fails, fallback to placeholder text
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('[LOGO TOKO KYURYU]', margin, centerY);
  }

  // Add store name and contact info on right side of logo
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('TOKO KYURYU', textStartX, 18);

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Jl. Contoh Raya No. 123, Surabaya, Jawa Timur', textStartX, 28);
  pdf.text('Telp: 0812-3456-7890', textStartX, 36);
  pdf.text('Email: info@tokokyuryu.com', textStartX, 42);
}
