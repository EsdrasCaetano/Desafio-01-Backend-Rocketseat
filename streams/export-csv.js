import fs from 'fs';
import * as csv from 'fast-csv';

export async function exportCsv(data, filePath) {
  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(filePath);
    const csvStream = csv.format({ headers: true });

    csvStream.pipe(writeStream)
      .on('error', reject)
      .on('end', resolve);

    data.forEach(row => csvStream.write(row));

    csvStream.end();
  });
}