---
name: pr-description
description: Writes pull request descriptions. Use when creating a PR, writing a PR, or when the user asks to summarize changes for a pull request.
---

When writing a PR description:

1. Run `git diff main...HEAD` to see all changes on this branch
2. Write a description following this format:

## What

One sentence explaining what this PR does.

## Why

Brief context on why this change is needed

## Changes

- Bullet points of specific changes made
- Group related changes together
- Mention any files deleted or renamed
