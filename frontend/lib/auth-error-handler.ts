import { AuthError } from "@supabase/supabase-js"
import { AuthErrorDetails } from "@/providers/auth-provider"

/**
 * 認証エラーを処理して統一的なエラーメッセージを返す関数
 * 
 * @param authError - Supabaseの認証エラー
 * @returns 統一されたエラー詳細情報
 */
export function createAuthErrorDetails(authError: AuthError): AuthErrorDetails {
  const errorDetails: AuthErrorDetails = {
    message: '不明なエラーが発生しました',
    code: authError.name,
    details: authError.message
  }

  // エラーコードに基づいたメッセージのカスタマイズ
  switch (authError.message) {
    case 'Invalid login credentials':
      errorDetails.message = 'メールアドレスまたはパスワードが正しくありません'
      break
    case 'Email not confirmed':
      errorDetails.message = 'メールアドレスが確認されていません。確認メールをチェックしてください'
      break
    case 'User already registered':
      errorDetails.message = 'このメールアドレスは既に登録されています'
      break
    case 'Password should be at least 6 characters':
      errorDetails.message = 'パスワードは6文字以上で入力してください'
      break
    case 'Signup requires a valid password':
      errorDetails.message = '有効なパスワードを入力してください'
      break
    case 'Invalid email':
      errorDetails.message = '有効なメールアドレスを入力してください'
      break
    case 'Too many requests':
      errorDetails.message = 'リクエストが多すぎます。しばらくしてから再度お試しください'
      break
    default:
      if (authError.message.includes('rate limit')) {
        errorDetails.message = 'リクエストが多すぎます。しばらくしてから再度お試しください'
      } else if (authError.message.includes('network')) {
        errorDetails.message = 'ネットワークエラーが発生しました。接続を確認してください'
      }
      break
  }

  return errorDetails
}

/**
 * 認証エラーメッセージのマッピング定数
 */
export const AUTH_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'メールアドレスまたはパスワードが正しくありません',
  EMAIL_NOT_CONFIRMED: 'メールアドレスが確認されていません。確認メールをチェックしてください',
  USER_ALREADY_REGISTERED: 'このメールアドレスは既に登録されています',
  PASSWORD_TOO_SHORT: 'パスワードは6文字以上で入力してください',
  INVALID_PASSWORD: '有効なパスワードを入力してください',
  INVALID_EMAIL: '有効なメールアドレスを入力してください',
  TOO_MANY_REQUESTS: 'リクエストが多すぎます。しばらくしてから再度お試しください',
  NETWORK_ERROR: 'ネットワークエラーが発生しました。接続を確認してください',
  UNKNOWN_ERROR: '不明なエラーが発生しました'
} as const

/**
 * よく使用される認証関連のバリデーション関数
 */
export class AuthValidator {
  /**
   * メールアドレスの形式をバリデーション
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * パスワードの強度をバリデーション
   */
  static isValidPassword(password: string): boolean {
    return password.length >= 6
  }

  /**
   * 入力値の基本的なバリデーション
   */
  static validateCredentials(email: string, password: string): string | null {
    if (!email || !password) {
      return 'メールアドレスとパスワードを入力してください'
    }
    
    if (!this.isValidEmail(email)) {
      return '有効なメールアドレスを入力してください'
    }
    
    if (!this.isValidPassword(password)) {
      return 'パスワードは6文字以上で入力してください'
    }
    
    return null
  }
}