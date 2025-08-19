'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getCompanyLogo } from '@/lib/utils/companyLogos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function LogoTesterComponent() {
  const [companyName, setCompanyName] = useState('Meta');
  const [logoPath, setLogoPath] = useState(getCompanyLogo('Meta'));
  const [logoError, setLogoError] = useState(false);

  const handleTest = () => {
    setLogoError(false);
    setLogoPath(getCompanyLogo(companyName));
  };

  const handleImageError = () => {
    setLogoError(true);
    console.error(`Logo image failed to load: ${logoPath}`);
  };

  return (
    <Card className="p-6 max-w-md mx-auto my-4 bg-gray-900 text-white">
      <h2 className="text-xl font-bold mb-4">Company Logo Tester</h2>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Company Name</label>
          <div className="flex gap-2">
            <Input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter company name"
              className="bg-gray-800 text-white"
            />
            <Button onClick={handleTest}>Test Logo</Button>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-400 mb-2">
            Logo Path: <span className="text-blue-400">{logoPath}</span>
          </p>
          <div className="bg-gray-800 p-4 rounded-lg flex items-center justify-center">
            {logoError ? (
              <div className="text-red-500 text-center">
                ❌ Logo image failed to load
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Image
                  src={logoPath}
                  alt={`${companyName} logo`}
                  width={100}
                  height={100}
                  className="rounded-full"
                  onError={handleImageError}
                />
                <p className="mt-2 text-center">{companyName}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-md font-semibold mb-2">Debug Information:</h3>
          <pre className="text-xs text-gray-400 overflow-auto max-h-32">
            {JSON.stringify(
              {
                inputCompany: companyName,
                normalizedCompany: companyName?.trim().toLowerCase(),
                logoPath,
                logoError
              },
              null,
              2
            )}
          </pre>
        </div>
      </div>
    </Card>
  );
}
