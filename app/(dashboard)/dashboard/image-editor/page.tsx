import { ImageEditor } from '@/components/image-editor';
import { FluxExample } from '@/components/flux-example';

export default function ImageEditorPage() {
  return (
    <div className="my-16 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">AI Image Editor</h1>
          <p className="mt-2 text-muted-foreground">
            Transform your images using FLUX.1 Kontext Pro - a state-of-the-art text-based image editing model
          </p>
        </div>
        
        <div className="space-y-8">
          <FluxExample />
          <ImageEditor />
        </div>
      </div>
    </div>
  );
} 