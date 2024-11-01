import { createInterface } from 'node:readline';
import { FileTypes, generateFile } from './generate-file';

(async () => {
  const ri = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const name = await new Promise<string>((resolve) => {
    ri.question('What is the name of the module? ', resolve);
  });

  const path = await new Promise<string>((resolve) => {
    ri.question('What is the path of the module? ', resolve);
    ri.write('lib/api');
  });

  ri.close();

  const fileTypes = Object.values(FileTypes);
  const result = await Promise.all(
    fileTypes.map(async (type) => {
      return generateFile({
        type,
        name,
        path,
      });
    }),
  );

  console.log(`Successfully generated ${result.length} files: \n`, result);
})();
