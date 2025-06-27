'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2, RefreshCw, ExternalLink } from 'lucide-react';

export function FluxExample() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const examplePrompt = "Make this a 90s cartoon";
  const exampleImage = "https://replicate.delivery/pbxt/N55l5TWGh8mSlNzW8usReoaNhGbFwvLeZR3TX1NL4pd2Wtfv/replicate-prediction-f2d25rg6gnrma0cq257vdw2n4c.png";

  const runExample = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/image-edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: examplePrompt,
          input_image: exampleImage,
          aspect_ratio: 'match_input_image',
          output_format: 'jpg',
          safety_tolerance: 2,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process image');
      }

      setResult(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5" />
          FLUX.1 Kontext Pro Example
        </CardTitle>
        <CardDescription>
          Try the example from the model documentation: "Make this a 90s cartoon"
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">Input Image</h4>
            <img
              src={exampleImage}
              alt="Original"
              className="w-full rounded-lg border"
            />
          </div>
          
          {result && (
            <div>
              <h4 className="font-medium mb-2">Result</h4>
              <img
                src={result}
                alt="Edited"
                className="w-full rounded-lg border"
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-sm">
            <strong>Prompt:</strong> {examplePrompt}
          </p>
          
          {error && (
            <p className="text-sm text-destructive">
              <strong>Error:</strong> {error}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={runExample}
            disabled={isLoading}
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
                Run Example
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => window.open('https://replicate.com/black-forest-labs/flux-kontext-pro', '_blank')}
          >
            <ExternalLink className="h-4 w-4" />
            View Model
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 