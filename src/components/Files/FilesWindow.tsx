import { useState, useEffect, useRef } from 'react';
import { Upload, Trash2, Search, FileText, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UploadedFile } from '@/types';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export function FilesWindow() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // API CALL: Fetch the list of uploaded files from /api/files on page load
    const fetchFiles = async () => {
      try {
        // Mock data for now
        const mockFiles: UploadedFile[] = [
          {
            id: '1',
            name: 'document.pdf',
            type: 'application/pdf',
            size: 1024000,
            uploadedAt: new Date(),
            url: '/mock/document.pdf'
          },
          {
            id: '2',
            name: 'image.jpg',
            type: 'image/jpeg',
            size: 512000,
            uploadedAt: new Date(),
            url: '/mock/image.jpg',
            thumbnailUrl: '/mock/image-thumb.jpg'
          }
        ];
        
        // In real implementation:
        // const response = await fetch('/api/files');
        // const data = await response.json();
        // setFiles(data);
        
        setFiles(mockFiles);
      } catch (error) {
        console.error('Failed to fetch files:', error);
        toast({
          title: "Error",
          description: "Failed to load files",
          variant: "destructive"
        });
      }
    };

    fetchFiles();
  }, [toast]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setIsUploading(true);

    try {
      for (const file of Array.from(selectedFiles)) {
        // API CALL: Send file upload requests to /api/upload with form data
        const formData = new FormData();
        formData.append('file', file);

        // Mock upload - in real implementation:
        // const response = await fetch('/api/upload', {
        //   method: 'POST',
        //   body: formData
        // });
        // const uploadedFile = await response.json();

        // Mock uploaded file
        const uploadedFile: UploadedFile = {
          id: Date.now().toString(),
          name: file.name,
          type: file.type,
          size: file.size,
          uploadedAt: new Date(),
          url: URL.createObjectURL(file),
          thumbnailUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
        };

        setFiles(prev => [...prev, uploadedFile]);

        toast({
          title: "Success",
          description: `${file.name} uploaded successfully`,
        });
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Error",
        description: "Upload failed. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      // API CALL: Send delete requests to /api/files/{fileId}
      // await fetch(`/api/files/${fileId}`, { method: 'DELETE' });
      
      setFiles(prev => prev.filter(file => file.id !== fileId));
      
      toast({
        title: "Success",
        description: "File deleted successfully",
      });
    } catch (error) {
      console.error('Delete failed:', error);
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive"
      });
    }
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <ImageIcon className="h-5 w-5" />;
    }
    return <FileText className="h-5 w-5" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Files</h2>
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          size="sm"
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Upload className="h-4 w-4 mr-2" />
          )}
          Upload
        </Button>
      </div>

      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-2">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
            >
              <div className="flex-shrink-0">
                {file.thumbnailUrl ? (
                  <img
                    src={file.thumbnailUrl}
                    alt={file.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                ) : (
                  <div className="w-10 h-10 bg-muted rounded flex items-center justify-center text-muted-foreground">
                    {getFileIcon(file.type)}
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(file.size)} • {file.uploadedAt.toLocaleDateString()}
                </p>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete File</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{file.name}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteFile(file.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
          
          {filteredFiles.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? 'No files match your search' : 'No files uploaded yet'}
            </div>
          )}
        </div>
      </ScrollArea>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileUpload}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx,.txt"
      />
    </div>
  );
}