import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Loader2, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface PredictionResponse {
  food_name?: string;
  prediction?: string;
  label?: string;
  predicted_class?: string;
  confidence?: number;
  error?: string;
  [key: string]: unknown;
}

const normalizeUrl = (url?: string) => {
  if (!url) return '';
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

export const FoodDetector = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const basePredictUrl =
    normalizeUrl(import.meta.env.VITE_FOOD_PREDICTOR_URL) ||
    normalizeUrl(import.meta.env.VITE_BACKEND_BASE_URL);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPrediction(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Pilih gambar makanan terlebih dahulu.');
      return;
    }

    if (!basePredictUrl) {
      setError('Endpoint prediksi belum dikonfigurasi. Tambahkan VITE_FOOD_PREDICTOR_URL.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${basePredictUrl}/predict`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null);
        throw new Error(errorPayload?.detail || 'Gagal mendeteksi makanan');
      }

      const data: PredictionResponse = await response.json();

      if (data.error && typeof data.error === 'string') {
        throw new Error(data.error);
      }

      const detectedLabel =
        data.food_name || data.prediction || data.label || data.predicted_class;

      setPrediction(detectedLabel || 'Makanan tidak dikenali');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan saat menghubungi server';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleFoods = [
    {
      name: 'Rawon',
      image:
        'https://images.unsplash.com/photo-1608039829574-6cffc0c786fe?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Tahu Tek',
      image:
        'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Soto Ayam',
      image:
        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Lontong Balap',
      image:
        'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=400&q=80',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFF9F2]">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>

        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-semibold text-[#0F6D3B] mb-4">
            Kenali Rasa Suroboyo
          </h1>
          <p className="text-lg text-[#646464] max-w-3xl mx-auto">
            Unggah foto makananmu dan temukan apakah itu termasuk kuliner legendaris Surabaya.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {sampleFoods.map((food) => (
            <div key={food.name} className="flex flex-col items-center space-y-3">
              <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg bg-white">
                <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
              </div>
              <p className="font-medium text-[#0F6D3B]">{food.name}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <Button
            size="lg"
            className="bg-[#FF6200] hover:bg-[#e15800] text-white px-10 py-6 rounded-full text-lg"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <UploadCloud className="mr-2 h-5 w-5" />
            {selectedFile ? 'Pilih Gambar Lain' : 'Unggah Gambar'}
          </Button>

          {selectedFile && (
            <Button
              onClick={handleUpload}
              className="bg-[#0F6D3B] hover:bg-[#0c542e] text-white"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
              <span className="ml-2">{isLoading ? 'Menganalisis...' : 'Deteksi Makanan'}</span>
            </Button>
          )}
        </div>

        {selectedFile && previewUrl && (
          <div className="mt-10 flex flex-col items-center">
            <p className="text-sm text-[#646464] mb-2">Pratinjau Foto</p>
            <div className="w-64 h-64 rounded-3xl overflow-hidden shadow-2xl bg-white">
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
            <p className="mt-3 text-sm text-[#0F6D3B]">{selectedFile.name}</p>
          </div>
        )}

        {error && (
          <div className="mt-8 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {prediction && (
          <div className="mt-12 flex justify-center">
            <Card className="max-w-md w-full bg-white border-none shadow-lg">
              <CardContent className="p-6 flex flex-col items-center space-y-4">
                {previewUrl && (
                  <div className="w-60 h-60 rounded-3xl overflow-hidden bg-[#FFF4E9] shadow-inner">
                    <img src={previewUrl} alt="Detected food" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="text-center">
                  <p className="text-2xl font-semibold text-[#0F6D3B]">{prediction}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodDetector;
