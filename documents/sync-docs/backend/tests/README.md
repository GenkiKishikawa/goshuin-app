# Tests

バックエンドのテストコード。

## テスト構造

- **test_api/** - APIエンドポイントのテスト
- **test_services/** - サービス層のテスト
- **test_models/** - モデルのテスト
- **conftest.py** - Pytestの設定とフィクスチャ

## テストガイドライン

1. Pytestを使用
2. テストデータベースの使用
3. モックとフィクスチャの活用
4. 各機能に対する単体テスト
5. 統合テストの実装

## テスト実行

```bash
# 全テスト実行
pytest

# 特定のテストファイル実行
pytest tests/test_api/test_auth.py

# カバレッジレポート生成
pytest --cov=app tests/
```