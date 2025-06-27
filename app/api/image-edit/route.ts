import { NextRequest, NextResponse } from 'next/server';
import { runFluxKontext, validatePrompt, isValidImageUrl, type FluxKontextInput } from '@/lib/replicate';
import { getUser } from '@/lib/db/queries';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { prompt, input_image, aspect_ratio, seed, output_format, safety_tolerance } = body;

    // Validate prompt
    const promptValidation = validatePrompt(prompt);
    if (!promptValidation.isValid) {
      return NextResponse.json({ error: promptValidation.error }, { status: 400 });
    }

    // Validate input image if provided
    if (input_image && !isValidImageUrl(input_image)) {
      return NextResponse.json({ error: 'Invalid image URL format' }, { status: 400 });
    }

    // Prepare input for FLUX.1 Kontext Pro
    const input: FluxKontextInput = {
      prompt: prompt.trim(),
      output_format: output_format || 'jpg',
      safety_tolerance: safety_tolerance || 2,
    };

    // Add optional parameters if provided
    if (input_image) {
      input.input_image = input_image;
    }
    if (aspect_ratio) {
      input.aspect_ratio = aspect_ratio;
    }
    if (seed !== undefined) {
      input.seed = seed;
    }

    // Run the model
    const outputUrl = await runFluxKontext(input);

    return NextResponse.json({ 
      success: true, 
      url: outputUrl,
      prompt: input.prompt 
    });

  } catch (error) {
    console.error('Image edit API error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ 
      error: errorMessage 
    }, { status: 500 });
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
} 