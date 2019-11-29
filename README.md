# nuxt 練習

[dockerでnuxt.jsの環境を作ってみる - Qiita](https://qiita.com/reflet/items/e7c33f84ab43ab237ee4)

こちらを元に構築練習

## 環境メモ

Windows 10 pro
git bash
Docker version 19.03.2, build 6a30dfc
node -v v8.16.2
npm -v 6.4.1

## Run

```
docker-compose run nuxt bash

yarn install
yarn run dev
```

### http://localhost:3030/music/visual を使う前に

適当なmp3の音楽ファイルをmusic.mp3とmusic2.mp3にリネームしてapp/staticディレクトリに突っ込んで下さい。

## windowsでdocker-compose使う際の注意点

- WSLを使うとvolumesを使う際にパス違いで上手くマウントが出来ない。
- セキュリティソフトに10.0.75.2 (Default docker IP setting)がブロックされるとマウントが出来ない。

## nuxtのセットアップ

`vue init nuxt-community/starter-template .`

[Nuxt.js はじめました。プロジェクト作成で 5 つの方法を試した。 - Qiita](https://qiita.com/high-u/items/1d2e91e97495ac90d10c)





## 勉強になるページ

### [Web Audio API を使用したゲーム用音声の開発](https://www.html5rocks.com/ja/tutorials/webaudio/games/)

色々なゲームを見せる上で大事な音のだし方が色々書いてる

