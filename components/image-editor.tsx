'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Image, Upload, Wand2, Download, RefreshCw, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageEditResponse {
  success: boolean;
  url: string;
  prompt: string;
  error?: string;
}

interface ImageEditorProps {
  className?: string;
}

export function ImageEditor({ className }: ImageEditorProps) {
  const [prompt, setPrompt] = useState('');
  const [inputImageUrl, setInputImageUrl] = useState('');
  const [outputImageUrl, setOutputImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [aspectRatio, setAspectRatio] = useState('match_input_image');
  const [outputFormat, setOutputFormat] = useState('jpg');
  const [safetyTolerance, setSafetyTolerance] = useState(2);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setInputImageUrl(e.target?.result as string);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handleImageEdit = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/image-edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          input_image: inputImageUrl || undefined,
          aspect_ratio: aspectRatio,
          output_format: outputFormat,
          safety_tolerance: safetyTolerance,
        }),
      });

      const data: ImageEditResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process image');
      }

      setOutputImageUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!outputImageUrl) return;
    
    const link = document.createElement('a');
    link.href = outputImageUrl;
    link.download = `edited-image.${outputFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetForm = () => {
    setPrompt('');
    setInputImageUrl('');
    setOutputImageUrl('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            AI Image Editor
          </CardTitle>
          <CardDescription>
            Transform your images using FLUX.1 Kontext Pro - a state-of-the-art text-based image editing model
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Image Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              <h3 className="font-medium">Input Image (Optional)</h3>
            </div>
            
            <div className="grid gap-4">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                >
                  <Upload className="h-4 w-4" />
                  Upload Image
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setInputImageUrl('')}
                  disabled={!inputImageUrl || isLoading}
                >
                  Clear
                </Button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              {inputImageUrl && (
                <div className="relative">
                  <img
                    src={inputImageUrl}
                    alt="Input"
                    className="max-h-64 w-auto rounded-lg border"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Prompt Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              <h3 className="font-medium">Edit Prompt</h3>
            </div>
            
            <Textarea
              placeholder="Describe how you want to edit the image... (e.g., 'Make this a 90s cartoon', 'Change the background to a beach', 'Add a red hat to the person')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isLoading}
              rows={4}
            />
            
            <div className="text-sm text-muted-foreground">
              <p className="mb-2 font-medium">Prompting Tips:</p>
              <ul className="space-y-1 text-xs">
                <li>• Be specific with colors, styles, and descriptions</li>
                <li>• Use "while keeping..." to preserve specific elements</li>
                <li>• For text editing, use quotes: "replace 'old text' with 'new text'"</li>
                <li>• Reference art styles: "impressionist painting", "1960s pop art"</li>
              </ul>
            </div>
          </div>

          {/* Settings Section */}
          <div className="space-y-4">
            <h3 className="font-medium">Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Aspect Ratio</label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  disabled={isLoading}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                >
                  <option value="match_input_image">Match Input Image</option>
                  <option value="1:1">1:1 (Square)</option>
                  <option value="4:3">4:3</option>
                  <option value="3:4">3:4</option>
                  <option value="16:9">16:9</option>
                  <option value="9:16">9:16</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Output Format</label>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                  disabled={isLoading}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                >
                  <option value="jpg">JPEG</option>
                  <option value="png">PNG</option>
                  <option value="webp">WebP</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Safety Tolerance</label>
                <select
                  value={safetyTolerance}
                  onChange={(e) => setSafetyTolerance(Number(e.target.value))}
                  disabled={isLoading}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                >
                  <option value={0}>Most Strict (0)</option>
                  <option value={1}>Strict (1)</option>
                  <option value={2}>Default (2)</option>
                  <option value={3}>Permissive (3)</option>
                  <option value={4}>More Permissive (4)</option>
                  <option value={5}>Very Permissive (5)</option>
                  <option value={6}>Most Permissive (6)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span className="text-sm text-destructive">{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleImageEdit}
              disabled={isLoading || !prompt.trim()}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" />
                  Edit Image
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={resetForm}
              disabled={isLoading}
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Output Image Section */}
      {outputImageUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Result</CardTitle>
            <CardDescription>Your edited image is ready!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <img
                src={outputImageUrl}
                alt="Edited"
                className="max-h-96 w-auto rounded-lg border"
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleDownload} className="flex-1">
                <Download className="h-4 w-4" />
                Download Image
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setOutputImageUrl('')}
              >
                Clear Result
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 