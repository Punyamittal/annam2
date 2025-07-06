import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs/promises';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    // Save the image temporarily
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const tempDir = path.join(process.cwd(), 'tmp');
    await fs.mkdir(tempDir, { recursive: true });
    const tempImagePath = path.join(tempDir, imageFile.name);
    await fs.writeFile(tempImagePath, buffer);

    // Path to the Python script
    const pythonScriptPath = path.join(process.cwd(), 'src', 'plantdiseaseprediction', 'app', 'main.py');

    // Execute the Python script
    // Note: This assumes 'python' command is available in the environment's PATH
    // and all Python dependencies are installed.
    const command = `python ${pythonScriptPath} ${tempImagePath}`;

    return new Promise((resolve) => {
      exec(command, async (error, stdout, stderr) => {
        // Clean up the temporary image file
        await fs.unlink(tempImagePath);

        if (error) {
          console.error(`exec error: ${error}`);
          console.error(`stderr: ${stderr}`);
          return resolve(NextResponse.json({ error: 'Prediction failed', details: stderr }, { status: 500 }));
        }
        
        // The Python script is a Streamlit app, so it won't directly output the prediction.
        // For a Next.js API, the Python script needs to be modified to output JSON.
        // For now, we'll return a placeholder or an error indicating the need for modification.
        console.log(`stdout: ${stdout}`);
        resolve(NextResponse.json({ message: 'Python script executed. main.py needs modification to return prediction as JSON.', stdout: stdout }, { status: 200 }));
      });
    });

  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}