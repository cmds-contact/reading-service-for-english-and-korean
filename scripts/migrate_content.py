#!/usr/bin/env python3
"""
Content Migration Script
Migrates content from contents_migration/ to contents/ folder structure.
Tracks progress and can resume from where it left off.
"""

import os
import re
import yaml
import json
from pathlib import Path
from datetime import datetime

# Configuration
PROJECT_ROOT = Path(__file__).parent.parent
MIGRATION_SOURCE = PROJECT_ROOT / "contents_migration"
CONTENTS_DIR = PROJECT_ROOT / "contents"
PROGRESS_FILE = PROJECT_ROOT / "scripts" / "migration_progress.json"

# Channel mapping based on URL patterns
def get_channel_from_url(url):
    """Determine channel based on source URL."""
    if not url:
        return "unknown"

    # Anthropic URLs
    if "anthropic.com/news" in url:
        return "anthropic-blog"
    if "anthropic.com/research" in url:
        return "anthropic-research"
    if "docs.anthropic.com" in url:
        if "claude-code" in url:
            return "claude-code-docs"
        return "claude-docs"
    if "anthropic.com" in url:
        return "anthropic-blog"  # fallback for anthropic

    # Google URLs
    if "blog.google" in url:
        return "google-blog"
    if "developers.google" in url:
        return "google-developers"
    if "ai.google" in url:
        return "google-ai"
    if "google.com" in url:
        return "google-blog"  # fallback for google

    # OpenAI URLs
    if "openai.com/index" in url:
        return "openai-blog"
    if "openai.com/research" in url:
        return "openai-research"
    if "platform.openai.com" in url:
        return "openai-docs"
    if "openai.com" in url:
        return "openai-blog"  # fallback for openai

    return "unknown"


# Fallback channel mapping based on source folder (used when URL is empty)
CHANNEL_MAP = {
    "claude-blog": "anthropic-blog",
    "gemini-blog": "google-blog",
    "openai-blog": "openai-blog",
}

# Category normalization
CATEGORY_MAP = {
    "AI/Gemini Models": "Product",
    "AI": "AI",
    "Product": "Product",
    "Research": "Research",
    "Business": "Business",
    "Policy": "Policy",
    "Infrastructure": "Infrastructure",
}


def load_progress():
    """Load migration progress from file."""
    if PROGRESS_FILE.exists():
        with open(PROGRESS_FILE, "r") as f:
            return json.load(f)
    return {"migrated": [], "failed": [], "skipped": []}


def save_progress(progress):
    """Save migration progress to file."""
    PROGRESS_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(PROGRESS_FILE, "w") as f:
        json.dump(progress, f, indent=2, ensure_ascii=False)


def parse_frontmatter(content):
    """Parse YAML frontmatter from markdown content."""
    match = re.match(r'^---\s*\n(.*?)\n---\s*\n', content, re.DOTALL)
    if match:
        try:
            frontmatter = yaml.safe_load(match.group(1))
            body = content[match.end():]
            return frontmatter, body
        except yaml.YAMLError:
            return None, content
    return None, content


def extract_slug_from_filename(filename):
    """Extract slug from filename like '2025-10-16_slug.md' or '2025-10-16_slug_kr.md'."""
    # Remove .md extension
    name = filename.replace(".md", "")
    # Remove date prefix
    match = re.match(r'\d{4}-\d{2}-\d{2}_(.+)', name)
    if match:
        slug = match.group(1)
        # Remove _kr suffix if present
        if slug.endswith("_kr"):
            slug = slug[:-3]
        return slug
    return name


def extract_date_from_filename(filename):
    """Extract date from filename."""
    match = re.match(r'(\d{4}-\d{2}-\d{2})_', filename)
    if match:
        return match.group(1)
    return None


def find_file_pairs(source_dir):
    """Find English and Korean file pairs in source directory."""
    pairs = {}

    for file in source_dir.glob("*.md"):
        filename = file.name
        slug = extract_slug_from_filename(filename)

        if slug not in pairs:
            pairs[slug] = {"en": None, "ko": None, "date": None}

        if "_kr.md" in filename:
            pairs[slug]["ko"] = file
        else:
            pairs[slug]["en"] = file
            pairs[slug]["date"] = extract_date_from_filename(filename)

    return pairs


def normalize_category(category):
    """Normalize category to standard values."""
    if category in CATEGORY_MAP:
        return CATEGORY_MAP[category]
    return "AI"


def generate_tags(frontmatter, channel):
    """Generate tags based on content."""
    tags = []

    title = frontmatter.get("title", "").lower()

    # Add channel-specific tags
    if channel.startswith("anthropic") or channel.startswith("claude"):
        tags.append("Claude")
    elif channel.startswith("google"):
        tags.append("Gemini")
    elif channel.startswith("openai"):
        tags.append("ChatGPT")

    # Add topic-based tags
    if "model" in title or "opus" in title or "haiku" in title or "sonnet" in title:
        tags.append("AI Model")
    if "code" in title or "coding" in title:
        tags.append("Coding")
    if "agent" in title:
        tags.append("AI Agent")
    if "safety" in title or "security" in title:
        tags.append("AI Safety")
    if "partner" in title:
        tags.append("Partnership")

    return tags if tags else ["AI"]


def create_meta_yaml(slug, en_frontmatter, ko_frontmatter, fallback_channel, date):
    """Create meta.yaml content."""
    source_url = en_frontmatter.get("source", "")

    # Determine channel from URL, fallback to folder-based channel
    channel = get_channel_from_url(source_url)
    if channel == "unknown":
        channel = fallback_channel

    category = normalize_category(en_frontmatter.get("category", "AI"))
    tags = generate_tags(en_frontmatter, channel)

    meta = {
        "id": slug,
        "created": date,
        "updated": date,
        "channel": channel,
        "source": {
            "url": source_url,
            "published": date,
        },
        "category": category,
        "tags": tags,
        "languages": {
            "en": {
                "title": en_frontmatter.get("title", ""),
                "type": "original",
            },
            "ko": {
                "title": ko_frontmatter.get("title", en_frontmatter.get("title", "")) if ko_frontmatter else en_frontmatter.get("title", ""),
                "type": "translation",
                "translator": "human",
            },
        },
    }

    return meta


def migrate_content_pair(slug, pair, channel, progress):
    """Migrate a single content pair (en + ko)."""
    target_dir = CONTENTS_DIR / slug

    # Check if already migrated
    if target_dir.exists() and (target_dir / "meta.yaml").exists():
        print(f"  [SKIP] {slug} - already exists")
        if slug not in progress["skipped"]:
            progress["skipped"].append(slug)
        return True

    # Need at least English version
    if not pair["en"]:
        print(f"  [SKIP] {slug} - no English version")
        if slug not in progress["skipped"]:
            progress["skipped"].append(slug)
        return False

    try:
        # Read and parse English file
        with open(pair["en"], "r", encoding="utf-8") as f:
            en_content = f.read()
        en_frontmatter, en_body = parse_frontmatter(en_content)

        # Read and parse Korean file if exists
        ko_frontmatter, ko_body = None, None
        if pair["ko"]:
            with open(pair["ko"], "r", encoding="utf-8") as f:
                ko_content = f.read()
            ko_frontmatter, ko_body = parse_frontmatter(ko_content)

        # Create target directory
        target_dir.mkdir(parents=True, exist_ok=True)

        # Generate meta.yaml
        date = pair["date"] or en_frontmatter.get("date", datetime.now().strftime("%Y-%m-%d"))
        if hasattr(date, 'strftime'):
            date = date.strftime("%Y-%m-%d")

        meta = create_meta_yaml(slug, en_frontmatter or {}, ko_frontmatter, channel, date)

        # Write meta.yaml
        with open(target_dir / "meta.yaml", "w", encoding="utf-8") as f:
            yaml.dump(meta, f, default_flow_style=False, allow_unicode=True, sort_keys=False)

        # Write en.md
        with open(target_dir / "en.md", "w", encoding="utf-8") as f:
            f.write(en_body.strip() + "\n")

        # Write ko.md
        if ko_body:
            with open(target_dir / "ko.md", "w", encoding="utf-8") as f:
                f.write(ko_body.strip() + "\n")
        else:
            # Create placeholder for Korean version
            with open(target_dir / "ko.md", "w", encoding="utf-8") as f:
                f.write(f"# {meta['languages']['ko']['title']}\n\n[Translation pending]\n")

        print(f"  [OK] {slug}")
        if slug not in progress["migrated"]:
            progress["migrated"].append(slug)
        return True

    except Exception as e:
        print(f"  [FAIL] {slug} - {str(e)}")
        if slug not in progress["failed"]:
            progress["failed"].append(slug)
        return False


def migrate_blog_folder(folder_name, progress):
    """Migrate all content from a blog folder."""
    source_dir = MIGRATION_SOURCE / folder_name
    channel = CHANNEL_MAP.get(folder_name, folder_name)

    if not source_dir.exists():
        print(f"Source folder not found: {source_dir}")
        return

    print(f"\n=== Migrating {folder_name} (channel: {channel}) ===")

    pairs = find_file_pairs(source_dir)
    print(f"Found {len(pairs)} content items")

    for slug, pair in sorted(pairs.items()):
        migrate_content_pair(slug, pair, channel, progress)
        save_progress(progress)


def print_summary(progress):
    """Print migration summary."""
    print("\n" + "=" * 50)
    print("MIGRATION SUMMARY")
    print("=" * 50)
    print(f"Migrated: {len(progress['migrated'])}")
    print(f"Skipped:  {len(progress['skipped'])}")
    print(f"Failed:   {len(progress['failed'])}")

    if progress["failed"]:
        print("\nFailed items:")
        for item in progress["failed"]:
            print(f"  - {item}")


def main():
    """Main migration function."""
    print("Content Migration Script")
    print(f"Source: {MIGRATION_SOURCE}")
    print(f"Target: {CONTENTS_DIR}")

    progress = load_progress()
    print(f"\nResuming from previous progress:")
    print(f"  Already migrated: {len(progress['migrated'])}")
    print(f"  Already skipped: {len(progress['skipped'])}")

    # Migrate each blog folder
    for folder_name in ["claude-blog", "gemini-blog", "openai-blog"]:
        migrate_blog_folder(folder_name, progress)

    save_progress(progress)
    print_summary(progress)


if __name__ == "__main__":
    main()
