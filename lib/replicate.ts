import Replicate from 'replicate';

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Types for FLUX.1 Kontext Pro
export interface FluxKontextInput {
  prompt: string;
  input_image?: string;
  aspect_ratio?: string;
  seed?: number;
  output_format?: string;
  safety_tolerance?: number;
}

export interface FluxKontextOutput {
  url: string;
}

/**
 * Run FLUX.1 Kontext Pro model for image editing
 */
export async function runFluxKontext(input: FluxKontextInput): Promise<string> {
  try {
    if (!process.env.REPLICATE_API_TOKEN) {
      throw new Error('REPLICATE_API_TOKEN is not configured');
    }

    const output = await replicate.run("black-forest-labs/flux-kontext-pro", { 
      input 
    });

    if (typeof output !== 'string') {
      throw new Error('Invalid output format from Replicate');
    }

    return output;
  } catch (error) {
    console.error('Error running FLUX.1 Kontext Pro:', error);
    throw new Error(`Failed to process image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Validate image URL format
 */
export function isValidImageUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const pathname = urlObj.pathname.toLowerCase();
    
    return validExtensions.some(ext => pathname.endsWith(ext));
  } catch {
    return false;
  }
}

/**
 * Validate prompt length and content
 */
export function validatePrompt(prompt: string): { isValid: boolean; error?: string } {
  if (!prompt || prompt.trim().length === 0) {
    return { isValid: false, error: 'Prompt is required' };
  }

  if (prompt.length > 1000) {
    return { isValid: false, error: 'Prompt must be less than 1000 characters' };
  }

  return { isValid: true };
} 