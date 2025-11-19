

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { MapPin, UtensilsCrossed, Clock, DollarSign, Users, ArrowLeft, Star } from 'lucide-react';

interface FoodPreferences {
  location: string;
  foodType: string;
  mealTime: string;
  budget: number;
  numberOfPeople: number;
}

interface MenuItem {
  name: string;
  price: number;
  quantity: number;
  total: number;
}

interface Restaurant {
  name: string;
  rating: number;
  openHours: string;
  address: string;
  description?: string;
}

interface FoodRecommendation {
  restaurant: Restaurant;
  menu: MenuItem[];
  subtotal: number;
  savings: number;
  totalBudget: number;
}

export const FoodRecommendations = () => {
  const [step, setStep] = useState<'form' | 'result'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState<FoodPreferences>({
    location: 'Surabaya Barat',
    foodType: 'Asin',
    mealTime: 'Makan Siang',
    budget: 75000,
    numberOfPeople: 2,
  });
  const [recommendation, setRecommendation] = useState<FoodRecommendation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const locations = [
    'Surabaya Barat',
    'Surabaya Timur',
    'Surabaya Pusat',
    'Surabaya Utara',
    'Surabaya Selatan',
  ];

  const foodTypes = [
    'Manis',
    'Asam',
    'Pedas',
    'Asin',
    'Gurih',
  ];

  const mealTimes = [
    'Sarapan',
    'Makan Siang',
    'Makan Malam',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/food-recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRecommendation(data);
      setStep('result');
    } catch (err) {
      console.error('Error getting recommendations:', err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat mengambil rekomendasi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep('form');
    setRecommendation(null);
    setError(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (step === 'result' && recommendation) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Rekomendasi Restoran</h1>
        </div>

        {/* Restaurant Card */}
        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Restaurant Image Placeholder */}
            <div className="md:col-span-1 bg-muted h-64 md:h-auto flex items-center justify-center">
              <UtensilsCrossed className="w-16 h-16 text-muted-foreground" />
            </div>

            {/* Restaurant Details */}
            <div className="md:col-span-2 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {recommendation.restaurant.name}
                  </h2>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1 bg-accent text-accent-foreground px-2 py-1 rounded">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-medium">{recommendation.restaurant.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                    <Clock className="w-4 h-4" />
                    <span>{recommendation.restaurant.openHours}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">{recommendation.restaurant.address}</p>
                </div>
                {recommendation.restaurant.description && (
                  <p className="text-sm text-muted-foreground mt-4">
                    {recommendation.restaurant.description}
                  </p>
                )}
                <Button variant="outline" size="sm" className="mt-4">
                  See Profile
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Menu Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Rekomendasi Menu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendation.menu.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-4">
                  {/* Menu Image Placeholder */}
                  <div className="w-16 h-16 bg-background rounded-lg flex items-center justify-center">
                    <UtensilsCrossed className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{item.name}</h3>
                    <p className="text-sm text-accent font-medium">
                      {formatCurrency(item.price)} <span className="text-muted-foreground">x{item.quantity}</span>
                    </p>
                  </div>
                </div>
                <div className="text-lg font-bold text-accent">
                  {formatCurrency(item.total)}
                </div>
              </div>
            ))}

            {/* Subtotal and Budget Info */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between items-center text-lg">
                <span className="font-semibold text-foreground">Subtotal</span>
                <span className="font-bold text-accent text-xl">{formatCurrency(recommendation.subtotal)}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Kamu berhasil hemat{' '}
                <span className="font-semibold text-primary">
                  {formatCurrency(recommendation.savings)}
                </span>{' '}
                dari total budget {formatCurrency(recommendation.totalBudget)}!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary mb-2">Mealplan</CardTitle>
          <CardDescription className="text-base">
            Lagi bingung mau makan apa? Tenang aja, biarin AI yang cariin makanan paling cocok buat selera dan kantong kamu!"
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Location Selection */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-foreground font-medium">
                <MapPin className="w-5 h-5 text-accent" />
                <label>Pilih Lokasi yang diinginkan</label>
              </div>
              <div className="flex flex-wrap gap-2">
                {locations.map((location) => (
                  <button
                    key={location}
                    type="button"
                    onClick={() => setPreferences({ ...preferences, location })}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      preferences.location === location
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>

            {/* Food Type Selection */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-foreground font-medium">
                <UtensilsCrossed className="w-5 h-5 text-accent" />
                <label>Preferensi Makanan</label>
              </div>
              <div className="flex flex-wrap gap-2">
                {foodTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setPreferences({ ...preferences, foodType: type })}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      preferences.foodType === type
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Meal Time Selection */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-foreground font-medium">
                <Clock className="w-5 h-5 text-accent" />
                <label>Waktu Makan</label>
              </div>
              <div className="flex flex-wrap gap-2">
                {mealTimes.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setPreferences({ ...preferences, mealTime: time })}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      preferences.mealTime === time
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget and Number of People */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Budget Input */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <DollarSign className="w-5 h-5 text-accent" />
                  <label>Budget Makanan</label>
                </div>
                <Input
                  type="number"
                  value={preferences.budget}
                  onChange={(e) => setPreferences({ ...preferences, budget: Number(e.target.value) })}
                  placeholder="Rp.75,000"
                  min="0"
                  step="1000"
                  required
                />
              </div>

              {/* Number of People Input */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <Users className="w-5 h-5 text-accent" />
                  <label>Jumlah Orang</label>
                </div>
                <Input
                  type="number"
                  value={preferences.numberOfPeople}
                  onChange={(e) => setPreferences({ ...preferences, numberOfPeople: Number(e.target.value) })}
                  placeholder="2"
                  min="1"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? 'Mencari rekomendasi...' : 'Temukan Makanan'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
