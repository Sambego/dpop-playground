'use client';

import CopyButton from '@/components/ui/CopyButton';
import JwtIoButton from '@/components/ui/JwtIoButton';
import JsonWithTooltips from '@/components/ui/JsonWithTooltips';

interface SplitCodeEditorProps {
  title: string;
  requestTitle: string;
  responseTitle: string;
  requestContent: string;
  responseContent: string;
  rotation?: 'rotate-1' | '-rotate-1' | 'rotate-2' | '-rotate-2';
  borderColor?: string;
  headerBgColor?: string;
  requestType?: 'http' | 'json';
  responseType?: 'http' | 'json';
  tokens?: {
    accessToken?: string;
    dpopProof?: string;
  };
}

export default function SplitCodeEditor({
  title,
  requestTitle,
  responseTitle,
  requestContent,
  responseContent,
  rotation = 'rotate-1',
  borderColor = 'border-red-500/30',
  headerBgColor = 'bg-red-900/50 border-red-700',
  requestType = 'http',
  responseType = 'json',
  tokens,
}: SplitCodeEditorProps) {
  
  const renderHttpRequest = (content: string) => {
    const lines = content.split('\n');
    return (
      <pre className="whitespace-pre-wrap">
        {lines.map((line, index) => {
          if (index === 0) {
            // Method line
            const parts = line.split(' ');
            return (
              <div key={index} className="flex">
                <div className="text-red-400">{parts[0]}</div>
                <div className="text-gray-300 ml-1">{parts.slice(1).join(' ')}</div>
              </div>
            );
          } else if (line.includes(': ')) {
            // Header line
            const [key, ...valueParts] = line.split(': ');
            const value = valueParts.join(': ');
            
            // Check if this line contains tokens that need interactive buttons
            if (key === 'Authorization' && tokens?.accessToken) {
              return (
                <div key={index} className="relative group">
                  <div className="flex flex-wrap items-center">
                    <div className="text-red-400">{key}: </div>
                    {value.includes('Bearer') && (
                      <div className="text-red-200">Bearer </div>
                    )}
                    {value.includes('DPoP') && (
                      <div className="text-red-200">DPoP </div>
                    )}
                    <div className="text-gray-300 break-all">
                      {tokens.accessToken}
                    </div>
                  </div>
                  <div className="absolute -top-2 right-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-900 px-2 py-1 rounded-md border border-gray-700 z-10">
                    <JwtIoButton jwt={tokens.accessToken} />
                    <CopyButton content={tokens.accessToken} />
                  </div>
                </div>
              );
            } else if (key === 'DPoP' && tokens?.dpopProof) {
              return (
                <div key={index} className="relative group">
                  <div className="flex flex-wrap">
                    <div className="text-red-400">{key}: </div>
                    <div className="text-gray-300 break-all">
                      {tokens.dpopProof}
                    </div>
                  </div>
                  <div className="absolute -top-2 right-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-900 px-2 py-1 rounded-md border border-gray-700 z-10">
                    <JwtIoButton jwt={tokens.dpopProof} />
                    <CopyButton content={tokens.dpopProof} />
                  </div>
                </div>
              );
            } else {
              return (
                <div key={index} className="flex">
                  <div className="text-red-400">{key}: </div>
                  <div className="text-gray-300">{value}</div>
                </div>
              );
            }
          } else {
            // Regular line
            return (
              <div key={index} className="text-gray-300">
                {line}
              </div>
            );
          }
        })}
      </pre>
    );
  };

  return (
    <div className={`glass-card rounded-lg overflow-hidden hover-glow transform ${rotation} transition-transform duration-200 group ${borderColor}`}>
      <div className={`${headerBgColor} px-4 py-3 border-b flex justify-between items-center`}>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
        </div>
        <div className="flex gap-2">
          <CopyButton content={requestContent} />
          <CopyButton content={responseContent} />
        </div>
      </div>
      
      <div className="divide-y divide-red-700/30">
        {/* Request Side */}
        <div className="p-4">
          <div className="mb-2">
            <h4 className="text-xs font-semibold text-red-300 uppercase tracking-wider">
              {requestTitle}
            </h4>
          </div>
          <div className="bg-code-editor rounded-lg p-4 font-mono text-sm overflow-x-auto">
            {requestType === 'http' ? renderHttpRequest(requestContent) : (
              <JsonWithTooltips jsonString={requestContent} />
            )}
          </div>
        </div>

        {/* Response Side */}
        <div className="p-4">
          <div className="mb-2">
            <h4 className="text-xs font-semibold text-red-300 uppercase tracking-wider">
              {responseTitle}
            </h4>
          </div>
          <div className="bg-code-editor rounded-lg p-4 font-mono text-sm overflow-x-auto">
            {responseType === 'http' ? renderHttpRequest(responseContent) : (
              <JsonWithTooltips jsonString={responseContent} />
            )}
          </div>
          <p className="text-xs text-red-400 mt-2">
            ❌ Request rejected - Security violation detected
          </p>
        </div>
      </div>
    </div>
  );
}