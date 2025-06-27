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
    
    // Handle specific Replicate errors
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      
      // Rate limiting / system overload
      if (errorMessage.includes('too many tasks') || errorMessage.includes('processing too many')) {
        throw new Error('The AI service is currently busy. Please try again in a few minutes.');
      }
      
      // Authentication errors
      if (errorMessage.includes('unauthorized') || errorMessage.includes('invalid token')) {
        throw new Error('Authentication failed. Please check your API configuration.');
      }
      
      // Model-specific errors
      if (errorMessage.includes('prediction failed')) {
        throw new Error('Image processing failed. Please try with a different image or prompt.');
      }
      
      // Network/timeout errors
      if (errorMessage.includes('timeout') || errorMessage.includes('network')) {
        throw new Error('Request timed out. Please check your connection and try again.');
      }
      
      // Generic error handling
      throw new Error(`Failed to process image: ${error.message}`);
    }
    
    throw new Error('An unexpected error occurred while processing your image.');
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