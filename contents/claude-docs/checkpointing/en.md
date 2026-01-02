# Checkpointing

English

# Checkpointing

Automatically track and rewind Claude’s edits to quickly recover from unwanted changes.

## How checkpoints work

### Automatic tracking

- Every user prompt creates a new checkpoint
- Checkpoints persist across sessions, so you can access them in resumed conversations
- Automatically cleaned up along with sessions after 30 days (configurable)

### Rewinding changes

- **Conversation only**: Rewind to a user message while keeping code changes
- **Code only**: Revert file changes while keeping the conversation
- **Both code and conversation**: Restore both to a prior point in the session

## Common use cases

- **Exploring alternatives**: Try different implementation approaches without losing your starting point
- **Recovering from mistakes**: Quickly undo changes that introduced bugs or broke functionality
- **Iterating on features**: Experiment with variations knowing you can revert to working states

## Limitations

### Bash command changes not tracked

```
rm file.txt
mv old.txt new.txt
cp source.txt dest.txt
```

### External changes not tracked

### Not a replacement for version control

- Continue using version control (ex. Git) for commits, branches, and long-term history
- Checkpoints complement but don’t replace proper version control
- Think of checkpoints as “local undo” and Git as “permanent history”

## See also

- [Interactive mode](/docs/en/interactive-mode) - Keyboard shortcuts and session controls
- [Slash commands](/docs/en/slash-commands) - Accessing checkpoints using `/rewind`
- [CLI reference](/docs/en/cli-reference) - Command-line options

Was this page helpful?
