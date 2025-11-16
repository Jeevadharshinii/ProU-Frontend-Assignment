
import React from 'react';
import { SignIn, SignUp, useAuth } from '@clerk/clerk-react';
import { Navigate, useLocation } from 'react-router-dom';
import Hyperspeed from '../components/Hyperspeed';
import Logo from '../components/Logo';

const Auth: React.FC = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const location = useLocation();
  const isSignUp = location.pathname === '/sign-up';
  
  // If the user is already signed in, redirect to home
  if (isLoaded && isSignedIn) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Hyperspeed background */}
      <Hyperspeed />
      
      {/* Auth container */}
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Logo variant="default" className="w-20 h-20" />
        </div>
        
        {/* Clerk auth component with proper styling */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
          {isSignUp ? (
            <SignUp 
              routing="path"
              path="/sign-up"
              signInUrl="/sign-in"
              afterSignUpUrl="/"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "w-full shadow-none bg-white",
                  headerTitle: "text-gray-900 font-bold text-2xl",
                  headerSubtitle: "text-gray-600",
                  socialButtonsBlockButton: "bg-white border-gray-300 hover:bg-gray-50 text-gray-700 font-medium",
                  socialButtonsBlockButtonText: "text-gray-700 font-medium",
                  formButtonPrimary: "bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-semibold shadow-md hover:shadow-lg transition-all",
                  formFieldInput: "bg-white border-gray-300 text-gray-900 focus:border-amber-500 focus:ring-amber-500",
                  formFieldLabel: "text-gray-700 font-medium",
                  dividerText: "text-gray-500",
                  dividerLine: "bg-gray-300",
                  footerActionLink: "text-amber-600 hover:text-amber-700 font-medium",
                  identityPreviewText: "text-gray-700",
                  identityPreviewEditButton: "text-amber-600 hover:text-amber-700",
                  formHeaderTitle: "text-amber-600 font-bold",
                  formHeaderSubtitle: "text-gray-600",
                  otpCodeFieldInput: "border-gray-300 text-gray-900",
                  formResendCodeLink: "text-amber-600 hover:text-amber-700"
                },
                layout: {
                  socialButtonsPlacement: "top",
                  socialButtonsVariant: "blockButton"
                }
              }}
            />
          ) : (
            <SignIn 
              routing="path"
              path="/sign-in"
              signUpUrl="/sign-up"
              afterSignInUrl="/"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "w-full shadow-none bg-white",
                  headerTitle: "text-gray-900 font-bold text-2xl",
                  headerSubtitle: "text-gray-600",
                  socialButtonsBlockButton: "bg-white border-gray-300 hover:bg-gray-50 text-gray-700 font-medium",
                  socialButtonsBlockButtonText: "text-gray-700 font-medium",
                  formButtonPrimary: "bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-semibold shadow-md hover:shadow-lg transition-all",
                  formFieldInput: "bg-white border-gray-300 text-gray-900 focus:border-amber-500 focus:ring-amber-500",
                  formFieldLabel: "text-gray-700 font-medium",
                  dividerText: "text-gray-500",
                  dividerLine: "bg-gray-300",
                  footerActionLink: "text-amber-600 hover:text-amber-700 font-medium",
                  identityPreviewText: "text-gray-700",
                  identityPreviewEditButton: "text-amber-600 hover:text-amber-700",
                  formHeaderTitle: "text-amber-600 font-bold",
                  formHeaderSubtitle: "text-gray-600",
                  otpCodeFieldInput: "border-gray-300 text-gray-900",
                  formResendCodeLink: "text-amber-600 hover:text-amber-700"
                },
                layout: {
                  socialButtonsPlacement: "top",
                  socialButtonsVariant: "blockButton"
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
