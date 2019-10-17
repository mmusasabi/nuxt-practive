# nuxt 練習

## 環境メモ

Windows 10 pro
git bash
Docker version 19.03.2, build 6a30dfc

## windowsでdocker-compose使う際の注意点

- WSLを使うとvolumesを使う際にパス違いで上手くマウントが出来ない。
- セキュリティソフトに10.0.75.2 (Default docker IP setting)がブロックされるとマウントが出来ない。