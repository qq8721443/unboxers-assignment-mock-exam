# Client

## 실행

1. apps/client 폴더 내부에 .env.example 파일명을 .env로 변경해주세요.
2. 로컬 서버를 실행해주세요.

```bash
pnpm install
pnpm db:generate
pnpm db:push
pnpm db:seed
pnpm dev
```

3. 클라이언트를 실행해주세요.

```bash
pnpm client:dev
```

## 기술 스택

- React + Vite
- Tailwind CSS
- TanStack Query

---

- TypeScript
  - 정적 타입을 위해 사용했습니다.
- Biome
  - ESLint + Prettier 조합 대신 간단하게 설정하고 사용하기 위해 적용했습니다.
- Zustand
  - 모의고사에서 학생이 제출한 답안 정보를 전역에서 관리하기 위해 사용했습니다.
- Axios
  - API 호출 클라이언트로 사용했습니다. Fetch와 Axios 중 interceptor의 편리함을 위해 선택했습니다. (현재 프로젝트에서 크게 사용하진 않았습니다.)
- React Router
  - 페이지를 tutorial, exam, result 3개의 페이지로 나누면서 라우팅을 위해 사용했습니다.

## 리액트 컴파일러

- 리액트 컴파일러를 적용했습니다.
- 메이저 버전 정식 출시 후 대부분의 프로젝트에 적용해도 되겠다고 판단했습니다.

## AI 사용 범위

프로젝트 전체적으로 AI를 사용했습니다.
Gemini의 Plan 모드를 사용해 구현하고자 하는 코드 구조 및 제약 조건을 정리하고 의도한 대로 코드 수정이 예상되는 경우 실제 코드 작업을 진행했습니다. 코드 수정 후 lint 명령어를 통해 규칙에 어긋나는 코드를 수정하고, skills를 통해 개선의 여지가 있는 코드를 수정하는 플로우로 진행했습니다.

- Gemini CLI (Gemini 3)
- Figma MCP

## 아쉬운 점

- 피그마 대로 완벽하게 UI를 구현하지 못했습니다.
- 빠른 설정을 위해 biome을 도입했는데, eslint-plugin-query나 eslint-plugin-better-tailwindcss 같은 eslint 플러그인을 사용할 수 없는 단점이 있었습니다. 보통 biome을 사용하는 조직은 biome과 eslint를 하이브리드로 사용하는 경우가 많다는 걸 확인했습니다. 현재는 eslint를 적용하지 않아 IDE에서 tailwindcss intellisense를 사용할 경우 warning(suggestCanonicalClasses)이 발생할 수 있습니다.

## 개선할 점

- 태블릿에서의 스와이프 동작으로 뒤로가기/앞으로가기가 의도치 않게 발생할 수 있을 것 같아, 페이지 이동 전 유저에게 안내하는 플로우가 있으면 좋을 것 같습니다. react-router의 useBlocker 등의 기능을 사용하면 될 것 같습니다.
- 버튼 클릭 시 진동 등의 피드백이 있으면 입력되었다는 걸 유저가 인지하기 쉬울 것 같다고 판단했습니다. 태블릿 OS에 따라 지원 범위가 다르긴 하지만, 자바스크립트의 Vibration API를 사용해 제한적인 구현은 가능할 것 같습니다.
