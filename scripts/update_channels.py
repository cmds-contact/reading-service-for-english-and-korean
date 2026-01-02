#!/usr/bin/env python3
"""
Update channel values in existing meta.yaml files based on source URL.
"""

import os
import yaml
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent
CONTENTS_DIR = PROJECT_ROOT / "contents"


def get_channel_from_url(url):
    """Determine channel based on source URL."""
    if not url:
        return None

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
        return "anthropic-blog"

    # Google URLs
    if "blog.google" in url:
        return "google-blog"
    if "developers.google" in url:
        return "google-developers"
    if "ai.google" in url:
        return "google-ai"
    if "google.com" in url:
        return "google-blog"

    # OpenAI URLs
    if "openai.com/index" in url:
        return "openai-blog"
    if "openai.com/research" in url:
        return "openai-research"
    if "platform.openai.com" in url:
        return "openai-docs"
    if "openai.com" in url:
        return "openai-blog"

    return None


def update_meta_yaml(meta_path):
    """Update channel in a meta.yaml file based on source URL."""
    with open(meta_path, "r", encoding="utf-8") as f:
        meta = yaml.safe_load(f)

    source_url = meta.get("source", {}).get("url", "")
    old_channel = meta.get("channel", "")
    new_channel = get_channel_from_url(source_url)

    if new_channel and new_channel != old_channel:
        meta["channel"] = new_channel
        with open(meta_path, "w", encoding="utf-8") as f:
            yaml.dump(meta, f, default_flow_style=False, allow_unicode=True, sort_keys=False)
        return old_channel, new_channel
    return None, None


def main():
    """Update all meta.yaml files."""
    print("Updating channel values based on source URLs...")
    print(f"Contents directory: {CONTENTS_DIR}\n")

    updated = 0
    unchanged = 0

    for content_dir in sorted(CONTENTS_DIR.iterdir()):
        if not content_dir.is_dir():
            continue

        meta_path = content_dir / "meta.yaml"
        if not meta_path.exists():
            continue

        old_channel, new_channel = update_meta_yaml(meta_path)
        if new_channel:
            print(f"  {content_dir.name}: {old_channel} -> {new_channel}")
            updated += 1
        else:
            unchanged += 1

    print(f"\n=== Summary ===")
    print(f"Updated: {updated}")
    print(f"Unchanged: {unchanged}")


if __name__ == "__main__":
    main()
