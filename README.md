# Mythos Interface

Mythos Interface は、日常に神話的なインターフェースをつくる小さなデジタル工房です。

このリポジトリは GitHub Pages でそのまま公開できる、ビルド不要の静的サイトです。HTML / CSS / JavaScript と JSON だけで動きます。

## ファイル構成

- `index.html` - Home
- `apps.html` - 公開用 Apps / Instrumente 一覧
- `books.html` - Books / Kindle / Notes
- `about.html` - Mythos Interface の説明
- `updates.html` - 更新履歴
- `dashboard.html` - 自分用 Dashboard。非公開にしたい場合はGitHub Pagesへアップロードしないでください。
- `styles.css` - サイト全体の見た目
- `data/public-items.json` - 公開用アイテムデータ
- `data/updates.json` - 更新履歴データ
- `js/` - 表示、翻訳、検索、Dashboard、インポート / エクスポート処理

## GitHub Pages で公開する手順

1. GitHub で新しいリポジトリを作ります。
2. このフォルダのファイルをリポジトリにアップロードします。
3. GitHub の `Settings` → `Pages` を開きます。
4. `Build and deployment` の `Source` を `Deploy from a branch` にします。
5. `Branch` を `main`、フォルダを `/root` にします。
6. 保存すると、しばらくして `https://ユーザー名.github.io/リポジトリ名/` で公開されます。

## ファイルをアップロードする手順

GitHub の画面で作業する場合は、リポジトリ画面の `Add file` → `Upload files` から、このフォルダ内のファイルとフォルダをアップロードしてください。

更新するときは、変更したファイルだけを再アップロードしても大丈夫です。

## public-items.json の編集方法

公開用データは `data/public-items.json` にあります。

初心者向けの詳しい更新手順、項目の意味、コピペ用テンプレートは `JSON更新ガイド.md` にまとめています。

公開ページに出したい項目は、次の条件にしてください。

- `showInPortfolio`: `true`
- `status`: `draft` 以外
- Apps に出す場合は `type`: `app`
- Books に出す場合は `type`: `book` または `note`

公開ページに表示してよい情報だけを入れてください。

- `title`
- `publicUrl`
- `description`
- `category`
- `status`
- `tags`
- `technologies`
- `screenshot`
- `showInPortfolio`

`privateNote` や個人的な作業メモは `public-items.json` に入れないでください。

## 新しいアプリを追加する方法

`data/public-items.json` の `items` 配列に、次のような項目を追加します。

```json
{
  "id": "new-instrument",
  "type": "app",
  "title": "New Instrument",
  "publicUrl": "https://username.github.io/new-instrument/",
  "category": "time",
  "status": "prototype",
  "showInPortfolio": true,
  "subtitle": {
    "ja": "新しい器具",
    "de": "Neues Instrument"
  },
  "description": {
    "ja": "日本語の説明。",
    "de": "Deutsche Beschreibung."
  },
  "tags": ["Zeit", "Werkstatt"],
  "technologies": ["HTML", "CSS", "JavaScript"],
  "icon": "✧",
  "screenshot": ""
}
```

`id` は重複しない英数字の名前にしてください。

## Kindle リンクを追加する方法

Kindle本や覚え書きは `type` を `book` または `note` にします。

まだ公開していないものは、次のようにしておくと公開ページに出ません。

- `status`: `draft`
- `showInPortfolio`: `false`

公開後は `publicUrl` に Kindle ページや紹介ページの URL を入れ、`showInPortfolio` を `true` にしてください。

## Dashboard の扱い

`dashboard.html` は自分用の目録台帳です。

重要: GitHub Pagesは静的サイト公開サービスです。GitHubの公式ドキュメントでも、GitHub PagesはHTML、CSS、JavaScriptをリポジトリから公開する仕組みとして説明されています。秘密の管理画面としては使わないでください。

Dashboardを非公開にしたい場合は、`dashboard.html` とDashboard用の `js/dashboard.js`、`js/storage.js`、`js/import-export.js`、`js/validation.js` をGitHub Pagesへアップロードしないでください。

公開ページからDashboardへのリンクは外してあります。つまり、普通にサイトを見る人にはDashboard入口は表示されません。ただし、`dashboard.html` をアップロードした場合、URLを知っている人はアクセスできる可能性があります。

できること:

- 全項目の確認
- GitHub Pages リンクとリポジトリURLの確認
- お気に入り切り替え
- 表示順の変更
- 自分用メモの編集
- 次に直したいことの編集
- 保守メモの編集
- 手元の状態の変更
- JSONのインポート / エクスポート
- 初期データへ戻す
- 直前の状態へ復元

Dashboard の編集内容はブラウザの `localStorage` に保存されます。別の端末や別のブラウザには自動では同期されません。

## インポート / エクスポート

Dashboard の `JSONを書き出す` ボタンで、現在の自分用データを保存できます。

ファイル名は次の形式です。

`mythos-interface-dashboard-YYYY-MM-DD.json`

インポート方法は3つあります。

- `統合` - 同じ `id` の項目を更新し、新しい項目を追加します。
- `置き換え` - 現在のDashboardデータを読み込んだJSONで置き換えます。
- `追加のみ` - 既存の項目はそのまま、新しい `id` の項目だけ追加します。

インポート前には自動バックアップを作ります。失敗した場合、既存データは壊さない設計です。

## スマホとPCでJSONを移動する方法

Dashboard のエクスポートでJSONファイルを書き出し、次のような方法で別端末へ移動できます。

- iCloud Drive
- Google Drive
- AirDrop
- メール添付
- USB接続

移動先のブラウザでローカルの `dashboard.html` を開き、インポートしてください。非公開にしたい場合、GitHub Pages上のURLではなく、自分のPCやスマホ内のファイルとして扱ってください。

## 日本語 / Deutsch

言語切り替えは各ページ上部の `[ 日本語 ] [ Deutsch ]` ボタンで行います。

選択した言語は `localStorage` に保存され、次回表示時にも使われます。翻訳は `js/i18n.js` で管理しています。未翻訳の語は日本語へフォールバックします。

## セキュリティ注意

GitHub Pages は公開サイトです。

秘密情報、個人情報、住所、家族情報、APIキー、パスワード、非公開URL、見られて困るメモは保存しないでください。

このサイトでは次の対策をしています。

- JSON文字列を画面に出すときは `textContent` を使う
- 外部URLは `http` / `https` のみ許可
- `javascript:` URLを拒否
- 新しいタブで開くリンクには `rel="noopener noreferrer"` を付与
- インポートJSONを検証
- 不正データはスキップして警告
- localStorage が使えない場合でも公開ページは表示

DashboardをGitHub Pagesへアップロードした場合、それは公開ページとして扱ってください。秘密を置かないことが一番大切です。

## デザイン方針

企業ポートフォリオやSaaS風のランディングページではなく、古い個人ホームページ、リンク集、工房の目録、古い計測器の札を混ぜた雰囲気にしています。

背景は明るい紙色、文字は濃いインク色、アクセントに真鍮色、深緑、暗赤色を使っています。懐かしさは出しつつ、スマホでも読みやすい余白と文字サイズにしています。
