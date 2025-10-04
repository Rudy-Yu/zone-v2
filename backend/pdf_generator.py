from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from datetime import datetime
import os

class PDFGenerator:
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self.setup_custom_styles()
    
    def setup_custom_styles(self):
        """Setup custom styles for PDF generation"""
        # Title style
        self.styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=18,
            spaceAfter=30,
            alignment=TA_CENTER,
            textColor=colors.darkblue
        ))
        
        # Subtitle style
        self.styles.add(ParagraphStyle(
            name='CustomSubtitle',
            parent=self.styles['Heading2'],
            fontSize=14,
            spaceAfter=12,
            textColor=colors.darkblue
        ))
        
        # Normal style
        self.styles.add(ParagraphStyle(
            name='CustomNormal',
            parent=self.styles['Normal'],
            fontSize=10,
            spaceAfter=6
        ))
        
        # Small style
        self.styles.add(ParagraphStyle(
            name='CustomSmall',
            parent=self.styles['Normal'],
            fontSize=8,
            spaceAfter=4
        ))

    def generate_invoice_pdf(self, invoice_data, output_path):
        """Generate PDF for sales invoice"""
        doc = SimpleDocTemplate(output_path, pagesize=A4)
        story = []
        
        # Title
        story.append(Paragraph("INVOICE PENJUALAN", self.styles['CustomTitle']))
        story.append(Spacer(1, 12))
        
        # Invoice details
        invoice_info = [
            ['Invoice ID:', invoice_data.get('id', '')],
            ['Tanggal:', invoice_data.get('invoice_date', '')],
            ['Jatuh Tempo:', invoice_data.get('due_date', '')],
            ['Status:', invoice_data.get('status', '')]
        ]
        
        invoice_table = Table(invoice_info, colWidths=[2*inch, 3*inch])
        invoice_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        
        story.append(invoice_table)
        story.append(Spacer(1, 20))
        
        # Customer info
        story.append(Paragraph("INFORMASI CUSTOMER", self.styles['CustomSubtitle']))
        customer_info = [
            ['Nama:', invoice_data.get('customer_name', '')],
            ['ID Customer:', invoice_data.get('customer_id', '')]
        ]
        
        customer_table = Table(customer_info, colWidths=[2*inch, 3*inch])
        customer_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        
        story.append(customer_table)
        story.append(Spacer(1, 20))
        
        # Items table
        story.append(Paragraph("DETAIL ITEM", self.styles['CustomSubtitle']))
        
        items_data = invoice_data.get('items', [])
        if items_data:
            # Table headers
            table_data = [['No', 'Produk', 'Qty', 'Harga Satuan', 'Total']]
            
            # Add items
            for i, item in enumerate(items_data, 1):
                table_data.append([
                    str(i),
                    item.get('product_name', ''),
                    str(item.get('quantity', 0)),
                    f"Rp {item.get('unit_price', 0):,}",
                    f"Rp {item.get('total', 0):,}"
                ])
            
            # Add total row
            total_amount = invoice_data.get('amount', 0)
            table_data.append(['', '', '', 'TOTAL:', f"Rp {total_amount:,}"])
            
            items_table = Table(table_data, colWidths=[0.5*inch, 2*inch, 0.8*inch, 1.2*inch, 1.2*inch])
            items_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 9),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
                ('BACKGROUND', (0, -1), (-1, -1), colors.lightgrey),
                ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
            ]))
            
            story.append(items_table)
        
        story.append(Spacer(1, 30))
        
        # Footer
        story.append(Paragraph(f"Dicetak pada: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}", self.styles['CustomSmall']))
        
        doc.build(story)
        return output_path

    def generate_order_pdf(self, order_data, output_path):
        """Generate PDF for sales order"""
        doc = SimpleDocTemplate(output_path, pagesize=A4)
        story = []
        
        # Title
        story.append(Paragraph("SALES ORDER", self.styles['CustomTitle']))
        story.append(Spacer(1, 12))
        
        # Order details
        order_info = [
            ['Order ID:', order_data.get('id', '')],
            ['Order Number:', order_data.get('order_number', '')],
            ['Tanggal Order:', order_data.get('order_date', '')],
            ['Tanggal Pengiriman:', order_data.get('delivery_date', '')],
            ['Status:', order_data.get('status', '')]
        ]
        
        order_table = Table(order_info, colWidths=[2*inch, 3*inch])
        order_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        
        story.append(order_table)
        story.append(Spacer(1, 20))
        
        # Customer info
        story.append(Paragraph("INFORMASI CUSTOMER", self.styles['CustomSubtitle']))
        customer_info = [
            ['Nama:', order_data.get('customer_name', '')],
            ['ID Customer:', order_data.get('customer_id', '')]
        ]
        
        customer_table = Table(customer_info, colWidths=[2*inch, 3*inch])
        customer_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        
        story.append(customer_table)
        story.append(Spacer(1, 20))
        
        # Items table
        story.append(Paragraph("DETAIL ITEM", self.styles['CustomSubtitle']))
        
        items_data = order_data.get('items', [])
        if items_data:
            # Table headers
            table_data = [['No', 'Produk', 'Qty', 'Harga Satuan', 'Total']]
            
            # Add items
            for i, item in enumerate(items_data, 1):
                table_data.append([
                    str(i),
                    item.get('product_name', ''),
                    str(item.get('quantity', 0)),
                    f"Rp {item.get('unit_price', 0):,}",
                    f"Rp {item.get('total', 0):,}"
                ])
            
            # Add total row
            total_amount = order_data.get('total_amount', 0)
            table_data.append(['', '', '', 'TOTAL:', f"Rp {total_amount:,}"])
            
            items_table = Table(table_data, colWidths=[0.5*inch, 2*inch, 0.8*inch, 1.2*inch, 1.2*inch])
            items_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 9),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
                ('BACKGROUND', (0, -1), (-1, -1), colors.lightgrey),
                ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
            ]))
            
            story.append(items_table)
        
        # Notes
        if order_data.get('notes'):
            story.append(Spacer(1, 20))
            story.append(Paragraph("CATATAN:", self.styles['CustomSubtitle']))
            story.append(Paragraph(order_data.get('notes', ''), self.styles['CustomNormal']))
        
        story.append(Spacer(1, 30))
        
        # Footer
        story.append(Paragraph(f"Dicetak pada: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}", self.styles['CustomSmall']))
        
        doc.build(story)
        return output_path

    def generate_quotation_pdf(self, quotation_data, output_path):
        """Generate PDF for quotation"""
        doc = SimpleDocTemplate(output_path, pagesize=A4)
        story = []
        
        # Title
        story.append(Paragraph("QUOTATION", self.styles['CustomTitle']))
        story.append(Spacer(1, 12))
        
        # Quotation details
        quotation_info = [
            ['Quotation ID:', quotation_data.get('id', '')],
            ['Quotation Number:', quotation_data.get('quotation_number', '')],
            ['Tanggal Quotation:', quotation_data.get('quotation_date', '')],
            ['Valid Until:', quotation_data.get('valid_until', '')],
            ['Status:', quotation_data.get('status', '')]
        ]
        
        quotation_table = Table(quotation_info, colWidths=[2*inch, 3*inch])
        quotation_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        
        story.append(quotation_table)
        story.append(Spacer(1, 20))
        
        # Customer info
        story.append(Paragraph("INFORMASI CUSTOMER", self.styles['CustomSubtitle']))
        customer_info = [
            ['Nama:', quotation_data.get('customer_name', '')],
            ['ID Customer:', quotation_data.get('customer_id', '')]
        ]
        
        customer_table = Table(customer_info, colWidths=[2*inch, 3*inch])
        customer_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        
        story.append(customer_table)
        story.append(Spacer(1, 20))
        
        # Items table
        story.append(Paragraph("DETAIL ITEM", self.styles['CustomSubtitle']))
        
        items_data = quotation_data.get('items', [])
        if items_data:
            # Table headers
            table_data = [['No', 'Produk', 'Qty', 'Harga Satuan', 'Total']]
            
            # Add items
            for i, item in enumerate(items_data, 1):
                table_data.append([
                    str(i),
                    item.get('product_name', ''),
                    str(item.get('quantity', 0)),
                    f"Rp {item.get('unit_price', 0):,}",
                    f"Rp {item.get('total', 0):,}"
                ])
            
            # Add total row
            total_amount = quotation_data.get('total_amount', 0)
            table_data.append(['', '', '', 'TOTAL:', f"Rp {total_amount:,}"])
            
            items_table = Table(table_data, colWidths=[0.5*inch, 2*inch, 0.8*inch, 1.2*inch, 1.2*inch])
            items_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 9),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
                ('BACKGROUND', (0, -1), (-1, -1), colors.lightgrey),
                ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
            ]))
            
            story.append(items_table)
        
        # Notes
        if quotation_data.get('notes'):
            story.append(Spacer(1, 20))
            story.append(Paragraph("CATATAN:", self.styles['CustomSubtitle']))
            story.append(Paragraph(quotation_data.get('notes', ''), self.styles['CustomNormal']))
        
        story.append(Spacer(1, 30))
        
        # Footer
        story.append(Paragraph(f"Dicetak pada: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}", self.styles['CustomSmall']))
        
        doc.build(story)
        return output_path
