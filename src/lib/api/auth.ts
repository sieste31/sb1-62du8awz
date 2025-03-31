import { supabase } from '../supabase';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';

// ログイン処理
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    if (error.message === 'Invalid login credentials') {
      throw new Error('メールアドレスまたはパスワードが正しくありません');
    }
    throw error;
  }

  return data;
}

// 新規登録処理
export async function signUpWithEmail(email: string, password: string) {
  if (password.length < 6) {
    throw new Error('パスワードは最低6文字以上必要です');
  }

  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      emailRedirectTo: window.location.origin,
    },
  });

  if (error) {
    if (error.message.includes('Password')) {
      throw new Error('パスワードは最低6文字以上必要です');
    }
    if (error.message.includes('Email')) {
      throw new Error('有効なメールアドレスを入力してください');
    }
    throw error;
  }

  return data;
}

// ログアウト処理
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  return true;
}

// 現在のユーザー情報を取得
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
}

// 現在のセッションを取得
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data;
}

// 認証状態の変更を監視
export function onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
  const { data } = supabase.auth.onAuthStateChange(callback);
  return data;
}
