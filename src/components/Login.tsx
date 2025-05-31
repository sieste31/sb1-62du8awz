import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth-provider';
import { signInWithGoogle, signInWithApple } from '../lib/api';

interface LoginProps {
  isSignUp?: boolean;
}

export function Login({ isSignUp }: LoginProps = {}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ユーザーが既にログインしている場合はリダイレクト
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      await signInWithGoogle(
      );
      // リダイレクトされるため、ここでは何もしない
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ログインに失敗しました');
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      await signInWithApple();
      // リダイレクトされるため、ここでは何もしない
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ログインに失敗しました');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            BattDevy
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isSignUp ? 'アカウントを作成' : 'Googleアカウントでログインしてください'}
          </p>
        </div>

        {error && (
          <div className="text-sm text-center text-red-600">
            {error}
          </div>
        )}

        <div className="flex flex-col space-y-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                />
              </svg>
              {loading ? 'ログイン中...' : (isSignUp ? 'Googleでサインアップ' : 'Googleでログイン')}
            </span>
          </button>

          {/* appleログインは中止
           <button
            type="button"
            onClick={handleAppleLogin}
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M17.05,20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24,0-1.44.62-2.2.44-3.06-.35C2.79,15.25,3.51,7.59,9.05,7.31c1.35.07,2.29.74,3.08.8,1.17-.24,2.27-.93,3.45-.84,1.46.12,2.55.63,3.25,1.61-2.86,1.63-2.36,5.57.22,6.75C18.45,17.59,17.81,19.3,17.05,20.28ZM12.03,7.25c-.15-2.23,1.66-4.07,3.74-4.25C16.03,5.46,13.91,7.23,12.03,7.25Z"
                />
              </svg>
              {loading ? 'ログイン中...' : 'Appleでログイン'}
            </span>
          </button> 
          */}
        </div>
      </div>
    </div>
  );
}
