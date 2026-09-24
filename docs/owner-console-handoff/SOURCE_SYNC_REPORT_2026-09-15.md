# SOURCE SYNC REPORT — LAMOU Owner Console

Date: 2026-09-15
Branch: `candidate/lamou-owner-console-codex-2026-09-15`
Status: `PARTIAL_SOURCE_SYNC / BASELINE_NOT_YET_TESTED`
Truth state: `EVIDENCE-BASED`

## Source and target

- Lovable project: `bee5a2f8-878d-4954-a168-029ef7399b36`
- Lovable snapshot: `532025926ff73e837c5f38be08fd76665ff457e5`
- GitHub repository: `rafalamounier1805-ship-it/lamoumusicpromoter1`
- Source import commit: `9fbb026cab1c8d06921e499d45e8509d4ac851ae`
- Target directory: `owner-console/`
- Deployment or promotion: **not performed**

## Outcome

- 180 source entries were inventoried from the exact Lovable snapshot.
- 178 UTF-8 text files were retrieved without error and committed under `owner-console/`.
- `.env` was deliberately excluded to avoid copying secrets; no `.env` was created in GitHub.
- `public/favicon.ico` is binary. The available read endpoint decodes it as text, so a byte-faithful transfer was not possible. It remains an explicit provenance gap.
- No high-confidence credential pattern was found in the 178 imported text files.
- The code/config/migration source is present; install, lint, typecheck and build evidence are still pending.

## Gate decision

`SOURCE_SYNC` is **PARTIAL**, not PASS, because the binary favicon has not yet been copied byte-for-byte. This does not imply the product is buildable; the next gate is a local baseline build and test run. Do not publish or promote.

## File comparison

| Source path | Target path | Git blob SHA | State |
| --- | --- | --- | --- |
| `.env` | — | — | EXCLUDED_SECRET |
| `.gitignore` | `owner-console/.gitignore` | `d24df8a769e2bd7dd6839f2a51f9e0114d2023c5` | SYNCED_TEXT |
| `.lovable/plan.md` | `owner-console/.lovable/plan.md` | `65055d5e2fac43c7a7a3983daaac7526af796090` | SYNCED_TEXT |
| `.lovable/project.json` | `owner-console/.lovable/project.json` | `6c5b6ac278d15f9fa45ed1b6df38559da5e66939` | SYNCED_TEXT |
| `.prettierignore` | `owner-console/.prettierignore` | `be49b2655e2222e8a688f616a5c13500298801a0` | SYNCED_TEXT |
| `.prettierrc` | `owner-console/.prettierrc` | `90abee2393e79dff7ec36856c94f662a263f0107` | SYNCED_TEXT |
| `AGENTS.md` | `owner-console/AGENTS.md` | `36eb109884244365c74c416af1644fcdb9bcc9a3` | SYNCED_TEXT |
| `README.md` | `owner-console/README.md` | `115d456daffb778ee21192176eaf53e547e35ec8` | SYNCED_TEXT |
| `bun.lock` | `owner-console/bun.lock` | `9db0b9f55c8134e99b6ad25e44598f771bbe4f24` | SYNCED_TEXT |
| `bunfig.toml` | `owner-console/bunfig.toml` | `eccc852c7b9f67eecab0b218eb5dd1f4d9ad4852` | SYNCED_TEXT |
| `components.json` | `owner-console/components.json` | `f0817a84e832a693e7a79a911efe0b081bd97e06` | SYNCED_TEXT |
| `drizzle.config.ts` | `owner-console/drizzle.config.ts` | `466668f366d59b51c678238a2fd148b2659558fa` | SYNCED_TEXT |
| `drizzle/migrations/0000_create_owner_profiles.sql` | `owner-console/drizzle/migrations/0000_create_owner_profiles.sql` | `a57d6da02b3768521786cae06e5ae12c88d6b163` | SYNCED_TEXT |
| `drizzle/migrations/0001_core_billing_providers.sql` | `owner-console/drizzle/migrations/0001_core_billing_providers.sql` | `a668f3cc01a3014f65bbafea76a35609b0db0fd8` | SYNCED_TEXT |
| `drizzle/migrations/0002_owner_avatars_policies.sql` | `owner-console/drizzle/migrations/0002_owner_avatars_policies.sql` | `b90b9f7f797bf886c2ebb2fff5c9e92bc1397a11` | SYNCED_TEXT |
| `drizzle/migrations/meta/0000_snapshot.json` | `owner-console/drizzle/migrations/meta/0000_snapshot.json` | `01852748606facb3b9ae8aa73901ec79986d4637` | SYNCED_TEXT |
| `drizzle/migrations/meta/0001_snapshot.json` | `owner-console/drizzle/migrations/meta/0001_snapshot.json` | `fa1cbfd23a323c05809f0eb9093cf027bf1fc54d` | SYNCED_TEXT |
| `drizzle/migrations/meta/0002_snapshot.json` | `owner-console/drizzle/migrations/meta/0002_snapshot.json` | `3ce5d3cb499cc06331e0c9a93083b22b42a7a5b8` | SYNCED_TEXT |
| `drizzle/migrations/meta/_journal.json` | `owner-console/drizzle/migrations/meta/_journal.json` | `e664c805a6abb8f9ee073e46b66ae7f20ae9e645` | SYNCED_TEXT |
| `drizzle/schema.ts` | `owner-console/drizzle/schema.ts` | `76b1801f1bcfea65195c52449ae8587d0729b7ef` | SYNCED_TEXT |
| `eslint.config.js` | `owner-console/eslint.config.js` | `be4075bd5e14ae3e6420613f789c3fc8bbeda819` | SYNCED_TEXT |
| `package.json` | `owner-console/package.json` | `41ec4630a5478ab886f6384bf6a2a2a7ce109a09` | SYNCED_TEXT |
| `public/favicon.ico` | `owner-console/public/favicon.ico` | — | BINARY_NOT_TRANSFERRED |
| `public/robots.txt` | `owner-console/public/robots.txt` | `6018e701fc7dd0317cda9eceea390524322e8a05` | SYNCED_TEXT |
| `roadmap.md` | `owner-console/roadmap.md` | `f72b501204bb741b171f55e3e873e5a7b062a245` | SYNCED_TEXT |
| `src/assets/visual-lock/core-owner-architecture.asset.json` | `owner-console/src/assets/visual-lock/core-owner-architecture.asset.json` | `2af71a2e6cc23ab11d7884d787bf1afbcac9a447` | SYNCED_TEXT |
| `src/assets/visual-lock/icon-library.asset.json` | `owner-console/src/assets/visual-lock/icon-library.asset.json` | `1f8e84afd16f8e440f110d729f32fb8652dc8ba9` | SYNCED_TEXT |
| `src/assets/visual-lock/mapa-vivo-owner.asset.json` | `owner-console/src/assets/visual-lock/mapa-vivo-owner.asset.json` | `c7d0b9214e7afee6af2d9d3d8856b60203d14ee3` | SYNCED_TEXT |
| `src/assets/visual-lock/owner-install-core.asset.json` | `owner-console/src/assets/visual-lock/owner-install-core.asset.json` | `fc40674ebec84de06475288a4f2d81ae90d2f86f` | SYNCED_TEXT |
| `src/assets/visual-lock/owner-install-identity.asset.json` | `owner-console/src/assets/visual-lock/owner-install-identity.asset.json` | `3479129fdaa056ca25f71e700352ced7f677100d` | SYNCED_TEXT |
| `src/assets/visual-lock/owner-install-settings.asset.json` | `owner-console/src/assets/visual-lock/owner-install-settings.asset.json` | `98c10c548091c6c4ed6c7e9fc82832eef0d0c0ec` | SYNCED_TEXT |
| `src/components/lamou/app-shell.tsx` | `owner-console/src/components/lamou/app-shell.tsx` | `4bfc9a078bd19feaffaa7c30dd28ff670397487a` | SYNCED_TEXT |
| `src/components/lamou/case-file.tsx` | `owner-console/src/components/lamou/case-file.tsx` | `1920ffd2f158948b080713893341f60b8ff24a38` | SYNCED_TEXT |
| `src/components/lamou/commercial-view.tsx` | `owner-console/src/components/lamou/commercial-view.tsx` | `14c3f6962ddfc14c99bab29358620827e74b7050` | SYNCED_TEXT |
| `src/components/lamou/context-column.tsx` | `owner-console/src/components/lamou/context-column.tsx` | `0201545f3d7878e31fe35930dffe531460732ad2` | SYNCED_TEXT |
| `src/components/lamou/core-detail-surfaces.tsx` | `owner-console/src/components/lamou/core-detail-surfaces.tsx` | `f16942f43f89ae6a289e23693c19eb6efb1a24c7` | SYNCED_TEXT |
| `src/components/lamou/core-live-panels.tsx` | `owner-console/src/components/lamou/core-live-panels.tsx` | `c34b3c0d6aba6ad650e6f925b2dc6de3bd492de3` | SYNCED_TEXT |
| `src/components/lamou/governed-crud.tsx` | `owner-console/src/components/lamou/governed-crud.tsx` | `fcce1bb1e8b73748b7ef7f49d4c52c32f92c9cf1` | SYNCED_TEXT |
| `src/components/lamou/health-widgets.tsx` | `owner-console/src/components/lamou/health-widgets.tsx` | `81b574fdba96a517fe438c686ba505bd5b5c0c5f` | SYNCED_TEXT |
| `src/components/lamou/interactive.tsx` | `owner-console/src/components/lamou/interactive.tsx` | `6398da223ffb8eb2bab28c05d9c0ad660561b412` | SYNCED_TEXT |
| `src/components/lamou/labtest-view.tsx` | `owner-console/src/components/lamou/labtest-view.tsx` | `77e4b70252a8fc2c6bfc802baef5e1318ca07456` | SYNCED_TEXT |
| `src/components/lamou/module-page.tsx` | `owner-console/src/components/lamou/module-page.tsx` | `62bd1756c021883651a0139e84ab3c8eeb3da1ce` | SYNCED_TEXT |
| `src/components/lamou/owner-auth-panel.tsx` | `owner-console/src/components/lamou/owner-auth-panel.tsx` | `a1a2def34099b02e1cee35d6f3bbee9e3cf62abc` | SYNCED_TEXT |
| `src/components/lamou/plans-view.tsx` | `owner-console/src/components/lamou/plans-view.tsx` | `556ec676ab1edd060e812605b67c4f08959878c4` | SYNCED_TEXT |
| `src/components/lamou/settings-view.tsx` | `owner-console/src/components/lamou/settings-view.tsx` | `efe6ca9ff04a3163d9affee8c6b8e6d65bd96565` | SYNCED_TEXT |
| `src/components/lamou/shell.tsx` | `owner-console/src/components/lamou/shell.tsx` | `bfaa78ce8bca70478b1adf82bfd44fc045ae8c3f` | SYNCED_TEXT |
| `src/components/lamou/substitution-impact.tsx` | `owner-console/src/components/lamou/substitution-impact.tsx` | `be02647445f6c63cfbadcef25d78148c1943da38` | SYNCED_TEXT |
| `src/components/lamou/visual-lock.tsx` | `owner-console/src/components/lamou/visual-lock.tsx` | `078d779d1ea2adeb7e0ddf1fe207d91b6a5c30b3` | SYNCED_TEXT |
| `src/components/lamou/wizard.tsx` | `owner-console/src/components/lamou/wizard.tsx` | `6d0fe092c6e12e54c21343fce680a924d4985819` | SYNCED_TEXT |
| `src/components/ui/accordion.tsx` | `owner-console/src/components/ui/accordion.tsx` | `16ee9004561ab0de3cc53789d5265cba511c8570` | SYNCED_TEXT |
| `src/components/ui/alert-dialog.tsx` | `owner-console/src/components/ui/alert-dialog.tsx` | `072a66562e9d94e33ccaf32d27c8efe3a52e7c32` | SYNCED_TEXT |
| `src/components/ui/alert.tsx` | `owner-console/src/components/ui/alert.tsx` | `cd0a0627702e492c3f02607dbc77025999c5ed13` | SYNCED_TEXT |
| `src/components/ui/aspect-ratio.tsx` | `owner-console/src/components/ui/aspect-ratio.tsx` | `c9e6f4bf9e1c01d6d7022b53e68438e61746c86c` | SYNCED_TEXT |
| `src/components/ui/avatar.tsx` | `owner-console/src/components/ui/avatar.tsx` | `7904926b9d89e90f6e9a3a9dad2abeed5af99c2e` | SYNCED_TEXT |
| `src/components/ui/badge.tsx` | `owner-console/src/components/ui/badge.tsx` | `3aabd17e73034f71efdd2f301f8a81ab8cdae23c` | SYNCED_TEXT |
| `src/components/ui/breadcrumb.tsx` | `owner-console/src/components/ui/breadcrumb.tsx` | `94eb6291a6f26846562a63438b3c49595e9bff25` | SYNCED_TEXT |
| `src/components/ui/button.tsx` | `owner-console/src/components/ui/button.tsx` | `bc3bc9f6bbefc3155d1f4d053ff58f9b8662edbe` | SYNCED_TEXT |
| `src/components/ui/calendar.tsx` | `owner-console/src/components/ui/calendar.tsx` | `94d60d80a7d424fb12587633348fd001d37be5d4` | SYNCED_TEXT |
| `src/components/ui/card.tsx` | `owner-console/src/components/ui/card.tsx` | `d886b020243248cee648b14274a763b325a3bc55` | SYNCED_TEXT |
| `src/components/ui/carousel.tsx` | `owner-console/src/components/ui/carousel.tsx` | `5dd7455702b2fb2c9561dd3b1ed700210ef3be3d` | SYNCED_TEXT |
| `src/components/ui/chart.tsx` | `owner-console/src/components/ui/chart.tsx` | `f27e7ca5343ccc102441afeb45ef946e1d504944` | SYNCED_TEXT |
| `src/components/ui/checkbox.tsx` | `owner-console/src/components/ui/checkbox.tsx` | `f01d47c865e9ce28610b16bfa4021a88beebec3e` | SYNCED_TEXT |
| `src/components/ui/collapsible.tsx` | `owner-console/src/components/ui/collapsible.tsx` | `cb003d17563549c97d3d349477c0aa073b2244aa` | SYNCED_TEXT |
| `src/components/ui/command.tsx` | `owner-console/src/components/ui/command.tsx` | `dc859d7281e5b4fef5a2b71ea30459e0745003a8` | SYNCED_TEXT |
| `src/components/ui/context-menu.tsx` | `owner-console/src/components/ui/context-menu.tsx` | `e4e71c117a68b944bd7ff43ee5d93c013736ced2` | SYNCED_TEXT |
| `src/components/ui/dialog.tsx` | `owner-console/src/components/ui/dialog.tsx` | `8ed559e3d6f2ab5f0d0287f56c63fbcd48a47b87` | SYNCED_TEXT |
| `src/components/ui/drawer.tsx` | `owner-console/src/components/ui/drawer.tsx` | `33533cc7600c40d506a3d308d16ef25f95af3e9d` | SYNCED_TEXT |
| `src/components/ui/dropdown-menu.tsx` | `owner-console/src/components/ui/dropdown-menu.tsx` | `211a4e514aa7cfca580d33efa434272b2011eec6` | SYNCED_TEXT |
| `src/components/ui/form.tsx` | `owner-console/src/components/ui/form.tsx` | `4d15828dac1306f42581c2aa2aa45d04c65522db` | SYNCED_TEXT |
| `src/components/ui/hover-card.tsx` | `owner-console/src/components/ui/hover-card.tsx` | `36f3b7976293638d6c1eef6c426847107dbf766f` | SYNCED_TEXT |
| `src/components/ui/input-otp.tsx` | `owner-console/src/components/ui/input-otp.tsx` | `7eabf266b713f8571a88e0a0e7ebc93ff1da709c` | SYNCED_TEXT |
| `src/components/ui/input.tsx` | `owner-console/src/components/ui/input.tsx` | `7db524115c08e80b10d5282d1bb504b06b238d17` | SYNCED_TEXT |
| `src/components/ui/label.tsx` | `owner-console/src/components/ui/label.tsx` | `392197c3b43d69a9b426d49dec06d32ff53ea8d4` | SYNCED_TEXT |
| `src/components/ui/menubar.tsx` | `owner-console/src/components/ui/menubar.tsx` | `b6608238d97e321c47e90e526fd30eb12946f717` | SYNCED_TEXT |
| `src/components/ui/navigation-menu.tsx` | `owner-console/src/components/ui/navigation-menu.tsx` | `94b2ecc95158b20a18bd986d1313558a128c480f` | SYNCED_TEXT |
| `src/components/ui/pagination.tsx` | `owner-console/src/components/ui/pagination.tsx` | `f8cd41fbaad75c338aec493b5c750b65f95845c5` | SYNCED_TEXT |
| `src/components/ui/popover.tsx` | `owner-console/src/components/ui/popover.tsx` | `dc78a209bbda251914e8ee4633c303ba55a59d2c` | SYNCED_TEXT |
| `src/components/ui/progress.tsx` | `owner-console/src/components/ui/progress.tsx` | `1741cd2f42b7b3c7edcabee07c06e8750556f5ed` | SYNCED_TEXT |
| `src/components/ui/radio-group.tsx` | `owner-console/src/components/ui/radio-group.tsx` | `38a1a6629d76c4a6f445eb85aa8c6d485b9c064a` | SYNCED_TEXT |
| `src/components/ui/resizable.tsx` | `owner-console/src/components/ui/resizable.tsx` | `02e9460e72e5e0afa5f71264f0fcd4a16d021aea` | SYNCED_TEXT |
| `src/components/ui/scroll-area.tsx` | `owner-console/src/components/ui/scroll-area.tsx` | `69febe58466d6309bdfc74bdca456c7aac448f79` | SYNCED_TEXT |
| `src/components/ui/select.tsx` | `owner-console/src/components/ui/select.tsx` | `3fdfc929eb90d4f33e2591e94cdfb2278d1b5c38` | SYNCED_TEXT |
| `src/components/ui/separator.tsx` | `owner-console/src/components/ui/separator.tsx` | `5f5966c41731e846b2bc97de315471ea605ffe86` | SYNCED_TEXT |
| `src/components/ui/sheet.tsx` | `owner-console/src/components/ui/sheet.tsx` | `0aedeb766169d085f3b4bb72e80eac6fe552b971` | SYNCED_TEXT |
| `src/components/ui/sidebar.tsx` | `owner-console/src/components/ui/sidebar.tsx` | `3922680246adfbcdc91110f779eea0b291222a54` | SYNCED_TEXT |
| `src/components/ui/skeleton.tsx` | `owner-console/src/components/ui/skeleton.tsx` | `6d9a616758e39fcbc07480484a308ffb9d9fba5d` | SYNCED_TEXT |
| `src/components/ui/slider.tsx` | `owner-console/src/components/ui/slider.tsx` | `e56622ad7eec5f4e98dc870f745c2e066c66f10e` | SYNCED_TEXT |
| `src/components/ui/sonner.tsx` | `owner-console/src/components/ui/sonner.tsx` | `7a214692adeeea9cfe4acd8659b1b7e0fd4f756f` | SYNCED_TEXT |
| `src/components/ui/switch.tsx` | `owner-console/src/components/ui/switch.tsx` | `6338184e11d92961b4dfd06f151ce5ada7dd838c` | SYNCED_TEXT |
| `src/components/ui/table.tsx` | `owner-console/src/components/ui/table.tsx` | `49d2d5c7c3e9d2d43fb2a2e423c751ec77da4279` | SYNCED_TEXT |
| `src/components/ui/tabs.tsx` | `owner-console/src/components/ui/tabs.tsx` | `6047b50eb6db8395f79c666e488d71881155d97e` | SYNCED_TEXT |
| `src/components/ui/textarea.tsx` | `owner-console/src/components/ui/textarea.tsx` | `29330b61811cf9aaac31a94f981728f898229bd5` | SYNCED_TEXT |
| `src/components/ui/toggle-group.tsx` | `owner-console/src/components/ui/toggle-group.tsx` | `d2c9f8ee385d50f14ca51f63db9cad9b92accd47` | SYNCED_TEXT |
| `src/components/ui/toggle.tsx` | `owner-console/src/components/ui/toggle.tsx` | `9d146b6a1051516735339895093cbcbcfeb9a3e8` | SYNCED_TEXT |
| `src/components/ui/tooltip.tsx` | `owner-console/src/components/ui/tooltip.tsx` | `07e55fafdcf32ee9a57164a07c89422e61c6ac2e` | SYNCED_TEXT |
| `src/hooks/use-mobile.tsx` | `owner-console/src/hooks/use-mobile.tsx` | `502fd323934501eab408a396a9ae4a07c0ae3560` | SYNCED_TEXT |
| `src/integrations/supabase/auth-middleware.ts` | `owner-console/src/integrations/supabase/auth-middleware.ts` | `ad5f7245a0792a9ea745e71e81ab6bf372fb144d` | SYNCED_TEXT |
| `src/integrations/supabase/client.server.ts` | `owner-console/src/integrations/supabase/client.server.ts` | `45a04b9c05d11abad57780fca1e34dba309cf8ef` | SYNCED_TEXT |
| `src/integrations/supabase/client.ts` | `owner-console/src/integrations/supabase/client.ts` | `3f8bc8f9ce6a0623adfa78cab23764a5e8f35646` | SYNCED_TEXT |
| `src/integrations/supabase/previewAuthStorage.ts` | `owner-console/src/integrations/supabase/previewAuthStorage.ts` | `c335f2ba35eef99ad2283348180ea7df47030468` | SYNCED_TEXT |
| `src/integrations/supabase/types.ts` | `owner-console/src/integrations/supabase/types.ts` | `3d8ac0ae3706869f65dc94726865cf1c7155ea45` | SYNCED_TEXT |
| `src/lib/error-capture.ts` | `owner-console/src/lib/error-capture.ts` | `e4a97bedd4614fc51cdcdb5583a918e6b57a5dfc` | SYNCED_TEXT |
| `src/lib/error-page.ts` | `owner-console/src/lib/error-page.ts` | `725235ce7bdf496daf2d870148978939f4f40a9b` | SYNCED_TEXT |
| `src/lib/lamou/case-provenance.ts` | `owner-console/src/lib/lamou/case-provenance.ts` | `f6f950ad79fb78a91cf04aafc0a295a4c13bc657` | SYNCED_TEXT |
| `src/lib/lamou/client-360.ts` | `owner-console/src/lib/lamou/client-360.ts` | `eb9f377cd845d4bb855a537cc6854790990c049b` | SYNCED_TEXT |
| `src/lib/lamou/core-settings-data.ts` | `owner-console/src/lib/lamou/core-settings-data.ts` | `d344846ef86a30946ecd35f5fda83d421f9773d2` | SYNCED_TEXT |
| `src/lib/lamou/council-data.ts` | `owner-console/src/lib/lamou/council-data.ts` | `e6ee6ec7e28ecfd68ab15b87d3c5a350ce0b3138` | SYNCED_TEXT |
| `src/lib/lamou/demo-data.ts` | `owner-console/src/lib/lamou/demo-data.ts` | `8e38200c966b916930c147675edf206c5a7cef38` | SYNCED_TEXT |
| `src/lib/lamou/health-model.ts` | `owner-console/src/lib/lamou/health-model.ts` | `6a6da37c01e798e2ffec953b97f843cf824e59f6` | SYNCED_TEXT |
| `src/lib/lamou/lab-data.ts` | `owner-console/src/lib/lamou/lab-data.ts` | `30592ab659a28ece29cbb0af10d6dc65c5aa5dcd` | SYNCED_TEXT |
| `src/lib/lamou/labtest-data.ts` | `owner-console/src/lib/lamou/labtest-data.ts` | `f2aacd3554c292024c84ff7df88681ed91750e70` | SYNCED_TEXT |
| `src/lib/lamou/nav.ts` | `owner-console/src/lib/lamou/nav.ts` | `85c86c5a5d7e2a9b6e38ca9a194ab8734246d327` | SYNCED_TEXT |
| `src/lib/lamou/owner-auth.ts` | `owner-console/src/lib/lamou/owner-auth.ts` | `f303235ca9cd1f8b6782924d26e7b43bc3079aef` | SYNCED_TEXT |
| `src/lib/lamou/pages.ts` | `owner-console/src/lib/lamou/pages.ts` | `008939ffa934cec74944eddf2e5719666238317c` | SYNCED_TEXT |
| `src/lib/lamou/provider-check.functions.ts` | `owner-console/src/lib/lamou/provider-check.functions.ts` | `f3b09e29ef632fd2e606874b6ba924d25e772495` | SYNCED_TEXT |
| `src/lib/lamou/registry.ts` | `owner-console/src/lib/lamou/registry.ts` | `7b5193f1c8a0224613425e8e84051da85f633553` | SYNCED_TEXT |
| `src/lib/lamou/settings-data.ts` | `owner-console/src/lib/lamou/settings-data.ts` | `406da8fe57e8d1d60face4cb9cd62041d7788590` | SYNCED_TEXT |
| `src/lib/lamou/store.tsx` | `owner-console/src/lib/lamou/store.tsx` | `ac894a2a5fe3e280cc617cd9e28e69a1869c2b35` | SYNCED_TEXT |
| `src/lib/lamou/types.ts` | `owner-console/src/lib/lamou/types.ts` | `a550ac8c031835d324345cc045a346dcb802e621` | SYNCED_TEXT |
| `src/lib/lamou/visual-locks.ts` | `owner-console/src/lib/lamou/visual-locks.ts` | `04be4347ccdfced40d2c8e3bd4e2ce227bedf301` | SYNCED_TEXT |
| `src/lib/lovable-error-reporting.ts` | `owner-console/src/lib/lovable-error-reporting.ts` | `0ea832be8d3eb1f9fb8a369dca02c4bdea7eb148` | SYNCED_TEXT |
| `src/lib/utils.ts` | `owner-console/src/lib/utils.ts` | `a5ef193506d07d0459fec4f187af08283094d7c8` | SYNCED_TEXT |
| `src/routeTree.gen.ts` | `owner-console/src/routeTree.gen.ts` | `7472c2fd77eb6158e06e59f052856ca1e1edfd8d` | SYNCED_TEXT |
| `src/router.tsx` | `owner-console/src/router.tsx` | `3423d598036579e62f42faec438f868b4bb0bb17` | SYNCED_TEXT |
| `src/routes/README.md` | `owner-console/src/routes/README.md` | `441a4e8235d1432e015c8f7a0bf045b031c565ad` | SYNCED_TEXT |
| `src/routes/__root.tsx` | `owner-console/src/routes/__root.tsx` | `8bcd58e1b474b5cd54df8d01c97b236ebee48fef` | SYNCED_TEXT |
| `src/routes/apps.benchmarker.tsx` | `owner-console/src/routes/apps.benchmarker.tsx` | `bd77a1ca2026ec3e5dd814c19d64823c4c1b2540` | SYNCED_TEXT |
| `src/routes/apps.diagnostico-360.tsx` | `owner-console/src/routes/apps.diagnostico-360.tsx` | `4725e436ed5714a6d230920f62b94ab003ec7d29` | SYNCED_TEXT |
| `src/routes/apps.digital-improvement.tsx` | `owner-console/src/routes/apps.digital-improvement.tsx` | `d05f8ede2390d48f910edebd6d5ecf5e0fefe6d2` | SYNCED_TEXT |
| `src/routes/apps.lab.tsx` | `owner-console/src/routes/apps.lab.tsx` | `cfbd8649cfac4f096fafc4d2af7050a7c0ef984c` | SYNCED_TEXT |
| `src/routes/apps.meeting-architect.tsx` | `owner-console/src/routes/apps.meeting-architect.tsx` | `474b16bf1930c61fb2b1b37e6520403b7732c26e` | SYNCED_TEXT |
| `src/routes/apps.opportunity-intelligence.tsx` | `owner-console/src/routes/apps.opportunity-intelligence.tsx` | `3053ad05b554422054377bb0eb24dd49c970d008` | SYNCED_TEXT |
| `src/routes/apps.orbit.tsx` | `owner-console/src/routes/apps.orbit.tsx` | `900a2c343ff57b015498eb8b93bc235b9410917c` | SYNCED_TEXT |
| `src/routes/apps.research-scout.tsx` | `owner-console/src/routes/apps.research-scout.tsx` | `06b5a61237faac4869c58c82e34fd0fe140ea5bc` | SYNCED_TEXT |
| `src/routes/apps.showroom.tsx` | `owner-console/src/routes/apps.showroom.tsx` | `b1bccc49fe277332e55f10ac00fd3e78e45e0ed8` | SYNCED_TEXT |
| `src/routes/apps.teste3.tsx` | `owner-console/src/routes/apps.teste3.tsx` | `828cb8ea6933b8bafa18d023dc817246fa04f89f` | SYNCED_TEXT |
| `src/routes/apps.validation-gate.tsx` | `owner-console/src/routes/apps.validation-gate.tsx` | `b83cbc7f69c12e0a7ea105158dcc680f0fddf586` | SYNCED_TEXT |
| `src/routes/apps.version.tsx` | `owner-console/src/routes/apps.version.tsx` | `2aa123d116f7b5f13e061294cd6fb68e14f4dc2c` | SYNCED_TEXT |
| `src/routes/core.ai.tsx` | `owner-console/src/routes/core.ai.tsx` | `2404b6725dc73ee4034211b98f070528f037950e` | SYNCED_TEXT |
| `src/routes/core.apps.tsx` | `owner-console/src/routes/core.apps.tsx` | `dadf768bc60dbab340dfa6d40f12e928f060501e` | SYNCED_TEXT |
| `src/routes/core.architecture.tsx` | `owner-console/src/routes/core.architecture.tsx` | `7fe48f06c78a5d43008ddc5362685ca6bdea6a52` | SYNCED_TEXT |
| `src/routes/core.calls.tsx` | `owner-console/src/routes/core.calls.tsx` | `6d2326c532c2688c8a470299c256fc485e58d151` | SYNCED_TEXT |
| `src/routes/core.data.tsx` | `owner-console/src/routes/core.data.tsx` | `24646d5da0af18faaf47dd83aa56fddf66b412ae` | SYNCED_TEXT |
| `src/routes/core.health.tsx` | `owner-console/src/routes/core.health.tsx` | `b5a090f74514f3630342c00f8fce9a5d948529cf` | SYNCED_TEXT |
| `src/routes/core.index.tsx` | `owner-console/src/routes/core.index.tsx` | `2076657ad11f640b254d5ffc32117923eb2a4dab` | SYNCED_TEXT |
| `src/routes/core.lab.tsx` | `owner-console/src/routes/core.lab.tsx` | `85f6558a98cd0ae1fdf0a74380b472dcf9b87496` | SYNCED_TEXT |
| `src/routes/core.observability.tsx` | `owner-console/src/routes/core.observability.tsx` | `6368d9d2df520b99945ff2665d06afa1e531fed8` | SYNCED_TEXT |
| `src/routes/core.problems.tsx` | `owner-console/src/routes/core.problems.tsx` | `7ac98c4a70b7cd0a4991537a133545be0c00de81` | SYNCED_TEXT |
| `src/routes/core.security.tsx` | `owner-console/src/routes/core.security.tsx` | `ebde5f500006365b996cf3224efc2d94a25d5dd6` | SYNCED_TEXT |
| `src/routes/core.settings.tsx` | `owner-console/src/routes/core.settings.tsx` | `b13551f6449acba531be5a0830285d95592ef406` | SYNCED_TEXT |
| `src/routes/core.sol-lua.tsx` | `owner-console/src/routes/core.sol-lua.tsx` | `b4c8e4def0923cbfec74d384bf311aee6c9bc556` | SYNCED_TEXT |
| `src/routes/core.tests.tsx` | `owner-console/src/routes/core.tests.tsx` | `05d7274e2c60db88d77f32cc8a4a1825d8b13014` | SYNCED_TEXT |
| `src/routes/core.trainings.tsx` | `owner-console/src/routes/core.trainings.tsx` | `c6a76790bf70704000c0ce82d606eb12969755b0` | SYNCED_TEXT |
| `src/routes/core.versions.tsx` | `owner-console/src/routes/core.versions.tsx` | `dc4d59989d80e37a0f163cf5079869cc79c3e2b7` | SYNCED_TEXT |
| `src/routes/index.tsx` | `owner-console/src/routes/index.tsx` | `d0de48b9c07b2f3cd97c7ea0d4b3ed4c79b202b7` | SYNCED_TEXT |
| `src/routes/install/client.tsx` | `owner-console/src/routes/install/client.tsx` | `77c2f3a965bd18e1eecbde3cf548cdd69ab47c68` | SYNCED_TEXT |
| `src/routes/install/owner.tsx` | `owner-console/src/routes/install/owner.tsx` | `6e5d319160ebb1a0638d957dd66352158026d8ab` | SYNCED_TEXT |
| `src/routes/labtest.index.tsx` | `owner-console/src/routes/labtest.index.tsx` | `fff4c75ca66f5863142cd56c20a473862db66718` | SYNCED_TEXT |
| `src/routes/labtest.next.tsx` | `owner-console/src/routes/labtest.next.tsx` | `d30ec2dcd938319931633e83f074601faf2d5650` | SYNCED_TEXT |
| `src/routes/owner.apps.tsx` | `owner-console/src/routes/owner.apps.tsx` | `0c4b6cb1fdede4867eb71ff3a90abf27e1a3d044` | SYNCED_TEXT |
| `src/routes/owner.clients.tsx` | `owner-console/src/routes/owner.clients.tsx` | `41446b48f40aaa9f529bbc91fa6d0e201a4e41fa` | SYNCED_TEXT |
| `src/routes/owner.commercial.tsx` | `owner-console/src/routes/owner.commercial.tsx` | `fb027e48b726d95be0ebba93cd912ce617e567fb` | SYNCED_TEXT |
| `src/routes/owner.documents.tsx` | `owner-console/src/routes/owner.documents.tsx` | `223d42092e2f74b751f9b1ccfec3b648dadba0b4` | SYNCED_TEXT |
| `src/routes/owner.index.tsx` | `owner-console/src/routes/owner.index.tsx` | `5dea7c67050708bf7c1e4dc8d3b32892582be0f6` | SYNCED_TEXT |
| `src/routes/owner.integrations.tsx` | `owner-console/src/routes/owner.integrations.tsx` | `14c6e8233c3a8cb32a0ccb28376f0da4c8753927` | SYNCED_TEXT |
| `src/routes/owner.mapa-vivo.tsx` | `owner-console/src/routes/owner.mapa-vivo.tsx` | `20ba6a10bef17d33a9ed193e4216234a577ae2ba` | SYNCED_TEXT |
| `src/routes/owner.opportunities.tsx` | `owner-console/src/routes/owner.opportunities.tsx` | `cfc2fcadc565005103e783663a1bb6548dcbb6e4` | SYNCED_TEXT |
| `src/routes/owner.plans.tsx` | `owner-console/src/routes/owner.plans.tsx` | `f662b983ba3086c152e73d0eb4133274fc18a9dc` | SYNCED_TEXT |
| `src/routes/owner.products.tsx` | `owner-console/src/routes/owner.products.tsx` | `25abef566f9a8b5b9f0b9961883465131491be4c` | SYNCED_TEXT |
| `src/routes/owner.security.tsx` | `owner-console/src/routes/owner.security.tsx` | `472f71300fb67ceb7a740d52a8399576da901a69` | SYNCED_TEXT |
| `src/routes/owner.settings.tsx` | `owner-console/src/routes/owner.settings.tsx` | `b1e84e2e158bae27825dcae626bbe0957974f164` | SYNCED_TEXT |
| `src/routes/owner.tests.tsx` | `owner-console/src/routes/owner.tests.tsx` | `89d43576c5aa1c8d3976041716066061e6596022` | SYNCED_TEXT |
| `src/routes/owner.versions.tsx` | `owner-console/src/routes/owner.versions.tsx` | `d7912a5a2676279f48ef21816adb7534f0a85f8b` | SYNCED_TEXT |
| `src/routes/reset-password.tsx` | `owner-console/src/routes/reset-password.tsx` | `fc791ef88d4bcfff1979aada3bd4a42056ec1209` | SYNCED_TEXT |
| `src/server.ts` | `owner-console/src/server.ts` | `20500c7f347db7dd59ff59e295be226aa317757f` | SYNCED_TEXT |
| `src/start.ts` | `owner-console/src/start.ts` | `61cc0192fcdbf37d0952f366992fd55e555d905a` | SYNCED_TEXT |
| `src/styles.css` | `owner-console/src/styles.css` | `789bf6eb9e7f56748320e70b80f7628815586c57` | SYNCED_TEXT |
| `supabase/config.toml` | `owner-console/supabase/config.toml` | `8d6ca73d92d593fc2b2e30e063159a48e81abd69` | SYNCED_TEXT |
| `tsconfig.json` | `owner-console/tsconfig.json` | `a522d218dc57d4ca2577d8fc1f8ac864b7711ba7` | SYNCED_TEXT |
| `vite.config.ts` | `owner-console/vite.config.ts` | `174e074ca30e73877870b02eb162b0c28848051e` | SYNCED_TEXT |
