# AI Image Editor

This feature integrates FLUX.1 Kontext Pro, a state-of-the-art text-based image editing model from Black Forest Labs, into your SaaS application.

## Features

- **Text-based Image Editing**: Transform images using natural language prompts
- **Multiple Input Formats**: Support for JPEG, PNG, GIF, and WebP images
- **Flexible Output Options**: Choose from different aspect ratios and output formats
- **Safety Controls**: Adjustable safety tolerance levels
- **Real-time Processing**: Live feedback during image processing
- **Download Results**: Easy download of edited images

## Setup

1. **Environment Variables**: Add your Replicate API token to `.env.local`:
   ```
   REPLICATE_API_TOKEN="r8_your_token_here"
   ```

2. **Get Replicate API Token**: 
   - Sign up at [replicate.com](https://replicate.com)
   - Go to your account settings
   - Generate an API token

## Usage

### Basic Image Editing

1. Navigate to `/dashboard/image-editor`
2. Upload an image (optional)
3. Enter a descriptive prompt
4. Adjust settings as needed
5. Click "Edit Image"
6. Download your result

### Prompt Examples

- **Style Transfer**: "Make this a 90s cartoon"
- **Background Change**: "Change the background to a beach while keeping the person in the exact same position"
- **Object Addition**: "Add a red hat to the person"
- **Text Editing**: "Replace 'old text' with 'new text'"
- **Art Style**: "Convert to impressionist painting with visible brushstrokes"

### Best Practices

#### Be Specific
- Use exact colors and descriptions
- Avoid vague terms like "make it better"
- Name subjects directly: "the woman with short black hair" vs "she"

#### Preserve Intentionally
- Specify what should stay the same: "while keeping the same facial features"
- Use "maintain the original composition" to preserve layout
- For background changes: "Change the background to a beach while keeping the person in the exact same position"

#### Text Editing Tips
- Use quotation marks: "replace 'old text' with 'new text'"
- Stick to readable fonts
- Match text length when possible to preserve layout

#### Style Transfer
- Be specific about artistic styles: "impressionist painting" not "artistic"
- Reference known movements: "Renaissance" or "1960s pop art"
- Describe key traits: "visible brushstrokes, thick paint texture"

## API Endpoint

The image editor uses the `/api/image-edit` endpoint:

```typescript
POST /api/image-edit
Content-Type: application/json

{
  "prompt": "Make this a 90s cartoon",
  "input_image": "data:image/jpeg;base64,...", // optional
  "aspect_ratio": "match_input_image", // optional
  "output_format": "jpg", // optional
  "safety_tolerance": 2 // optional
}
```

Response:
```json
{
  "success": true,
  "url": "https://replicate.delivery/...",
  "prompt": "Make this a 90s cartoon"
}
```

## Settings

### Aspect Ratio
- `match_input_image`: Maintains the original image's aspect ratio
- `1:1`: Square format
- `4:3`, `3:4`: Standard formats
- `16:9`, `9:16`: Widescreen formats

### Output Format
- `jpg`: JPEG format (smaller file size)
- `png`: PNG format (supports transparency)
- `webp`: WebP format (modern, efficient)

### Safety Tolerance
- `0-6`: Controls content filtering
- `2`: Default (balanced)
- `0`: Most strict
- `6`: Most permissive

## Limitations

- Maximum file size: 10MB
- Supported formats: JPEG, PNG, GIF, WebP
- Prompt length: 1000 characters maximum
- Processing time: Varies based on image complexity

## Error Handling

The application provides clear error messages for:
- Invalid file formats
- File size limits
- API errors
- Network issues
- Authentication problems

## Commercial Use

When using FLUX.1 Kontext Pro through Replicate, you're free to use outputs commercially in apps, marketing, or any business use.

## Troubleshooting

### Common Issues

1. **"Unauthorized" Error**: Check your Replicate API token
2. **"Invalid image URL"**: Ensure the image URL is accessible and in a supported format
3. **"Prompt is required"**: Enter a descriptive prompt
4. **Processing fails**: Try simplifying your prompt or using a different image

### Performance Tips

- Use smaller images for faster processing
- Keep prompts concise but descriptive
- Use the default safety tolerance (2) for best results
- Consider the aspect ratio of your input image

## Support

For issues with the FLUX.1 Kontext Pro model itself, refer to the [official documentation](https://replicate.com/black-forest-labs/flux-kontext-pro). 