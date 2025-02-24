import qrcode
from fpdf import FPDF
from PIL import Image
import io
import os
from typing import List
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

class QRCodeGenerator:
    def __init__(self, version: int = 2, error_correction: int = qrcode.constants.ERROR_CORRECT_L, box_size: int = 20, border: int = 4):
        logging.debug(f"Initializing QRCodeGenerator with version={version}, error_correction={error_correction}, box_size={box_size}, border={border}")
        self.version = version
        self.error_correction = error_correction
        self.box_size = box_size
        self.border = border

    def generate_qr_code(self, url: str) -> Image.Image:
        logging.debug(f"Generating QR code for URL: {url}")
        qr = qrcode.QRCode(
            version=self.version,
            error_correction=self.error_correction,
            box_size=self.box_size,
            border=self.border,
        )
        qr.add_data(url)
        qr.make(fit=True)
        img = qr.make_image(fill='black', back_color='white')
        logging.debug("QR code generated successfully")
        return img

    def save_qr_image_to_bytes(self, qr_img: Image.Image) -> io.BytesIO:
        logging.debug("Saving QR image to bytes")
        img_byte_arr = io.BytesIO()
        qr_img.save(img_byte_arr, format='PNG')
        img_byte_arr.seek(0)
        logging.debug("QR image saved to bytes successfully")
        return img_byte_arr

class PDFWithQRCodes:
    def __init__(self, output_dir: str = "output", output_filename: str = "qr_codes.pdf"):
        logging.debug(f"Initializing PDFWithQRCodes with output_dir={output_dir}, output_filename={output_filename}")
        self.pdf = FPDF(orientation='L', format='letter')
        self.pdf.set_auto_page_break(auto=False)
        self.output_dir = output_dir
        self.output_filename = os.path.join(output_dir, output_filename)
        os.makedirs(output_dir, exist_ok=True)
        logging.debug("PDFWithQRCodes initialized successfully")

    def add_qr_code_to_pdf(self, img_byte_arr: io.BytesIO, index: int, position: int) -> None:
        logging.debug(f"Adding QR code to PDF at index={index}, position={position}")
        with Image.open(img_byte_arr) as img:
            images_dir = os.path.join(self.output_dir, "images")
            os.makedirs(images_dir, exist_ok=True)
            img_path = os.path.join(images_dir, f"qr_temp_{index}.png")
            img.save(img_path)
            pdf_w = (self.pdf.w - 60) / 2
            x = 20 + (position % 2) * (pdf_w + 20)
            y = 20
            self.pdf.image(img_path, x=x, y=y + 10, w=pdf_w)
        
        self.pdf.set_font("Arial", size=12)
        self.pdf.text(x=x + pdf_w / 2, y=y + pdf_w + 20, txt=str(index))
        self.pdf.set_font("Arial", size=36, style='B')
        self.pdf.text(x=x + pdf_w / 2 - 30, y=y + 5, txt="SCAN ME")
        logging.debug("QR code added to PDF successfully")

    def draw_perforation_line(self):
        logging.debug("Drawing perforation line")
        self.pdf.set_draw_color(0, 0, 0)  # Black color
        self.pdf.set_line_width(0.5)
        pdf_w = self.pdf.w
        pdf_h = self.pdf.h
        for y in range(0, int(pdf_h), 10):
            self.pdf.line(pdf_w / 2, y, pdf_w / 2, y + 5)
        logging.debug("Perforation line drawn successfully")

    def create_pdf_with_qr_codes(self, urls: List[str]) -> None:
        logging.debug("Creating PDF with QR codes")
        qr_generator = QRCodeGenerator()
        
        for index, url in enumerate(urls, start=1):
            if (index - 1) % 2 == 0:
                self.pdf.add_page()
                self.draw_perforation_line()
            
            qr_img = qr_generator.generate_qr_code(url)
            img_byte_arr = qr_generator.save_qr_image_to_bytes(qr_img)
            self.add_qr_code_to_pdf(img_byte_arr, index, (index - 1) % 2)
        
        self.pdf.output(self.output_filename)
        logging.debug(f"PDF created successfully and saved to {self.output_filename}")

def main():
    logging.debug("Starting main function")
    urls = ["https://qr.jbhs-pl.addisonking.rocks/redir/{}".format(x) for x in range(1, 61)]
    
    pdf_creator = PDFWithQRCodes()
    pdf_creator.create_pdf_with_qr_codes(urls)
    logging.debug("Completed main function")

if __name__ == "__main__":
    main()
