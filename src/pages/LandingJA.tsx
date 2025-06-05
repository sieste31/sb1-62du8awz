import React from 'react';
import { useNavigate } from 'react-router-dom';
import LandingPage from '@/components/LandingPage';
import { useAuth } from '@/lib/auth-provider';
import { DEMO_USER_ID } from '@/lib/demo';
import { supabase } from '@/lib/supabase';

export function LandingJA() {
    const navigate = useNavigate();
    const { signInWithGoogle } = useAuth();

    const handleDemoLogin = async () => {
        try {
            // デモユーザーでログイン
            const { data, error } = await supabase.auth.signInWithPassword({
                email: 'demo@example.com', // デモユーザーのメールアドレス
                password: 'DemoUserPassword123!' // 安全なデモユーザーパスワード
            });

            if (error) throw error;
            if (data.user?.id !== DEMO_USER_ID) {
                throw new Error('Invalid demo user');
            }

            // デモページへリダイレクト
            navigate('/demo');
        } catch (err) {
            console.error('デモログインエラー:', err);
            alert('デモモードへのログインに失敗しました。');
        }
    };

    return (
        <LandingPage
            onGoogleSignIn={signInWithGoogle}
            onDemoLogin={handleDemoLogin}
            language="ja"
        />
    );
}

export default LandingJA;