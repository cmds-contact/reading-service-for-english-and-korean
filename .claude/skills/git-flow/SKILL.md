---
name: git-flow
description: |
  Git-Flow 브랜치 전략을 사용한 GitHub 저장소 관리. 브랜치 생성, PR 생성, 머지, 릴리스 관리를 자동화.
  트리거: "깃헙에 올려줘", "PR 만들어줘", "릴리스 해줘", "feature 브랜치 만들어줘", "develop에 머지해줘",
  "hotfix 만들어줘", "Git-Flow", "브랜치 정리해줘"
---

# Git-Flow GitHub Management

Git-Flow 브랜치 전략으로 GitHub 저장소를 관리한다.

## Branch Structure

```
main (production)
  └── develop (integration)
        ├── feature/* (new features)
        ├── release/* (release preparation)
        └── hotfix/* (emergency fixes)
```

## Branch Naming

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feature/<short-description>` | `feature/sidebar-toggle` |
| Release | `release/v<major>.<minor>.<patch>` | `release/v1.2.0` |
| Hotfix | `hotfix/<issue-or-description>` | `hotfix/login-crash` |

## Workflows

### Feature Development

```bash
# 1. develop에서 분기
git checkout develop && git pull origin develop
git checkout -b feature/<name>

# 2. 작업 후 커밋
git add . && git commit -m "feat: <description>"

# 3. PR 생성 (base: develop)
git push -u origin feature/<name>
gh pr create --base develop --title "feat: <title>" --body "$(cat <<'EOF'
## Summary
- ...

## Test Plan
- [ ] ...

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"

# 4. 머지 후 정리
git checkout develop && git pull
git branch -d feature/<name>
```

### Release

```bash
# 1. develop에서 release 분기
git checkout develop && git pull
git checkout -b release/v<version>

# 2. 버전 업데이트, 테스트, 버그 수정

# 3. main에 머지 + 태그
git checkout main && git merge release/v<version>
git tag -a v<version> -m "Release v<version>"
git push origin main --tags

# 4. develop에도 머지
git checkout develop && git merge release/v<version>
git push origin develop

# 5. 정리
git branch -d release/v<version>
git push origin --delete release/v<version>
```

### Hotfix

```bash
# 1. main에서 hotfix 분기
git checkout main && git pull
git checkout -b hotfix/<name>

# 2. 수정 후 커밋
git add . && git commit -m "fix: <description>"

# 3. main에 머지 + 태그
git checkout main && git merge hotfix/<name>
git tag -a v<version> -m "Hotfix v<version>"
git push origin main --tags

# 4. develop에도 머지
git checkout develop && git merge hotfix/<name>
git push origin develop

# 5. 정리
git branch -d hotfix/<name>
```

## Commit Types

| Type | Description |
|------|-------------|
| `feat` | 새 기능 |
| `fix` | 버그 수정 |
| `docs` | 문서 변경 |
| `style` | 포맷팅 (기능 변경 없음) |
| `refactor` | 리팩토링 |
| `test` | 테스트 추가/수정 |
| `chore` | 빌드, 설정 변경 |

## Quick Reference

| 작업 | 명령 |
|------|------|
| 브랜치 확인 | `git branch -a` |
| PR 목록 | `gh pr list` |
| PR 머지 | `gh pr merge <num>` |
| 태그 목록 | `git tag -l` |
| 원격 정리 | `git remote prune origin` |

## Safety Rules

1. main 직접 push 금지 - PR 통해 머지
2. force push 금지
3. feature는 develop에서 분기
4. 머지 전 빌드 테스트
