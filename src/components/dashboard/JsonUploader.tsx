
import React, { useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useReviewData } from '@/contexts/ReviewDataContext';
import { parseJsonFile, validateReviewJson } from '@/utils/fileUtils';
import { toast } from '@/components/ui/use-toast';
import { Upload } from 'lucide-react';

export const JsonUploader = () => {
  const { setReviews } = useReviewData();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    try {
      const jsonData = await parseJsonFile(file);
      
      if (validateReviewJson(jsonData)) {
        setReviews(jsonData);
        toast({
          title: "Upload successful",
          description: `${jsonData.length} reviews loaded from ${file.name}`,
        });
      } else {
        toast({
          title: "Invalid JSON format",
          description: "The file doesn't contain valid review data. Please check the format.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Could not process the JSON file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload size={18} /> Upload Review Data
        </CardTitle>
        <CardDescription>
          Upload a JSON file containing review data to analyze
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <Input 
            ref={fileInputRef}
            type="file" 
            accept=".json"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="cursor-pointer"
          />
          <div className="text-xs text-muted-foreground">
            <p>File must be a valid JSON array with objects containing:</p>
            <p>Author, Body, Date, Heading, Location, and Rating fields</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
