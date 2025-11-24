import { Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { Toaster } from 'sonner';
import { Home } from '@/pages/Home';
import { Login } from '@/pages/Login';
import { Dashboard } from '@/pages/Dashboard';
import { FoodDetector } from '@/pages/FoodDetector';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Provider store={store}>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/food-detector" element={<FoodDetector />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
          <Toaster position="top-right" />
        </div>
    </Provider>
  );
}

export default App;
