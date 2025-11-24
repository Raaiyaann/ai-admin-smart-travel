import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleDetectorClick = () => {
    navigate('/food-detector');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">
                Knowledge Management System
              </h1>
              <p className="text-lg text-muted-foreground">
                Manage and organize your team's knowledge base
              </p>
            </div>

            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Welcome</CardTitle>
                <CardDescription>
                  Please login to access the knowledge management system
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="w-full space-y-3">
                  <Button 
                    onClick={handleLoginClick}
                    size="lg"
                    className="w-full"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                  <Button 
                    onClick={handleDetectorClick}
                    variant="outline"
                    className="w-full"
                  >
                    Coba Food Detector
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};