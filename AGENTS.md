# GEB 入口

- **L1 项目索引（优先阅读）**: [PROJECT_INDEX.md](./PROJECT_INDEX.md)
- 结构变更后必须同步: 文件头 Input/Output/Pos → 目录 FOLDER_INDEX.md → PROJECT_INDEX.md
- 全局 GEB 规则: `~/.grok/AGENTS.md` / skill `geb`

---

# AGENTS.md 鈥?AI 鍗忎綔瀵艰埅鏂囨。

> 浠讳綍 AI 杩涘叆姝ら」鐩紝璇峰厛瀹屾暣闃呰鏈枃浠讹紝鍐嶅紑濮嬩换浣曟搷浣溿€?

---

## 涓€銆侀」鐩槸浠€涔?

杩欐槸 **Xuan 鐨勪釜浜哄崥瀹?*锛屾鍦ㄤ粠鏃ф妧鏈爤閲嶅啓涓烘柊鎶€鏈爤銆?

| 缁村害      | 鏃э紙閲嶅啓鍓嶏級                               | 鏂帮紙鐩爣锛?                              |
| ----------- | ----------------------------------------------- | ------------------------------------------- |
| 璺敱       | Next.js 15 Pages Router                         | Next.js 15 App Router                       |
| 鍐呭灞?    | Nextra 3 + nextra-theme-blog                    | Velite                                      |
| 鏍峰紡      | Tailwind CSS v3.4锛圢extra 绠＄悊鏆楄壊妯″紡锛? | Tailwind CSS v3.4 + next-themes             |
| RSS         | scripts/gen-rss.mjs 澶栭儴鑴氭湰                | app/feed.xml/route.ts 璺敱                 |
| 鏆楄壊妯″紡 | Nextra 鍐呯疆                                   | next-themes锛堢郴缁熻嚜鍔?+ 鎵嬪姩鍒囨崲锛? |
| 閮ㄧ讲      | Vercel + Cloudflare Pages                       | 鍚屽乏锛屼繚鐣欏弻閮ㄧ讲鏀寔               |

鍗氬鍔熻兘鑼冨洿锛?*鍙繚鐣欐枃绔犲垪琛?+ 鏂囩珷璇︽儏**锛屾棤 commission銆佹棤 photography銆?
---

## 浜屻€侀噸瑕佹枃妗ｈ矾寰?

| 鏂囨。      | 璺緞                                                           | 鍐呭                                 |
| ----------- | --------------------------------------------------------------- | ------------------------------------- |
| 璁捐 Spec  | docs/superpowers/specs/2026-07-06-nextjs-blog-rewrite-design.md | 鏋舵瀯鍐崇瓥銆佹妧鏈€夊瀷銆佹暟鎹祦 |
| 瀹炵幇璁″垝 | docs/superpowers/plans/2026-07-06-nextjs-blog-rewrite.md        | 17 涓换鍔＄殑閫愭瀹炵幇娓呭崟       |
| 鏈枃浠?    | AGENTS.md                                                       | 椤圭洰瀵艰埅锛堜綘姝ｅ湪璇伙級        |

*_寮€濮嬪伐浣滃墠蹇呰锛?_ 鍏堣 Spec锛屽啀璇诲疄鐜拌鍒掞紝纭褰撳墠杩涘害鍚庡啀鍔ㄦ墜銆?
---

## 涓夈€佸綋鍓嶈繘搴?

*_闃舵锛氬噯澶囬樁娈?鈥?灏氭湭寮€濮嬪疄鐜颁换浣曚唬鐮?_

- [x] 璁捐 Spec 宸插畬鎴愬苟淇濆瓨
- [x] 瀹炵幇璁″垝宸插畬鎴愬苟淇濆瓨
- [x] Task 1: 鏇存柊 package.json 渚濊禆
- [x] Task 2: 鍒涘缓 velite.config.ts
- [x] Task 3: 鏇存柊 next.config.ts
- [x] Task 4: 鏇存柊 tsconfig.json
- [x] Task 5: 鏇存柊 tailwind.config.ts
- [x] Task 6: 杩佺Щ鏂囩珷鍒?content/posts/
- [x] Task 7: 鍒涘缓 app/globals.css
- [x] Task 8: 鍒涘缓 components/mdx-components.tsx
- [x] Task 9: 鍒涘缓 components/theme-toggle.tsx
- [x] Task 10: 鍒涘缓 components/post-list.tsx
- [x] Task 11: 鍒涘缓 app/layout.tsx
- [x] Task 12: 鍒涘缓 app/page.tsx
- [x] Task 13: 鍒涘缓 app/posts/page.tsx
- [x] Task 14: 鍒涘缓 app/posts/[slug]/page.tsx
- [x] Task 15: 鍒涘缓 app/feed.xml/route.ts
- [x] Task 16: 鍒犻櫎鏃ф枃浠讹紙pages/, data/, scripts/, theme.config.tsx 绛夛級
- [x] Task 17: 楠岃瘉鏋勫缓閫氳繃

姣忓畬鎴愪竴涓?Task锛岃灏嗗搴旇鐨?`[ ]` 鏀逛负 `[x]` 骞舵洿鏂版湰鏂囦欢銆?
---

## 鍥涖€佸叧閿害鏉燂紙AI 蹇呴』閬靛畧锛?

1. **涓嶈瀹夎 Nextra**锛屽凡鍐冲畾褰诲簳绉婚櫎
2. **涓嶈鍗囩骇 Tailwind 鍒?v4**锛屼繚鎸?v3.4
3. **RSS 蹇呴』鐢?app/feed.xml/route.ts**锛屼笉鐢ㄥ閮ㄨ剼鏈拰 rss 鍖?4. **next.config.ts 蹇呴』鐢?withVelite 鍖呰９**锛屼笖闇€瑕?transpilePackages: ["velite"]
4. **velite.config.ts 鐨?slug 瀛楁**锛歠rontmatter 閲岀殑 slug 浼樺厛锛屽惁鍒欑敤鏂囦欢鍚嶏紙ctx.meta.basename锛?6. **mdx-components.tsx 蹇呴』鍖呭惈 Nextra 鏃х粍浠跺厹搴?*锛圕allout, Tabs, Tab, Steps, FileTree锛?7. **鏆楄壊妯″紡鐢?darkMode: "class"** 閰嶅悎 next-themes
5. **淇濈暀 public/ 鐩綍**锛堝瓧浣撱€佸浘鏍囥€佸浘鐗囷級涓嶈鍒犻櫎
6. **鍖呯鐞嗗櫒鐢?bun**锛屼笉瑕佺敤 npm/yarn

---

## 浜斻€侀」鐩洰褰曠幇鐘讹紙閲嶅啓鍓嶏級

褰撳墠浠嶆槸鏃ф灦鏋勶紝涓昏鐩綍锛?

```
pages/          <- 鏃?Pages Router 椤甸潰锛岄噸鍐欏悗鍒犻櫎
components/     <- 閮ㄥ垎缁勪欢浼氫繚鐣欙紙閲嶅啓锛夛紝commission/ 鍜?photography/ 鍒犻櫎
data/           <- 濮旀墭鍜屾憚褰辨暟鎹紝閲嶅啓鍚庡垹闄?scripts/        <- RSS 鐢熸垚鑴氭湰锛岄噸鍐欏悗鍒犻櫎
styles/         <- main.css 杩佺Щ鍒?app/globals.css 鍚庡垹闄?public/         <- 闈欐€佽祫婧愶紝淇濈暀涓嶅姩
```

閲嶅啓鍚庣洰鏍囩洰褰曪細

````
app/            <- App Router 椤甸潰鍜屽竷灞€
components/     <- 鍙繚鐣欐柊缁勪欢
content/posts/  <- 鎵€鏈夋枃绔狅紙浠?pages/posts/ 杩佺Щ锛?.velite/        <- Velite 鏋勫缓杈撳嚭锛坓itignore锛?```

---

## 鍏€乂elite 鏁版嵁缁撴瀯

鏂囩珷 frontmatter 鏍煎紡锛?
```yaml
---
title: '鏂囩珷鏍囬'
date: 2024/01/15
description: '鎽樿锛堝彲閫夛級'
author: Xuan
image: https://...锛堝彲閫夛級
slug: custom-slug锛堝彲閫夛紝涓嶅～鍒欑敤鏂囦欢鍚嶏級
---
````

Velite 鐢熸垚鍚庝粠 @/.velite 瀵煎叆锛?

```ts
import { posts } from '@/.velite'
// posts: Array<{ title, date, description?, author?, slug, content }>
```

---

## 涓冦€佽仈绯讳笂涓嬫枃

- 鍗氬鍩熷悕锛氬緟瀹?- 浣滆€咃細Xuan
- Twitter锛欯Xuan__
- 閮ㄧ讲锛歏ercel锛堜富锛? Cloudflare Pages锛圕F_PAGES=true 鏃堕潤鎬佸鍑猴級
