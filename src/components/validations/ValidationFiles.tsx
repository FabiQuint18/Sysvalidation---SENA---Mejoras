
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Upload, Download, Trash2, FileText, Eye, Printer } from 'lucide-react';
import { ValidationFile } from '@/types/validation';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/utils/dateUtils';

interface ValidationFilesProps {
  validationId: string;
  files: ValidationFile[];
  onFileUpload?: (validationId: string, file: File) => void;
  onFileDelete?: (fileId: string) => void;
  readOnly?: boolean;
}

const ValidationFiles = ({ validationId, files, onFileUpload, onFileDelete, readOnly = false }: ValidationFilesProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !onFileUpload) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: "Error",
        description: "Solo se permiten archivos PDF",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "Error",
        description: "El archivo es demasiado grande (máximo 10MB)",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      onFileUpload(validationId, file);
      toast({
        title: "Archivo subido",
        description: `${file.name} se ha subido correctamente`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al subir el archivo",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileDelete = (file: ValidationFile) => {
    if (onFileDelete) {
      onFileDelete(file.id);
      toast({
        title: "Archivo eliminado",
        description: `${file.file_name} ha sido eliminado`,
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Mostrar botones de acción en una sola línea
  return (
    <div className="flex items-center space-x-2">
      {files.length > 0 ? (
        files.map((file) => (
          <div key={file.id} className="flex space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(file.file_url, '_blank')}
              title="Visualizar"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              title="Imprimir"
            >
              <Printer className="h-4 w-4" />
            </Button>
            {!readOnly && onFileDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" title="Eliminar">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar archivo?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. El archivo "{file.file_name}" será eliminado permanentemente.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => handleFileDelete(file)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Eliminar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        ))
      ) : (
        <span className="text-sm text-muted-foreground">Sin archivos</span>
      )}
      
      {!readOnly && onFileUpload && (
        <>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
            id={`file-upload-${validationId}`}
            disabled={uploading}
          />
          <label
            htmlFor={`file-upload-${validationId}`}
            className="cursor-pointer"
          >
            <Button
              variant="outline"
              size="sm"
              disabled={uploading}
              title="Adjuntar archivo"
              asChild
            >
              <span>
                <Upload className="h-4 w-4" />
              </span>
            </Button>
          </label>
        </>
      )}
    </div>
  );
};

export default ValidationFiles;
