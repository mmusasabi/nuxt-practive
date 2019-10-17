# nuxt 練習

[dockerでnuxt.jsの環境を作ってみる - Qiita](https://qiita.com/reflet/items/e7c33f84ab43ab237ee4)

こちらを元に構築練習

## 環境メモ

Windows 10 pro
git bash
Docker version 19.03.2, build 6a30dfc
node -v v8.16.2
npm -v 6.4.1

## windowsでdocker-compose使う際の注意点

- WSLを使うとvolumesを使う際にパス違いで上手くマウントが出来ない。
- セキュリティソフトに10.0.75.2 (Default docker IP setting)がブロックされるとマウントが出来ない。

## nuxtのセットアップ

`vue init nuxt-community/starter-template .`

[Nuxt.js はじめました。プロジェクト作成で 5 つの方法を試した。 - Qiita](https://qiita.com/high-u/items/1d2e91e97495ac90d10c)


