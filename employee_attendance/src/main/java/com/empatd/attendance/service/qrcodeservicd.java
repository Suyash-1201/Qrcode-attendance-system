package com.empatd.attendance.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.imageio.ImageIO;

import org.springframework.stereotype.Service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;

@Service
public class qrcodeservicd {
	
	public byte[] generateqrcode(String qrtoken) throws WriterException,IOException {
		
		QRCodeWriter writer=new QRCodeWriter();
		
		Map<EncodeHintType, Object> hints=new HashMap<EncodeHintType, Object>();
		
		hints.put(EncodeHintType.MARGIN, 2);
		
		BitMatrix bit=writer.encode(qrtoken, BarcodeFormat.QR_CODE, 300, 300);
		
		ByteArrayOutputStream output=new ByteArrayOutputStream();
		
		ImageIO.write(MatrixToImageWriter.toBufferedImage(bit), "PNG", output);
		
		
		return output.toByteArray();
	}

}
