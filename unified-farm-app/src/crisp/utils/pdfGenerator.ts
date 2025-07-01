import jsPDF from 'jspdf';
import { GeneData } from '../types/GeneData';

export const generatePDF = (data: GeneData): void => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  let yPosition = margin;

  // Helper function to add text with word wrapping
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 11): number => {
    pdf.setFontSize(fontSize);
    const lines = pdf.splitTextToSize(text, maxWidth);
    pdf.text(lines, x, y);
    return y + (lines.length * fontSize * 0.4);
  };

  // Header
  pdf.setFontSize(20);
  pdf.setFont(undefined, 'bold');
  pdf.text('Crop Gene Information Report', margin, yPosition);
  yPosition += 15;

  pdf.setFontSize(12);
  pdf.setFont(undefined, 'normal');
  pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, yPosition);
  yPosition += 20;

  // Gene Overview Section
  pdf.setFontSize(16);
  pdf.setFont(undefined, 'bold');
  pdf.text('Gene Overview', margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(11);
  pdf.setFont(undefined, 'normal');
  
  const overviewData = [
    `Crop: ${data.crop}`,
    `Trait: ${data.trait}`,
    `Gene ID: ${data.gene.ensembl_id}`,
    `Gene Symbol: ${data.gene.symbol}`,
    `Source: ${data.source}`,
    `Sequence Length: ${data.sequence_length.toLocaleString()} bp`
  ];

  overviewData.forEach(item => {
    pdf.text(item, margin, yPosition);
    yPosition += 7;
  });

  yPosition += 10;

  // gRNA Table Section
  pdf.setFontSize(16);
  pdf.setFont(undefined, 'bold');
  pdf.text('Top CRISPR gRNAs', margin, yPosition);
  yPosition += 15;

  // Table headers
  pdf.setFontSize(10);
  pdf.setFont(undefined, 'bold');
  const headers = ['Rank', 'Sequence (5\' → 3\')', 'PAM', 'Start', 'Strand', 'Score'];
  const colWidths = [15, 60, 15, 20, 20, 20];
  let xPos = margin;

  headers.forEach((header, index) => {
    pdf.text(header, xPos, yPosition);
    xPos += colWidths[index];
  });

  yPosition += 8;

  // Table data
  pdf.setFont(undefined, 'normal');
  data.top_grnas.forEach((grna, index) => {
    xPos = margin;
    const rowData = [
      (index + 1).toString(),
      grna.sequence,
      grna.pam,
      grna.start.toString(),
      grna.strand,
      grna.score.toFixed(2)
    ];

    rowData.forEach((cell, cellIndex) => {
      if (cellIndex === 1) { // Sequence column - use monospace
        pdf.setFont('courier', 'normal');
        pdf.text(cell, xPos, yPosition);
        pdf.setFont(undefined, 'normal');
      } else {
        pdf.text(cell, xPos, yPosition);
      }
      xPos += colWidths[cellIndex];
    });

    yPosition += 7;

    // Check if we need a new page
    if (yPosition > pdf.internal.pageSize.getHeight() - 40) {
      pdf.addPage();
      yPosition = margin;
    }
  });

  yPosition += 15;

  // Gene Function & Analysis Section
  if (yPosition > pdf.internal.pageSize.getHeight() - 60) {
    pdf.addPage();
    yPosition = margin;
  }

  pdf.setFontSize(16);
  pdf.setFont(undefined, 'bold');
  pdf.text('Gene Function & Analysis', margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(11);
  pdf.setFont(undefined, 'normal');
  yPosition = addWrappedText(data.explanation, margin, yPosition, pageWidth - 2 * margin);

  // Footer
  const totalPages = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setFont(undefined, 'normal');
    pdf.text(
      `Page ${i} of ${totalPages} - Crop Gene Information System`,
      pageWidth / 2,
      pdf.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  // Save the PDF
  const filename = `${data.crop}_${data.trait}_gene_report.pdf`.replace(/\s+/g, '_').toLowerCase();
  pdf.save(filename);
};