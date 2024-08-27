import path from 'path';
import fs from 'fs';
import { Response } from 'express';

// Utility function to serve a file
export const serveFile = (res: Response, filePath: string) => {
  const fullPath = path.resolve(filePath); // Ensure absolute path

  if (fs.existsSync(fullPath)) {
    const ext = path.extname(fullPath).toLowerCase();
    let contentType = 'application/octet-stream';
    let contentDisposition = 'inline'; // Change to 'attachment' for download

    // Determine content type based on file extension
    if (ext === '.pdf') {
      contentType = 'application/pdf';
    } else if (ext === '.png') {
      contentType = 'image/png';
    } else if (ext === '.jpg' || ext === '.jpeg') {
      contentType = 'image/jpeg';
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `${contentDisposition}; filename="${path.basename(fullPath)}"`);

    const readStream = fs.createReadStream(fullPath);
    readStream.on('error', (err) => {
      console.error('Error reading file:', err);
      if (!res.headersSent) {
        res.status(500).send('Error reading file');
      }
    });

    readStream.pipe(res);

    readStream.on('close', () => {
      console.log(`File sent: ${fullPath}`);
    });
  } else {
    if (!res.headersSent) {
      res.status(404).send('File not found');
    }
  }
};
