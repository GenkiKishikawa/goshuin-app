import { User, Session } from '@supabase/supabase-js'

/**
 * ユーザーの役割を定義する列挙型
 */
export enum UserRole {
  GUEST = 'guest',
  USER = 'user',
  PREMIUM = 'premium',
  ADMIN = 'admin'
}

/**
 * 認証関連のユーティリティ関数
 */
export class AuthUtils {
  /**
   * ユーザーの役割を取得する
   * 
   * @param user - Supabaseユーザーオブジェクト
   * @returns ユーザーの役割
   */
  static getUserRole(user: User | null): UserRole {
    if (!user) return UserRole.GUEST

    // user_metadataから役割を取得（カスタムクレーム）
    const role = user.user_metadata?.role || user.app_metadata?.role
    
    switch (role) {
      case 'admin':
        return UserRole.ADMIN
      case 'premium':
        return UserRole.PREMIUM
      case 'user':
        return UserRole.USER
      default:
        return UserRole.USER // デフォルトは一般ユーザー
    }
  }

  /**
   * 指定された役割にユーザーがアクセス権限を持っているかチェック
   * 
   * @param user - Supabaseユーザーオブジェクト
   * @param requiredRole - 必要な役割
   * @returns アクセス権限があるかどうか
   */
  static hasRole(user: User | null, requiredRole: UserRole): boolean {
    if (!user) return requiredRole === UserRole.GUEST

    const userRole = this.getUserRole(user)
    
    // 役割の階層：ADMIN > PREMIUM > USER > GUEST
    const roleHierarchy = {
      [UserRole.GUEST]: 0,
      [UserRole.USER]: 1,
      [UserRole.PREMIUM]: 2,
      [UserRole.ADMIN]: 3
    }

    return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
  }

  /**
   * セッションの有効性をチェック
   * 
   * @param session - Supabaseセッション
   * @returns セッションが有効かどうか
   */
  static isSessionValid(session: Session | null): boolean {
    if (!session) return false

    // セッションの有効期限をチェック
    const now = Math.floor(Date.now() / 1000)
    return session.expires_at ? session.expires_at > now : false
  }

  /**
   * セッションの期限切れまでの時間を取得（秒）
   * 
   * @param session - Supabaseセッション
   * @returns 期限切れまでの秒数（負の値は期限切れ）
   */
  static getTimeUntilExpiry(session: Session | null): number {
    if (!session || !session.expires_at) return -1

    const now = Math.floor(Date.now() / 1000)
    return session.expires_at - now
  }

  /**
   * セッションのリフレッシュが必要かチェック
   * 
   * @param session - Supabaseセッション
   * @param thresholdMinutes - リフレッシュのしきい値（分）
   * @returns リフレッシュが必要かどうか
   */
  static shouldRefreshSession(session: Session | null, thresholdMinutes: number = 5): boolean {
    const timeUntilExpiry = this.getTimeUntilExpiry(session)
    return timeUntilExpiry > 0 && timeUntilExpiry < (thresholdMinutes * 60)
  }

  /**
   * ユーザーがメール確認済みかチェック
   * 
   * @param user - Supabaseユーザーオブジェクト
   * @returns メール確認済みかどうか
   */
  static isEmailConfirmed(user: User | null): boolean {
    return !!(user?.email_confirmed_at)
  }

  /**
   * ユーザーのプロフィール画像URLを取得
   * 
   * @param user - Supabaseユーザーオブジェクト
   * @returns プロフィール画像URL
   */
  static getAvatarUrl(user: User | null): string {
    if (!user) return '/default-avatar.png'

    // Google OAuth の場合は picture を使用
    const avatarUrl = user.user_metadata?.avatar_url || 
                     user.user_metadata?.picture ||
                     user.user_metadata?.image_url

    return avatarUrl || '/default-avatar.png'
  }

  /**
   * ユーザーの表示名を取得
   * 
   * @param user - Supabaseユーザーオブジェクト
   * @returns 表示名
   */
  static getDisplayName(user: User | null): string {
    if (!user) return 'ゲスト'

    // Google OAuth の場合は name を使用
    const displayName = user.user_metadata?.full_name ||
                       user.user_metadata?.name ||
                       user.user_metadata?.display_name ||
                       user.email?.split('@')[0]

    return displayName || 'ユーザー'
  }

  /**
   * 認証プロバイダーを取得
   * 
   * @param user - Supabaseユーザーオブジェクト
   * @returns 認証プロバイダー名
   */
  static getAuthProvider(user: User | null): string {
    if (!user) return 'none'

    // app_metadata から最初のプロバイダーを取得
    const providers = user.app_metadata?.providers
    return Array.isArray(providers) && providers.length > 0 ? providers[0] : 'email'
  }

  /**
   * パスワード強度をチェック
   * 
   * @param password - チェックするパスワード
   * @returns 強度スコア（0-4）と評価
   */
  static checkPasswordStrength(password: string): { score: number; feedback: string[] } {
    const feedback: string[] = []
    let score = 0

    // 長さチェック
    if (password.length >= 8) {
      score += 1
    } else {
      feedback.push('8文字以上にしてください')
    }

    // 小文字チェック
    if (/[a-z]/.test(password)) {
      score += 1
    } else {
      feedback.push('小文字を含めてください')
    }

    // 大文字チェック
    if (/[A-Z]/.test(password)) {
      score += 1
    } else {
      feedback.push('大文字を含めてください')
    }

    // 数字チェック
    if (/\d/.test(password)) {
      score += 1
    } else {
      feedback.push('数字を含めてください')
    }

    // 特殊文字チェック
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1
    } else {
      feedback.push('特殊文字を含めてください')
    }

    return { score, feedback }
  }

  /**
   * リダイレクトURLが安全かチェック
   * 
   * @param url - チェックするURL
   * @param allowedDomains - 許可されたドメインのリスト
   * @returns 安全なURLかどうか
   */
  static isSafeRedirectUrl(url: string, allowedDomains: string[] = []): boolean {
    try {
      const redirectUrl = new URL(url, window.location.origin)
      
      // 同一オリジンの場合は安全
      if (redirectUrl.origin === window.location.origin) {
        return true
      }

      // 許可されたドメインのチェック
      return allowedDomains.some(domain => redirectUrl.hostname === domain)
    } catch {
      // 相対URLの場合は安全とみなす
      return !url.includes('://') && url.startsWith('/')
    }
  }
}