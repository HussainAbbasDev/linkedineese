'use client';

import { useState } from 'react';
import { Clipboard, Loader2 } from 'lucide-react';

export default function Home() {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [hasCopied, setHasCopied] = useState<boolean>(false);

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    setOutput('');
    setHasCopied(false);

    try {
      if (!input.trim()) {
        throw new Error('Input cannot be empty.');
      }
      
      const response = await fetch('/api/linkedinify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: input }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'An error occurred from the API.');
      }

      const data = await response.json();
      setOutput(data.result);

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12 lg:p-24 bg-gray-50">
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">
          LinkedInese Generator
        </h1>
        <p className="mt-2 text-lg text-gray-500">
          Convert casual updates into professional LinkedIn posts using AI.
        </p>
      </div>

      <div className="mt-8 w-full max-w-4xl">
        <div className="flex flex-col md:flex-row gap-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your casual or raw text here"
            className="w-full md:w-1/2 p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 min-h-[200px] resize-none text-gray-800"
            disabled={isLoading}
          />
          <div className="relative w-full md:w-1/2">
            <textarea
              value={output}
              placeholder="Your polished LinkedIn-style output will appear here."
              className="w-full h-full p-4 border border-gray-300 rounded-lg shadow-sm bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 min-h-[200px] resize-none text-gray-800"
              readOnly
            />
            {output && (
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-2 text-gray-500 bg-white rounded-full hover:bg-gray-100 active:bg-gray-200 transition-all duration-200"
                aria-label="Copy to clipboard"
              >
                {hasCopied ? (
                  <span className="text-sm text-blue-600">Copied!</span>
                ) : (
                  <Clipboard size={20} />
                )}
              </button>
            )}
          </div>
        </div>
        
        {error && <p className="mt-4 text-center text-red-500">{error}</p>}

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
          >
            {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {isLoading ? 'Transforming...' : 'Transform to LinkedInese'}
          </button>
        </div>
      </div>
    </main>
  );
}

