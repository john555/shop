'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Upload, Eye, Check, X } from 'lucide-react';
import { createStoreFrontUrl } from '@/lib/common/url';
import { useStore } from '@/admin/hooks/store';

export default function StoreConfigPage() {
  const { store } = useStore();
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const colorImageRef = useRef<HTMLImageElement>(null);
  const grayscaleImageRef = useRef<HTMLImageElement>(null);
  const [primaryColor, setPrimaryColor] = useState('#22c55e');
  const [secondaryColor, setSecondaryColor] = useState('#3b82f6');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');

  useEffect(() => {
    if (logo) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(logo);
      simulateUpload();
    }
  }, [logo]);

  useEffect(() => {
    if (logoPreview) {
      updateProgress();
    }
  }, [logoPreview, uploadProgress]);

  const updateProgress = () => {
    const colorImage = colorImageRef.current;
    const grayscaleImage = grayscaleImageRef.current;
    if (colorImage && grayscaleImage) {
      colorImage.style.clipPath = `inset(0 ${100 - uploadProgress}% 0 0)`;
    }
  };

  const simulateUpload = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 1;
      });
    }, 30);
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setLogo(event.target.files[0]);
    }
  };

  const handleRemoveLogo = () => {
    setLogo(null);
    setLogoPreview(null);
    setUploadProgress(0);
  };

  const handleSave = () => {
    toast({
      title: 'Settings saved',
      description: 'Your store configuration has been updated.',
      duration: 3000,
    });
  };

  const handlePreview = () => {
    const url = createStoreFrontUrl(store.slug);
    window.open(url, '_blank');
  };

  return (
    <div className="container mx-auto px-4 pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0">
        <h1 className="text-3xl font-bold">Store Configuration</h1>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <Button
            onClick={handlePreview}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Eye className="mr-2 h-4 w-4" /> Preview Store
          </Button>
          <Button onClick={handleSave}>
            <Check className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Logo and Color Scheme</CardTitle>
            <CardDescription>
              Upload your logo and set your store&apos;s colors
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="logo">Store Logo</Label>
              {!logo && (
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="logo"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>{' '}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                      </p>
                    </div>
                    <input
                      id="logo"
                      type="file"
                      className="hidden"
                      onChange={handleLogoChange}
                      accept="image/*"
                    />
                  </label>
                </div>
              )}
              {logo && logoPreview && (
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative w-full h-64 rounded-lg overflow-hidden">
                    <img
                      ref={grayscaleImageRef}
                      src={logoPreview}
                      alt="Logo preview (grayscale)"
                      className="absolute inset-0 w-full h-full object-contain filter grayscale blur-sm transition-all duration-300"
                    />
                    <img
                      ref={colorImageRef}
                      src={logoPreview}
                      alt="Logo preview (color)"
                      className="absolute inset-0 w-full h-full object-contain transition-all duration-300"
                    />
                  </div>
                  <Button variant="destructive" onClick={handleRemoveLogo}>
                    <X className="mr-2 h-4 w-4" /> Remove Logo
                  </Button>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="primaryColor">Primary Color</Label>
              <Input
                id="primaryColor"
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-16 h-10"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="secondaryColor">Secondary Color</Label>
              <Input
                id="secondaryColor"
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-16 h-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SEO Settings</CardTitle>
            <CardDescription>
              Optimize your store for search engines
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="seoTitle">SEO Title</Label>
              <Input
                id="seoTitle"
                placeholder="Enter your store's SEO title"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seoDescription">SEO Description</Label>
              <Textarea
                id="seoDescription"
                placeholder="Enter your store's SEO description"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seoKeywords">SEO Keywords</Label>
              <Input
                id="seoKeywords"
                placeholder="Enter comma-separated keywords"
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
